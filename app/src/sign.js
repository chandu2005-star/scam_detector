import "./sign.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Sign_in() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🐵 monkey toggle
  const [showPassword, setShowPassword] = useState(false);

  // ✅ error state
  const [error, setError] = useState("");

  const isDisabled =
    name.trim() === "" ||
    emailOrPhone.trim() === "" ||
    password.trim() === "";

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    const payload = {
      name,
      password
    };

    if (emailOrPhone.includes("@")) {
      payload.email = emailOrPhone;
    } else {
      payload.phone = emailOrPhone;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            name,
            email: payload.email || null,
            phone: payload.phone || null
          })
        );
        navigate("/home");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout">
      <p>Name</p>
      <input
        type="text"
        className="gmailbox"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError("");
        }}
      />

      <p>Enter Gmail id / phone</p>
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

      <p>Enter your password</p>

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

      {/* 🔴 Error under PASSWORD */}
      {error && <p className="error-text">Invalid Gmail Id/phone</p>}

      <button
        className="submitbutton"
        disabled={isDisabled || loading}
        onClick={handleSignup}
      >
        {loading ? "Signing up..." : "Sign Up"}
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

export default Sign_in;
