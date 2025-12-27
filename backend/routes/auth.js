const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// path to users.json
const usersFilePath = path.join(__dirname, "../data/users.json");

/* ===============================
   SIGNUP API
   POST /api/auth/signup
=============================== */
router.post("/signup", (req, res) => {
  const { name, email, phone, password } = req.body;

  // 1️⃣ basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  // 2️⃣ read existing users
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  // 3️⃣ check if user already exists
  const userExists = users.find(
    user => user.email === email || user.phone === phone
  );

  if (userExists) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  // 4️⃣ create new user
  const newUser = {
    id: Date.now(),
    name,
    email,
    phone: phone || null,
    password // plain password (hackathon-safe)
  };

  // 5️⃣ save user
  users.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  // 6️⃣ response
  return res.json({
    success: true,
    message: "Signup successful",
    userId: newUser.id
  });
});

/* ===============================
   LOGIN API
   POST /api/auth/login
=============================== */
router.post("/login", (req, res) => {
  const { email, phone, password } = req.body;

  // basic validation
  if ((!email && !phone) || !password) {
    return res.status(400).json({
      success: false,
      message: "Email or phone and password are required"
    });
  }

  // read users
  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  // find user by email or phone
  const user = users.find(
    u =>
      (email && u.email === email) ||
      (phone && u.phone === phone)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // check password
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid password"
    });
  }

  // success
  return res.json({
    success: true,
    message: "Login successful",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    }
  });
});
/* ===============================
   FORGOT PASSWORD (MOCK OTP)
   POST /api/auth/forgot-password
=============================== */
router.post("/forgot-password", (req, res) => {
  const { email, phone } = req.body;

  if (!email && !phone) {
    return res.status(400).json({
      success: false,
      message: "Email or phone is required"
    });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  const user = users.find(
    u =>
      (email && u.email === email) ||
      (phone && u.phone === phone)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // OTP is mocked — always success
  return res.json({
    success: true,
    message: "OTP verified successfully (mocked)"
  });
});

/* ===============================
   RESET PASSWORD
   POST /api/auth/reset-password
=============================== */
router.post("/reset-password", (req, res) => {
  const { email, phone, newPassword } = req.body;

  if ((!email && !phone) || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email or phone and new password are required"
    });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  const userIndex = users.findIndex(
    u =>
      (email && u.email === email) ||
      (phone && u.phone === phone)
  );

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  // Update password
  users[userIndex].password = newPassword;

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  return res.json({
    success: true,
    message: "Password reset successful"
  });
});

/* ===============================
   UPDATE PROFILE
   POST /api/auth/update-profile
=============================== */
router.post("/update-profile", (req, res) => {
  const { id, name, email, phone } = req.body;

  if (!id || !name || (!email && !phone)) {
    return res.status(400).json({
      success: false,
      message: "Invalid data"
    });
  }

  const users = JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));

  const userIndex = users.findIndex(user => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  users[userIndex].name = name;
  users[userIndex].email = email || null;
  users[userIndex].phone = phone || null;

  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  return res.json({
    success: true,
    message: "Profile updated successfully"
  });
});

module.exports = router;
