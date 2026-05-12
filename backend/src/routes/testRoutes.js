const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const authorizeRoles = require("../middleware/roleMiddleware");

router.get(
  "/doctor",
  protect,
  authorizeRoles("DOCTOR"),
  (req, res) => {
    res.json({
      success: true,
      message: "Doctor route accessed",
    });
  }
);

router.get(
  "/patient",
  protect,
  authorizeRoles("PATIENT"),
  (req, res) => {
    res.json({
      success: true,
      message: "Patient route accessed",
    });
  }
);

module.exports = router;