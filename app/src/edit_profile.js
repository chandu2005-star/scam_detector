import "./edit_profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Edit_profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      navigate("/");
      return;
    }

    setName(user.name);
    setContact(user.email || user.phone);
  }, [navigate]);

  const isDisabled = name.trim() === "" || contact.trim() === "";

  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    setLoading(true);

    const payload = {
      id: user.id,
      name
    };

    if (contact.includes("@")) {
      payload.email = contact;
    } else {
      payload.phone = contact;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/update-profile",
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
        // ✅ update localStorage immediately
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name: payload.name,
            email: payload.email || null,
            phone: payload.phone || null
          })
        );

        navigate("/profile");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-header">
        <button className="back-btn" onClick={() => navigate(-1)}>←</button>
        <h2>Edit Profile</h2>
      </div>

      <div className="edit-card">
        <div className="avatar">👤</div>

        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Email / Phone</label>
        <input
          type="text"
          placeholder="Enter email or phone"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />

        <button
          className="save-btn"
          disabled={isDisabled || loading}
          onClick={handleSave}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default Edit_profile;
