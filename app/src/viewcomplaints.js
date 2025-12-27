import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./viewcomplaints.css";

function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      setLoading(false);
      return;
    }

    const userId = user.email || user.phone; // 🔑 IMPORTANT

    fetch(`http://localhost:5000/api/complaint/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setComplaints(data.complaints);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="vc-wrapper">
      <div className="vc-card">
        <div className="vc-header">
          <button onClick={() => navigate(-1)}>←</button>
          <h2>Your Complaints</h2>
        </div>

        {loading && <p>Loading...</p>}
        {!loading && complaints.length === 0 && (
          <p>No complaints found.</p>
        )}

        {complaints.map((c, i) => (
          <div className="vc-item" key={i}>
            <p><b>Sender:</b> {c.sender}</p>
            <p><b>Message:</b> {c.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewComplaints;
