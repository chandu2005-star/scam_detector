import "./complaint.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Complaint() {
  const navigate = useNavigate();

  const [sender, setSender] = useState("");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const isDisabled =
    sender.trim() === "" || description.trim() === "";

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      alert("User not logged in");
      return;
    }

    const userId = user.email || user.phone; // 🔑 IMPORTANT

    try {
      const res = await fetch("http://localhost:5000/api/complaint/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender,
          description,
          userId
        })
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const resetForm = () => {
    setSender("");
    setDescription("");
    setSubmitted(false);
  };

  return (
    <div className="complaint-wrapper">
      <div className="complaint-card">

        <div className="complaint-header">
          <button
            className="complaint-back"
            onClick={() => navigate(-1)}
          >
            ←
          </button>
          <h2>Report Scam</h2>
        </div>

        <div className="field">
          <label>Scam Sender (Phone / Email)</label>
          <input
            type="text"
            placeholder="Enter phone number or email"
            value={sender}
            disabled={submitted}
            onChange={(e) => setSender(e.target.value)}
          />
        </div>

        <div className="field">
          <label>Scam Message Description</label>
          <textarea
            placeholder="Describe or paste the scam message"
            value={description}
            disabled={submitted}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          ></textarea>
        </div>

        <button
          className={`primary-btn ${submitted ? "success" : ""}`}
          disabled={submitted || isDisabled}
          onClick={handleSubmit}
        >
          {submitted ? "Submitted" : "Submit Complaint"}
        </button>

        {submitted && (
          <button
            className="secondary-btn"
            onClick={resetForm}
          >
            Submit Another Complaint
          </button>
        )}

      </div>
    </div>
  );
}

export default Complaint;
