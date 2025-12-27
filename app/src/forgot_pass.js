import './forgot_pass.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Forgot_pass() {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ error state
  const [error, setError] = useState("");

  const isDisabled =
    emailOrPhone.trim() === "" || otp.length !== 4;

  const handleForgot = async () => {
    setLoading(true);
    setError("");

    const payload = {};

    if (emailOrPhone.includes("@")) {
      payload.email = emailOrPhone;
    } else {
      payload.phone = emailOrPhone;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );

      const data = await res.json();

      if (data.success) {
        // store for reset page
        localStorage.setItem(
          "resetUser",
          JSON.stringify(payload)
        );
        navigate("/new_pass");
      } else {
        setError(data.message || "Invalid email or phone");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <p className="gmail">Enter your registered email / phone</p>
      <input
        type="text"
        className="gmailbox"
        placeholder="Enter Here"
        value={emailOrPhone}
        onChange={(e) => {
          setEmailOrPhone(e.target.value);
          setError("");
        }}
      />

      <p className="gmail">Enter OTP</p>
      <input
        type="text"
        className="gmailbox"
        placeholder="Enter 4-digit OTP"
        maxLength={4}
        inputMode="numeric"
        value={otp}
        onChange={(e) => {
          setOtp(e.target.value.replace(/[^0-9]/g, ""));
          setError("");
        }}
      />

      {/* 🔴 Error under OTP field */}
      {error && <p className="error-text">Invalid Gmail/Phone</p>}

      <button
        className="submitbutton"
        disabled={isDisabled || loading}
        onClick={handleForgot}
      >
        {loading ? "Verifying..." : "Reset Password"}
      </button>

      <button
        className="forgotpass"
        onClick={() => navigate("/")}
      >
        Back to Login
      </button>
    </div>
  );
}

export default Forgot_pass;
