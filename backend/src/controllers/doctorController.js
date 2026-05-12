const prisma = require("../../prisma/client");

const getAssignedPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const patients = await prisma.patient.findMany({
      where: {
        doctorId : doctorId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      patients,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getDoctorAlerts = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const alerts = await prisma.alert.findMany({
      where: {
        patient: {
          doctorId:doctorId,
        },
      },
      include: {
        patient: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      alerts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const markAlertAsRead = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await prisma.alert.findUnique({
      where: {
        id: Number(alertId),
      },
      include: {
        patient: true,
      },
    });

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: "Alert not found",
      });
    }

    if (alert.patient.doctorId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const updatedAlert = await prisma.alert.update({
      where: {
        id: Number(alertId),
      },
      data: {
        isRead: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Alert marked as read",
      updatedAlert,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getDashboardStats = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const totalPatients = await prisma.patient.count({
      where: {
        doctorId:doctorId,
      },
    });

    const patientIds = await prisma.patient.findMany({
      where: {
        doctorId,
      },
      select: {
        id: true,
      },
    });

    const ids = patientIds.map((patient) => patient.id);

    const totalAlerts = await prisma.alert.count({
      where: {
        patientId: {
          in: ids,
        },
      },
    });

    const unreadAlerts = await prisma.alert.count({
      where: {
        patientId: {
          in: ids,
        },
        isRead: false,
      },
    });

    const highAlerts = await prisma.alert.count({
      where: {
        patientId: {
          in: ids,
        },
        severity: "HIGH",
      },
    });

    const totalVitals = await prisma.vitalLog.count({
      where: {
        patientId: {
          in: ids,
        },
      },
    });
    const normalVitals = await prisma.vitalLog.count({

  where: {
    patientId: {
      in: ids,
    },
    status: "NORMAL",
  },

});

const highVitals = await prisma.vitalLog.count({

  where: {
    patientId: {
      in: ids,
    },
    status: "HIGH",
  },

});

const stablePercentage =
  totalVitals > 0
    ? Math.round((normalVitals / totalVitals) * 100)
    : 0;

const criticalPercentage =
  totalVitals > 0
    ? Math.round((highVitals / totalVitals) * 100)
    : 0;
    res.status(200).json({
      success: true,
      stats: {
        totalPatients,
        totalAlerts,
        unreadAlerts,
        highAlerts,
        totalVitals,
        stablePercentage,
        criticalPercentage,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getDoctorProfile = async (req, res) => {
  try {

    const doctor = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.status(200).json(doctor);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Internal server error",
    });

  }
};
const getDoctorVitals = async (req, res) => {

  try {

    const vitals = await prisma.vitalLog.findMany({

  where: {
    patient: {
      doctorId: req.user.id,
    },
  },

  include: {
    patient: {
      include: {
        user: true,
      },
    },
  },

  orderBy: {
    createdAt: "desc",
  },

});

    res.status(200).json({
      success: true,
      vitals,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};
const getAllDoctors = async (req, res) => {

  try {

    const doctors = await prisma.user.findMany({

      where: {
        role: "DOCTOR",
      },

      select: {
        id: true,
        name: true,
        email: true,
      },

    });

    res.status(200).json({
      success: true,
      doctors,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};
const getRecentActivities = async (req, res) => {

  try {

    const activities = await prisma.vitalLog.findMany({

  where: {
    patient: {
      doctorId: req.user.id,
    },
  },

  take: 5,

  orderBy: {
    createdAt: "desc",
  },

  include: {
    patient: {
      include: {
        user: true,
      },
    },
  },

});

    const formattedActivities = activities.map((vital) => ({

      id: vital.id,

      patientName: vital.patient.user.name,

      status: vital.status,

      heartRate: vital.heartRate,

      sugarLevel: vital.sugarLevel,

      bloodPressure: vital.bloodPressure,

      createdAt: vital.createdAt,

    }));

    res.status(200).json(formattedActivities);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};
module.exports = {
  getAssignedPatients,
  getDoctorAlerts,
  markAlertAsRead,
  getDashboardStats,
  getDoctorProfile,
  getDoctorVitals,
  getRecentActivities,
  getAllDoctors,
};
