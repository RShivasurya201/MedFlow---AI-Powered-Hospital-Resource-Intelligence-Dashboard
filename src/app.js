const express = require("express");
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://med-flow-ai-powered-hospital-resour.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));

const patientRoutes = require("./routes/patientRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const alertRoutes = require("./routes/alertRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();


app.use(express.json());

app.use("/api/patients", patientRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/predictions", predictionRoutes);  
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

module.exports = app;
