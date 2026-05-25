const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const vitalRoutes = require("./routes/vitalRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const chatRoutes = require("./routes/chatRoutes");
const symptomRoutes = require("./routes/symptomRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");

const app = express();

app.use(express.json());

app.use(cors());
app.use(helmet());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/vitals", vitalRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/symptoms", symptomRoutes);
app.use("/api/v1/prescriptions", prescriptionRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "PulseCare API Running",
  });
});

module.exports = app;
