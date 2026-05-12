const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addVitals,
} = require("../controllers/vitalController");
const {
    getPatientVitals,
} = require("../controllers/vitalController");
router.post(
  "/add",
  protect,
  authorizeRoles("PATIENT"),
  addVitals
);
router.get(
  "/:patientId",
  protect,
  getPatientVitals
);

module.exports = router;