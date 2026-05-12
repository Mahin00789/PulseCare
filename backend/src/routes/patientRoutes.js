const express = require("express");

const router = express.Router();

const {
  getPatientProfile,
} = require("../controllers/patientController");
const {assignDoctor,
} = require("../controllers/patientController");
const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("PATIENT"),
  getPatientProfile
);
router.put("/assign-doctor", authMiddleware, roleMiddleware("PATIENT"), assignDoctor);
module.exports = router;