const express = require("express");
const multer = require("multer");
const Tesseract = require("tesseract.js");
const analyzeMessage = require("../analyzeMessage");

const router = express.Router();

// Store image in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({
        success: false,
        verdict: "Error",
        explanation: "No image uploaded"
      });
    }

    /* ===============================
       1️⃣ OCR: Image → Raw Text
       =============================== */
    const ocrResult = await Tesseract.recognize(
      req.file.buffer,
      "eng",
      {
        tessedit_char_whitelist:
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789:/.-₹$ "
      }
    );

    let extractedText = ocrResult.data.text || "";

    /* ===============================
       2️⃣ OCR TEXT CLEANUP (CRITICAL)
       =============================== */
    extractedText = extractedText
      .replace(/\n+/g, " ")
      .replace(/\s+/g, " ")
      .replace(/tap to load preview/gi, "")
      .replace(/https?\s*:\s*\/\s*\//gi, "https://") // fix https : //
      .replace(/\s*\.\s*/g, ".") // fix idfcfs . in
      .trim();

    /* ===============================
       3️⃣ ANALYZE CLEAN TEXT
       =============================== */
    const analysis = analyzeMessage({
      message: extractedText
    });

    return res.json({
      success: true,
      extractedText,   // 👀 show this in frontend
      verdict: analysis.verdict,
      explanation:
        analysis.verdict === "Scam"
          ? "Scam indicators found in screenshot text."
          : "No scam indicators found."
    });

  } catch (error) {
    console.error("OCR error:", error);
    return res.status(500).json({
      success: false,
      verdict: "Error",
      explanation: "OCR processing failed"
    });
  }
});

module.exports = router;
