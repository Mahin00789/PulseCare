-- AlterTable
ALTER TABLE "User" ADD COLUMN     "specialization" TEXT;

-- CreateTable
CREATE TABLE "SymptomCheck" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "symptoms" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "severityLevel" TEXT NOT NULL,
    "possibleConditions" JSONB NOT NULL,
    "severityClassification" TEXT NOT NULL,
    "precautions" JSONB NOT NULL,
    "recommendedSpecialist" TEXT NOT NULL,
    "requiresImmediateAttention" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SymptomCheck_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SymptomCheck" ADD CONSTRAINT "SymptomCheck_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
