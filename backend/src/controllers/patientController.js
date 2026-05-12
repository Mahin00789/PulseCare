const prisma = require("../../prisma/client");

const getPatientProfile = async (req, res) => {

  try {

    let patient = await prisma.patient.findUnique({

  where: {
    userId: req.user.id,
  },

  include: {
    user: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    },

    doctor: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
  },

});

    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          userId: req.user.id,
          age: 0,
          gender: "Not Added",
          bloodGroup: "Not Added",
          doctorId: null,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              createdAt: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    }

    res.status(200).json(patient);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });

  }

};
const assignDoctor = async (req, res) => {

  try {

    const { doctorId } = req.body;

    const patient = await prisma.patient.findUnique({

      where: {
        userId: req.user.id,
      },

    });

    if (!patient) {

      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });

    }

    const updatedPatient = await prisma.patient.update({

      where: {
        id: patient.id,
      },

      data: {
        doctorId,
      },

    });

    global.io.emit("doctorAssigned", {
      patientId: patient.id,
      doctorId,
    });

    res.status(200).json({
      success: true,
      message: "Doctor assigned successfully",
      patient: updatedPatient,
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
  getPatientProfile,
  assignDoctor,
};
