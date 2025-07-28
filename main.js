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
  secret: String
});

const secretKey = "thisislittlesecret";
userSchema.plugin(encrypt, { secret: secretKey, encryptedFields: ["password"] });

const User = mongoose.model("User", userSchema);

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
}

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register", { alertMessage: null });
});

app.post("/register", async (req, res) => {
  const { username, usermail, password } = req.body;
  try {
    const existingUser = await User.findOne({ email: usermail });
    if (existingUser) {
      return res.render("register", { alertMessage: "User already exists. Please login." });
    } else {
      const newUser = new User({
        name: username,
        email: usermail,
        password: password
      });
      await newUser.save();
      res.redirect("/login");
    }
  } catch (err) {
    console.log("Registration error:", err);
    res.status(500).render("register", { alertMessage: "Registration failed. Please try again." });
  }
});

app.get("/login", (req, res) => {
  res.render("login", { alertMessage: null });
});

app.post("/login", async (req, res) => {
  const { usermail, password } = req.body;
  try {
    const user = await User.findOne({ email: usermail });
    if (!user) {
      return res.render("login", { alertMessage: "User not found" });
    }
    if (user.password !== password) {
      return res.render("login", { alertMessage: "Invalid password" });
    }

    req.session.userId = user._id;
    res.redirect("/secret");
  } catch (err) {
    console.log("Login error:", err);
    res.status(500).render("login", { alertMessage: "Login failed. Please try again." });
  }
});

app.get("/secret", isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({ secret: { $ne: null } });
    const currentUser = await User.findById(req.session.userId);
    res.render("secret", {
      secrets: users,
      ownSecret: currentUser.secret || null
    });
  } catch (err) {
    console.log("Secrets fetch error:", err);
    res.status(500).send("Failed to load secrets.");
  }
});

app.get("/submit", isAuthenticated, (req, res) => {
  res.render("submit");
});

app.post("/submit", isAuthenticated, async (req, res) => {
  const secret = req.body.secret;
  try {
    await User.findByIdAndUpdate(req.session.userId, { secret: secret });
    res.redirect("/secret");
  } catch (err) {
    console.log("Submit error:", err);
    res.status(500).send("Failed to submit secret.");
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.log("Logout error:", err);
    res.redirect("/");
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});
