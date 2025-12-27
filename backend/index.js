require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ AI (NVIDIA)
const analyzeMessage = require("./analyzeMessage");

app.post("/api/analyze", async (req, res) => {
  const result = await analyzeMessage(req.body);
  res.json(result);
});



// auth
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// report (text)
const reportRoutes = require("./routes/report");
app.use("/api", reportRoutes);

// ocr (screenshot)
const ocrRoutes = require("./routes/ocr");
app.use("/api", ocrRoutes);

// complaints
const complaintRoutes = require("./routes/complaint");
app.use("/api/complaint", complaintRoutes);

app.get("/", (req, res) => {
  res.send("Backend running");
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
