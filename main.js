require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const session = require("express-session");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "superSecretSessionKey",
  resave: false,
  saveUninitialized: false
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL);

// Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  secret: [String]
});

const secretKey = "thisislittlesecret";
userSchema.plugin(encrypt, { secret: secretKey, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

// Middleware
function isAuthenticated(req, res, next) {
  if (req.session.userId) return next();
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, usermail, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: usermail });
    if (existingUser) {
      res.render("register",{alertMessage : "Existing User Please Login "});
      res.redirect("/login");
    } else {
      const newUser = new User({
        name: username,
        email: usermail,
        password: password
      });
      await newUser.save();
      req.session.userId = newUser._id;
      res.redirect("/secret");
    }
  } catch (err) {
    console.log("Registration error:", err);
    res.status(500).send("Registration failed.");
  }
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { usermail, password } = req.body;
  try {
    const user = await User.findOne({ email: usermail });
    if (!user) return res.render("login",{alertMessage: "Email Not Found"});
    if (user.password !== password) return res.render("login",{alertMessage: "Invalid Password"});

    req.session.userId = user._id;
    res.redirect("/secret");
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).send("Login failed.");
  }
});

app.get("/secret", isAuthenticated, async (req, res) => {
  try {
    const allUsers = await User.find({ secret: { $exists: true, $not: { $size: 0 } } });
    const currentUser = await User.findById(req.session.userId);
    res.render("secret", {
      users: allUsers,
      CurrentUserId: req.session.userId,
      user: currentUser
    });
  } catch (err) {
    console.log("Secret page error:", err);
    res.status(500).send("Failed to load secrets.");
  }
});

app.post("/submit", isAuthenticated, async (req, res) => {
  const secret = req.body.secret;
  try {
    const users = await User.findById(req.session.userId);
    users.secret.push(secret);
    await users.save();
    // res.render("secret",{alertMessage: "Secret Submitted Succesfully .."})
    res.redirect("/secret");
  } catch (err) {
    console.log("Submit error:", err);
    res.status(500).send("Failed to submit secret.");
  }
});

app.post("/edit", isAuthenticated, async (req, res) => {
  const oldSecret = req.body.oldSecret;
  const newSecret = req.body.newSecret;
  try {
    const user = await User.findById(req.session.userId);
    const index = user.secret.indexOf(oldSecret);
    if (index > -1) {
      user.secret[index] = newSecret;
      await user.save();
    }
    res.redirect("/secret");
  } catch (err) {
    console.log("Edit error:", err);
    res.status(500).send("Failed to edit secret.");
  }
});

app.post("/icon", isAuthenticated, (req, res) => {
  const secret = req.body.secret;
  res.render("edit", { secret }); // If you want to stay on same page, you’ll need a flag here. Not used now.
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log("Logout error:", err);
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});
