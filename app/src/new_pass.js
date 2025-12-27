import "./new_pass.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function New_pass() {
  const navigate = useNavigate();

  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🐵 separate monkey toggles
  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  const isDisabled = pass1.trim() === "" || pass2.trim() === "";

  const handleConfirm = async () => {
    if (pass1 !== pass2) {
      setError("Passwords do not match");
      return;
    }

    const resetUser = JSON.parse(localStorage.getItem("resetUser"));

    if (!resetUser) {
      setError("Session expired. Try again.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...resetUser,
            newPassword: pass1
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        localStorage.removeItem("resetUser");
        alert("Password reset successful");
        navigate("/");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <p className="password">Enter new password</p>

      {/* 🔐 New password */}
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <input
          type={showPass1 ? "text" : "password"}
          className="passwordbox"
          placeholder="Enter Here"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          style={{ marginBottom: "0", paddingRight: "44px" }}
        />

        <div
          onClick={() => setShowPass1(!showPass1)}
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "20px",
            userSelect: "none"
          }}
        >
          {showPass1 ? "🙉" : "🙈"}
        </div>
      </div>

      <p className="password">Confirm new password</p>

      {/* 🔐 Confirm password */}
      <div style={{ position: "relative", marginBottom: "24px" }}>
        <input
          type={showPass2 ? "text" : "password"}
          className="passwordbox"
          placeholder="Enter Here"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          style={{ marginBottom: "0", paddingRight: "44px" }}
        />

        <div
          onClick={() => setShowPass2(!showPass2)}
          style={{
            position: "absolute",
            right: "14px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
            fontSize: "20px",
            userSelect: "none"
          }}
        >
          {showPass2 ? "🙉" : "🙈"}
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      <button
        className="submitbutton"
        disabled={isDisabled || loading}
        onClick={handleConfirm}
      >
        {loading ? "Updating..." : "Confirm"}
      </button>
    </div>
  );
}

export default New_pass;
