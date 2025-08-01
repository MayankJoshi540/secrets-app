# 🔐 Secrets App

A Node.js and Express-based web application that allows users to register, log in, and anonymously share their secrets securely.

🌐 **Live Demo**: [https://secrets-app-production.up.railway.app/)

---

## 📌 Features

- User Registration & Login
- Password hashing and secure authentication
- Sessions with persistent login
- MongoDB data storage with Mongoose
- Secret submission by logged-in users
- Secure environment variable usage
- Tailwind CSS for modern UI styling
- Deployed on Render

---

## 🚀 Technologies Used

- **Node.js**
- **Express.js**
- **EJS (Embedded JavaScript Templating)**
- **MongoDB & Mongoose**
- **bcrypt** for password hashing
- **express-session** for session management
- **dotenv** for environment configuration
- **Tailwind CSS** for frontend styling
- **Render** for deployment

---

## 📁 Folder Structure

```
.
├── views/             # EJS templates
│   ├── home.ejs
│   ├── login.ejs
│   ├── register.ejs
│   └── secrets.ejs
├── public/            # Static files (CSS, Tailwind)
├── .env               # Environment variables (not committed)
├── .gitignore         # Files to ignore in Git
├── package.json       # Project metadata and dependencies
├── app.js / main.js   # Main application file
```

---

## 🛠️ Installation & Local Setup

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/secrets-app.git
   cd secrets-app
   ```

2. **Install dependencies**  
   ```bash
   npm install
   ```

3. **Create a `.env` file**  
   ```env
   PORT=3000
   MONGO_URL=your_mongo_db_connection_string
   SESSION_SECRET=your_secret_key
   ```

4. **Run the app**  
   ```bash
   node main.js
   ```

5. **Visit**  
   [http://localhost:3000](http://localhost:3000)

---

## 🧪 Sample Credentials (for testing)

- Register using your own email/password
- Then log in to post/view secrets anonymously

---

## ⚠️ Deployment Notes

The app is deployed on Render at:  
🔗 [https://secrets-app-4ssh.onrender.com/)

---

## 📄 License

This project is for educational purposes. Feel free to fork, modify, and use it for learning!

---

## ✨ Author

Developed by **Mayank Joshi**  
[LinkedIn](https://www.linkedin.com/in/mayank-joshi-a77935220) | [GitHub](https://github.com/MayankJoshi540)
