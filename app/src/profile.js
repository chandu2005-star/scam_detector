import "./profile.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Profile() {
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // not logged in
      navigate("/");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/home")}>←</button>
        <h2>Profile</h2>
      </div>

      <div className="profile-card">
        <div className="avatar">👤</div>
        <h3 className="name">{user.name}</h3>
        <p className="email">{user.email || user.phone}</p>
      </div>

      <div className="profile-actions">
        <button
          className="action-btn"
          onClick={() => navigate("/editprofile")}
        >
          Edit Profile
        </button>

        <button
          className="action-btn danger"
          onClick={() => setShowLogout(true)}
        >
          Logout
        </button>
      </div>

      {showLogout && (
        <div className="logout-overlay">
          <div className="logout-modal">
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>

            <div className="logout-actions">
              <button
                className="cancel-btn"
                onClick={() => setShowLogout(false)}
              >
                Cancel
              </button>

              <button
                className="confirm-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
