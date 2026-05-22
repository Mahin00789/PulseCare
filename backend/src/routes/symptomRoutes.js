const express = require("express");
const { analyzeSymptoms, getSymptomHistory } = require("../controllers/symptomController");
const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("PATIENT"));

router.post("/analyze", analyzeSymptoms);
router.get("/history", getSymptomHistory);

module.exports = router;
