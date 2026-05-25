const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

const {
  addVitals,
  deleteVital,
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
router.delete(
  "/:id",
  protect,
  authorizeRoles("PATIENT"),
  deleteVital
);
router.get(
  "/:patientId",
  protect,
  getPatientVitals
);

module.exports = router;