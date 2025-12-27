const express = require("express");
const router = express.Router();

// ✅ NVIDIA AI analyzer
const analyzeMessage = require("../analyzeMessage");

router.post("/report", async (req, res) => {
  const { name, message, screenshot } = req.body;

  // ✅ Analyze using NVIDIA
  const result = await analyzeMessage({
    message,
    screenshot
  });

  return res.json({
    success: true,
    verdict: result.verdict,
    reportedBy: name || "Anonymous"
  });
});

module.exports = router;
