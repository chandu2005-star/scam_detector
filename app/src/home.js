import "./home.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.name) {
      setName(user.name);
    }
  }, []);

  return (
    <div className="home">
      {/* Top bar */}
      <div className="topbar">
        <h3 className="appname">Scam Detector</h3>
        <div
          className="profile"
          onClick={() => navigate("/profile")}
        >
          👤
        </div>
      </div>

      {/* Floating banner */}
      <div className="floating-banner">
        Protect yourself from scam messages ⚠️
      </div>

      {/* Background bubbles */}
      <div className="bubbles">
        <span></span><span></span><span></span><span></span>
        <span></span><span></span><span></span><span></span>
      </div>

      {/* Main content */}
      <div className="content">
        <h1 className="welcome">
          Welcome {name} 👋
        </h1>

        <p className="subtitle">
          Detect scam messages instantly using AI
        </p>

        <div className="actions">
          <div
            className="card"
            onClick={() => navigate("/text_page")}
          >
            📝
            <span>Check Text Message</span>
          </div>

          <div
            className="card"
            onClick={() => navigate("/screenshot")}
          >
            🖼️
            <span>Check Screenshot</span>
          </div>
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="bottom-buttons">
        <button
          className="viewcomplaints"
          onClick={() => navigate("/view-complaints")}
        >
          🚨 View Complaints
        </button>
      </div>

      {/* Footer */}
      <p className="footer">
        Stay safe from digital frauds and scam messages
      </p>
    </div>
  );
}

export default Home;
