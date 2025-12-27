import "./first_page.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function First_page() {
  const navigate = useNavigate();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Error message state
  const [error, setError] = useState("");

  const isDisabled =
    emailOrPhone.trim() === "" || password.trim() === "";

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const payload = { password };

    if (emailOrPhone.includes("@")) payload.email = emailOrPhone;
    else payload.phone = emailOrPhone;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/home");
      } else {
        setError(data.message);
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <p className="gmail">Enter your Gmail id / phone</p>
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

      <p className="password">Enter your password</p>

      <div style={{ position: "relative", marginBottom: "8px" }}>
        <input
          type={showPassword ? "text" : "password"}
          className="passwordbox"
          placeholder="Enter Here"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          style={{
            marginBottom: "0",
            paddingRight: "44px"
          }}
        />

        <div
          onClick={() => setShowPassword(!showPassword)}
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
          {showPassword ? "🙉" : "🙈"}
        </div>
      </div>

      {/* Error shown under PASSWORD field */}
      {error && <p className="error-text">Enter a valid Gmail id/phone</p>}

      <button
        className="submitbutton"
        disabled={isDisabled || loading}
        onClick={handleLogin}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <button
        className="submitbutton signup"
        onClick={() => navigate("/sign_in")}
      >
        Sign Up
      </button>

      <button
        className="forgotpass"
        onClick={() => navigate("/forgot")}
      >
        Forgot password?
      </button>
    </div>
  );
}

export default First_page;
