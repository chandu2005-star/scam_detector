import "./text_page.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Text_page() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeMessage = async () => {
    if (!message.trim()) {
      setAnalysis({
        verdict: "Error",
        explanation: "Please enter a message to analyze."
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      setAnalysis({
        verdict: data.verdict,
        explanation:
          data.verdict === "Scam"
            ? "This message is identified as a scam."
            : "This message is identified as safe."
      });
    } catch (err) {
      setAnalysis({
        verdict: "Error",
        explanation: "Server not responding."
      });
    } finally {
      setLoading(false);
    }
  };

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
        <h2>Check Text Message</h2>
      </div>

      <textarea
        className="scan-input"
        placeholder="Paste the message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button className="scan-btn" onClick={analyzeMessage} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Message"}
      </button>

      {analysis && (
        <div className={`result-box ${getResultClass(analysis.verdict)}`}>
          <strong>
            {analysis.verdict === "Scam" && "⚠ Scam"}
            {analysis.verdict === "Safe" && "✓ Safe"}
            {analysis.verdict === "Error" && "⚠ Error"}
          </strong>

          <div className="result-desc">{analysis.explanation}</div>

          {analysis.verdict === "Scam" && (
            <button
              className="report-btn"
              onClick={() =>
                navigate("/complaint", { state: { message } })
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

export default Text_page;
