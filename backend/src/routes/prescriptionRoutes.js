const express = require("express");
const {
  createPrescription,
  getDoctorPatients,
  getPatientPrescriptions,
  getPrescriptionDetails,
  downloadPrescriptionPdf,
} = require("../controllers/prescriptionController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

// Doctor only
router.post("/create", authorizeRoles("DOCTOR"), createPrescription);
router.get("/doctor-patients", authorizeRoles("DOCTOR"), getDoctorPatients);

// Both patients and doctors
router.get("/patient", getPatientPrescriptions);
router.get("/download/:id", downloadPrescriptionPdf);
router.get("/:id", getPrescriptionDetails);

module.exports = router;
