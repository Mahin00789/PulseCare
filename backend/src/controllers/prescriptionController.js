// const prisma = require("../../prisma/client");
// const { z } = require("zod");
const prisma = require("../../prisma/client");
const { z } = require("zod");
const { generatePrescriptionPDF } = require("../services/pdfService");

const medicineSchema = z.object({
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  duration: z.string().min(1, "Duration is required"),
});

const createPrescriptionSchema = z.object({
  patientId: z.number().int().positive(),
  appointmentId: z.number().int().positive().optional(),
  diagnosis: z.string().min(3, "Diagnosis must be at least 3 characters"),
  precautions: z.string().optional(),
  notes: z.string().optional(),
  followUpDate: z.string().optional().transform((val) => (val ? new Date(val) : null)),
  medicines: z.array(medicineSchema).min(1, "At least one medicine is required"),
});

const createPrescription = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const validatedData = createPrescriptionSchema.parse(req.body);

    const patient = await prisma.patient.findUnique({
      where: { id: validatedData.patientId },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    if (patient.doctorId !== doctorId) {
      return res.status(403).json({ success: false, message: "You can only create prescriptions for your assigned patients" });
    }

    if (validatedData.appointmentId) {
      const appointment = await prisma.appointment.findUnique({
        where: { id: validatedData.appointmentId },
      });

      if (!appointment || appointment.doctorId !== doctorId || appointment.patientId !== validatedData.patientId) {
        return res.status(400).json({
          success: false,
          message: "Selected appointment does not belong to this patient or doctor",
        });
      }
    }

    const prescription = await prisma.prescription.create({
      data: {
        doctorId,
        patientId: validatedData.patientId,
        appointmentId: validatedData.appointmentId,
        diagnosis: validatedData.diagnosis,
        precautions: validatedData.precautions,
        notes: validatedData.notes,
        followUpDate: validatedData.followUpDate,
        medicines: {
          create: validatedData.medicines,
        },
      },
      include: {
        medicines: true,
      },
    });

    const prescriptionWithRelations = await prisma.prescription.findUnique({
      where: { id: prescription.id },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, email: true } },
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        medicines: true,
      },
    });

    await generatePrescriptionPDF(prescriptionWithRelations);

    const pdfUrl = `${req.protocol}://${req.get("host")}/api/v1/prescriptions/download/${prescription.id}`;

    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescription.id },
      data: { pdfUrl },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, email: true } },
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        medicines: true,
      },
    });

    global.io?.to(`user:${patient.userId}`).emit("newPrescription", {
      message: `New prescription added by Dr. ${req.user.name}`,
      prescriptionId: updatedPrescription.id,
    });

    return res.status(201).json({
      success: true,
      message: "Prescription created successfully",
      data: updatedPrescription,
    });
  } catch (error) {
    console.error("Error creating prescription:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getDoctorPatients = async (req, res) => {
  try {
    const doctorId = req.user.id;

    const [appointments, assignedPatients] = await Promise.all([
      prisma.appointment.findMany({
        where: { doctorId },
        include: {
          patient: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { appointmentDate: "desc" },
      }),
      prisma.patient.findMany({
        where: { doctorId },
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const patientMap = new Map();

    assignedPatients.forEach((patient) => {
      patientMap.set(patient.id, {
        patient,
        appointments: [],
      });
    });

    appointments.forEach((appointment) => {
      const existing = patientMap.get(appointment.patientId);
      if (existing) {
        existing.appointments.push(appointment);
      } else {
        patientMap.set(appointment.patientId, {
          patient: appointment.patient,
          appointments: [appointment],
        });
      }
    });

    const doctorPatients = Array.from(patientMap.values()).map((entry) => ({
      patient: entry.patient,
      appointments: entry.appointments,
      latestAppointment:
        entry.appointments.length > 0
          ? entry.appointments.sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))[0]
          : null,
    }));

    return res.status(200).json({ success: true, data: doctorPatients });
  } catch (error) {
    console.error("Error fetching doctor patients:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPatientPrescriptions = async (req, res) => {
  try {
    let targetPatientId;

    if (req.user.role === "PATIENT") {
      const patientProfile = await prisma.patient.findUnique({
        where: { userId: req.user.id },
      });
      if (!patientProfile) {
        return res.status(404).json({ success: false, message: "Patient profile not found" });
      }
      targetPatientId = patientProfile.id;
    } else {
      targetPatientId = parseInt(req.query.patientId);
      if (!targetPatientId) {
        return res.status(400).json({ success: false, message: "Patient ID is required" });
      }
      const assignedPatient = await prisma.patient.findUnique({ where: { id: targetPatientId } });
      if (!assignedPatient || assignedPatient.doctorId !== req.user.id) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId: targetPatientId },
      include: {
        doctor: { select: { id: true, name: true, specialization: true } },
        medicines: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({ success: true, data: prescriptions });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getPrescriptionDetails = async (req, res) => {
  try {
    const prescriptionId = parseInt(req.params.id);

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, email: true } },
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        appointment: true,
        medicines: true,
      },
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    if (req.user.role === "PATIENT" && prescription.patient.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (req.user.role === "DOCTOR" && prescription.doctorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    return res.status(200).json({ success: true, data: prescription });
  } catch (error) {
    console.error("Error fetching prescription details:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const downloadPrescriptionPdf = async (req, res) => {
  try {
    const prescriptionId = parseInt(req.params.id);

    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
      include: {
        doctor: { select: { id: true, name: true, specialization: true, email: true } },
        patient: { include: { user: { select: { id: true, name: true, email: true } } } },
        appointment: true,
        medicines: true,
      },
    });

    if (!prescription) {
      return res.status(404).json({ success: false, message: "Prescription not found" });
    }

    if (req.user.role === "PATIENT" && prescription.patient.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    if (req.user.role === "DOCTOR" && prescription.doctorId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const pdfBuffer = await generatePrescriptionPDF(prescription);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=prescription_${prescriptionId}.pdf`);
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return res.status(500).json({ success: false, message: "Internal server error generating PDF" });
  }
};

module.exports = {
  createPrescription,
  getDoctorPatients,
  getPatientPrescriptions,
  getPrescriptionDetails,
  downloadPrescriptionPdf,
};
