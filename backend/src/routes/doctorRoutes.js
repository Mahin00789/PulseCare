const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
  getDoctorAlerts,
} = require("../controllers/doctorController");
const {
  getAssignedPatients,
} = require("../controllers/doctorController");
const {
  markAlertAsRead,
} = require("../controllers/doctorController");
const {
    getDashboardStats,
} = require("../controllers/doctorController");
const {
    getDoctorProfile,
} = require("../controllers/doctorController");
const {getDoctorVitals,
} = require("../controllers/doctorController");
const {getRecentActivities,
} = require("../controllers/doctorController");
const {getAllDoctors,
}= require("../controllers/doctorController");
router.get(
  "/patients",
  protect,
  authorizeRoles("DOCTOR"),
  getAssignedPatients
);
router.get(
  "/alerts",
  protect,
  authorizeRoles("DOCTOR"),
  getDoctorAlerts
);
router.patch(
  "/alerts/:alertId/read",
  protect,
  authorizeRoles("DOCTOR"),
  markAlertAsRead
);
router.get(
  "/dashboard",
  protect,
  authorizeRoles("DOCTOR"),
  getDashboardStats
);
router.get(
  "/profile",
  protect,
  authorizeRoles("DOCTOR"),
  getDoctorProfile
);
router.get(
  "/vitals",
  protect,
  authorizeRoles("DOCTOR"),
  getDoctorVitals
);
router.get( "/activities",
  protect,
  authorizeRoles("DOCTOR"),
  getRecentActivities
);
router.get(
  "/all",
  protect,
  getAllDoctors
);
module.exports = router;