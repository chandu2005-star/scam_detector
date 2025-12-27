const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "../data/complaints.json");

/* ✅ SUBMIT COMPLAINT (USER-SPECIFIC) */
router.post("/submit", (req, res) => {
  try {
    const { sender, description, userId } = req.body;

    if (!sender || !description || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    let complaints = [];
    if (fs.existsSync(filePath)) {
      complaints = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    complaints.push({
      userId,               // email or phone
      sender,
      description,
      date: new Date()
    });

    fs.writeFileSync(filePath, JSON.stringify(complaints, null, 2));

    res.json({
      success: true,
      message: "Complaint saved successfully"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* ✅ GET COMPLAINTS FOR LOGGED-IN USER */
router.get("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;

    let complaints = [];
    if (fs.existsSync(filePath)) {
      complaints = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    }

    const userComplaints = complaints.filter(
      c => c.userId === userId
    );

    res.json({
      success: true,
      complaints: userComplaints
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch complaints"
    });
  }
});

module.exports = router;
