const PDFDocument = require("pdfkit");

/**
 * Generates a prescription PDF and returns it as a Buffer
 * @param {Object} prescription - The prescription object with relations
 * @returns {Promise<Buffer>}
 */
const generatePrescriptionPDF = (prescription) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: "A4" });
      const buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);

      // --- Header / Logo Section ---
      doc
        .fillColor("#4F46E5")
        .fontSize(24)
        .font("Helvetica-Bold")
        .text("PulseCare", { align: "left" });

      doc
        .fontSize(10)
        .fillColor("#6B7280")
        .font("Helvetica")
        .text("Advanced Healthcare Systems", { align: "left" })
        .text("123 Medical Drive, Health City, HC 12345", { align: "left" })
        .text("Phone: (555) 123-4567 | www.pulsecare.com", { align: "left" })
        .moveDown(2);

      // Divider
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#E5E7EB")
        .stroke()
        .moveDown(2);

      // --- Doctor & Patient Info ---
      const yInfo = doc.y;

      // Doctor Info (Right)
      doc
        .fontSize(12)
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .text(`Dr. ${prescription.doctor.name}`, 300, yInfo, { align: "right" })
        .font("Helvetica")
        .fillColor("#4B5563")
        .text(prescription.doctor.specialization || "General Physician", { align: "right" })
        .text(prescription.doctor.email, { align: "right" });

      // Patient Info (Left)
      doc
        .fontSize(10)
        .fillColor("#6B7280")
        .text("PATIENT:", 50, yInfo)
        .fontSize(12)
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .text(prescription.patient.user ? prescription.patient.user.name : "Patient", 50, doc.y + 2)
        .font("Helvetica")
        .fillColor("#4B5563")
        .text(`Age: ${prescription.patient.age} | Gender: ${prescription.patient.gender}`)
        .text(`Blood Group: ${prescription.patient.bloodGroup || "N/A"}`)
        .moveDown(1);

      doc.text(`Date: ${new Date(prescription.createdAt).toLocaleDateString()}`, 50, doc.y);
      doc.text(`Prescription ID: #PC-${prescription.id}`, 50, doc.y).moveDown(2);

      // Divider
      doc
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .strokeColor("#E5E7EB")
        .stroke()
        .moveDown(2);

      // --- Diagnosis ---
      doc
        .fontSize(14)
        .fillColor("#4F46E5")
        .font("Helvetica-Bold")
        .text("Diagnosis")
        .moveDown(0.5);

      doc
        .fontSize(11)
        .fillColor("#111827")
        .font("Helvetica")
        .text(prescription.diagnosis)
        .moveDown(2);

      // --- Medicines Table ---
      doc
        .fontSize(14)
        .fillColor("#4F46E5")
        .font("Helvetica-Bold")
        .text("Rx - Medicines")
        .moveDown(1);

      // Table Header
      const tableTop = doc.y;
      doc.fontSize(10).fillColor("#6B7280").font("Helvetica-Bold");

      doc.text("Medicine Name", 50, tableTop);
      doc.text("Dosage", 250, tableTop);
      doc.text("Frequency", 350, tableTop);
      doc.text("Duration", 450, tableTop);

      doc
        .moveTo(50, doc.y + 5)
        .lineTo(545, doc.y + 5)
        .strokeColor("#E5E7EB")
        .stroke()
        .moveDown(1.5);

      // Table Rows
      doc.font("Helvetica").fillColor("#111827").fontSize(11);

      prescription.medicines.forEach((med) => {
        const y = doc.y;
        doc.text(med.medicineName, 50, y);
        doc.text(med.dosage, 250, y);
        doc.text(med.frequency, 350, y);
        doc.text(med.duration, 450, y);
        doc.moveDown(1);
      });

      doc.moveDown(1);

      // --- Precautions ---
      if (prescription.precautions) {
        doc
          .fontSize(12)
          .fillColor("#4F46E5")
          .font("Helvetica-Bold")
          .text("Precautions & Instructions")
          .moveDown(0.5)
          .fontSize(10)
          .fillColor("#4B5563")
          .font("Helvetica")
          .text(prescription.precautions)
          .moveDown(1);
      }

      // --- Notes ---
      if (prescription.notes) {
        doc
          .fontSize(12)
          .fillColor("#4F46E5")
          .font("Helvetica-Bold")
          .text("Additional Notes")
          .moveDown(0.5)
          .fontSize(10)
          .fillColor("#4B5563")
          .font("Helvetica")
          .text(prescription.notes)
          .moveDown(1);
      }

      // --- Follow-up ---
      if (prescription.followUpDate) {
        doc
          .fontSize(12)
          .fillColor("#4F46E5")
          .font("Helvetica-Bold")
          .text("Follow-up Date")
          .moveDown(0.5)
          .fontSize(11)
          .fillColor("#111827")
          .font("Helvetica-Bold")
          .text(new Date(prescription.followUpDate).toLocaleDateString())
          .moveDown(2);
      } else {
        doc.moveDown(3);
      }

      // --- Footer / Signature ---
      const bottomY = doc.page.height - 150;

      doc
        .moveTo(350, bottomY)
        .lineTo(500, bottomY)
        .strokeColor("#111827")
        .stroke();

      doc
        .fontSize(10)
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .text("Doctor's Signature", 350, bottomY + 10, { width: 150, align: "center" })
        .font("Helvetica")
        .fillColor("#6B7280")
        .text("Generated electronically by PulseCare", 50, doc.page.height - 50, {
          align: "center",
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePrescriptionPDF };
