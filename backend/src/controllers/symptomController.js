const prisma = require("../../prisma/client");
const { z } = require("zod");
const { analyzeSymptomsWithAI } = require("../services/geminiService");

const analyzeSchema = z.object({
  symptoms: z.string().min(3),
  age: z.number().int().positive(),
  gender: z.string(),
  duration: z.string(),
  severityLevel: z.string(),
});

const analyzeSymptoms = async (req, res) => {
  try {
    // 1. Validate Input
    const parsedData = analyzeSchema.parse(req.body);

    // 2. Fetch Patient ID based on logged in user
    // Assuming req.user is set by authentication middleware
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    // 3. Call AI Service
    const aiResult = await analyzeSymptomsWithAI(parsedData);

    // 4. Save to Database
    const symptomCheck = await prisma.symptomCheck.create({
      data: {
        patientId: patient.id,
        symptoms: parsedData.symptoms,
        age: parsedData.age,
        gender: parsedData.gender,
        duration: parsedData.duration,
        severityLevel: parsedData.severityLevel,
        possibleConditions: aiResult.possibleConditions,
        severityClassification: aiResult.severityClassification,
        precautions: aiResult.precautions,
        recommendedSpecialist: aiResult.recommendedSpecialist,
        requiresImmediateAttention: aiResult.requiresImmediateAttention,
      },
    });

    // 5. Fetch Recommended Doctors if Specialist is suggested
    let recommendedDoctors = [];
    if (aiResult.recommendedSpecialist && aiResult.recommendedSpecialist !== "None") {
      recommendedDoctors = await prisma.user.findMany({
        where: {
          role: "DOCTOR",
          specialization: {
            contains: aiResult.recommendedSpecialist,
            mode: "insensitive", // Postgres only, Prisma feature
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          specialization: true,
        },
      });
      
      // Fallback if strict specialization matching finds none
      if (recommendedDoctors.length === 0) {
          recommendedDoctors = await prisma.user.findMany({
            where: {
              role: "DOCTOR",
            },
            select: {
              id: true,
              name: true,
              email: true,
              specialization: true,
            },
            take: 3
          });
      }
    }

    // 6. Return response
    return res.status(200).json({
      success: true,
      data: {
        ...symptomCheck,
        recommendedDoctors,
      },
    });
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: "Validation error", errors: error.errors });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getSymptomHistory = async (req, res) => {
  try {
    const patient = await prisma.patient.findUnique({
      where: { userId: req.user.id },
    });

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient profile not found" });
    }

    const history = await prisma.symptomCheck.findMany({
      where: { patientId: patient.id },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching symptom history:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  analyzeSymptoms,
  getSymptomHistory,
};
