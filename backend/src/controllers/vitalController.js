const prisma = require("../../prisma/client");

const addVitals = async (req, res) => {
  try {
    const {
      patientId,
      bpSystolic,
      bpDiastolic,
      sugarLevel,
      heartRate,
    } = req.body;

    if (
      !patientId ||
      !bpSystolic ||
      !bpDiastolic ||
      !sugarLevel ||
      !heartRate
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    
    let status = "NORMAL";

    if (
      bpSystolic >= 140 ||
      bpDiastolic >= 90 ||
      sugarLevel >= 180 ||
      heartRate >= 120
    ) {
      status = "HIGH";
    }
if (status === "HIGH") {

  await prisma.alert.create({
    data: {
      patientId,
      severity: "HIGH",
      message: "Abnormal vitals detected",
    },
  });

  global.io.emit("newAlert", {
    patientId,
    status,
  });

}
    const vital = await prisma.vitalLog.create({
      data: {
        patientId,
        bpSystolic,
        bpDiastolic,
        sugarLevel,
        heartRate,
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: "Vitals added successfully",
      vital,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
const getPatientVitals = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);

    const patient = await prisma.patient.findUnique({
      where: {
        id: patientId,
      },
    });

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    if (req.user.role === "PATIENT") {
      if (patient.userId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    if (req.user.role === "DOCTOR") {
      if (patient.doctorId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    const vitals = await prisma.vitalLog.findMany({
      where: {
        patientId,
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
module.exports = {
  addVitals,
  getPatientVitals,
};
