import "./screenshot_page.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

function Screenshot_page() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const resultRef = useRef(null);

  // 📸 handle image selection
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setAnalysis(null);
    }
  };

  // 🔍 analyze screenshot (calls /api/ocr only)
  const analyzeScreenshot = async () => {
    if (!imageFile) {
      alert("Please upload an image");
      return;
    }

    setLoading(true);
    setAnalysis(null);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/ocr", {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      setAnalysis({
        verdict: data.verdict,
        explanation: data.explanation,
        text: data.extractedText
      });
    } catch (error) {
      setAnalysis({
        verdict: "Error",
        explanation: "Server not responding",
        text: ""
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // 🎨 verdict styling
  const getResultClass = (verdict) => {
    if (verdict === "Scam") return "scam";
    if (verdict === "Safe") return "safe";
    return "error";
  };

  return (
    <div className="scan-page">
      <div className="scan-header">
        <button className="back-btn" onClick={() => navigate("/home")}>
          ←
        </button>
        <h2>Screenshot Analysis</h2>
      </div>

      <div className="upload-box">
        <p className="upload-icon">🖼️</p>
        <p className="upload-text">Upload a screenshot or image</p>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          style={{ display: "none" }}
          id="fileInput"
        />

        <button
          className="upload-btn"
          onClick={() => document.getElementById("fileInput").click()}
        >
          Choose Image
        </button>

        {preview && (
          <img
            src={preview}
            alt="Selected"
            className="preview-img"
          />
        )}
      </div>

      <button
        className="scan-btn"
        onClick={analyzeScreenshot}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Screenshot"}
      </button>

      {analysis && (
        <div
          ref={resultRef}
          className={`result-box ${getResultClass(analysis.verdict)}`}
        >
          <strong>
            {analysis.verdict === "Scam" && "⚠ Scam"}
            {analysis.verdict === "Safe" && "✓ Safe"}
            {analysis.verdict === "Error" && "⚠ Error"}
          </strong>

          <div className="result-desc">
            {analysis.explanation}
          </div>

          {/* 👀 OCR EXTRACTED TEXT (DEBUG VIEW) */}
          {analysis.text && (
            <div className="ocr-text-box">
              <h4>Extracted Text (OCR)</h4>
              <pre className="ocr-text">
                {analysis.text}
              </pre>
            </div>
          )}

          {/* 🔴 REPORT BUTTON ONLY IF SCAM */}
          {analysis.verdict === "Scam" && (
            <button
              className="report-btn"
              onClick={() =>
                navigate("/complaint", {
                  state: { message: analysis.text }
                })
              }
            >
              Report Scam
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Screenshot_page;
