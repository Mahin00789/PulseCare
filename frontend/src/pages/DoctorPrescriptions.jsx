import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  FileText,
  Pill,
  Stethoscope,
  Calendar,
  ClipboardList,
  Plus,
  Trash2,
} from "lucide-react";
import API from "../services/api";
import toast from "react-hot-toast";

const emptyMedicine = { medicineName: "", dosage: "", frequency: "", duration: "" };

const DoctorPrescriptions = () => {
  const navigate = useNavigate();
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [formData, setFormData] = useState({
    diagnosis: "",
    precautions: "",
    notes: "",
    followUpDate: "",
    medicines: [{ ...emptyMedicine }],
  });

  useEffect(() => {
    const fetchDoctorPatients = async () => {
      try {
        const res = await API.get("/prescriptions/doctor-patients");
        setDoctorPatients(res.data.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Unable to load assigned patients.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorPatients();
  }, []);

  const patientOptions = useMemo(() => {
    return doctorPatients.flatMap((entry) => {
      if (entry.appointments && entry.appointments.length > 0) {
        return entry.appointments.map((appointment) => ({
          value: `appt-${appointment.id}`,
          patientId: entry.patient.id,
          appointmentId: appointment.id,
          label: `${entry.patient.user.name} · ${new Date(appointment.appointmentDate).toLocaleDateString()}`,
        }));
      }

      return [
        {
          value: `patient-${entry.patient.id}`,
          patientId: entry.patient.id,
          appointmentId: null,
          label: `${entry.patient.user.name} · No appointment scheduled`,
        },
      ];
    });
  }, [doctorPatients]);

  const selectedEntry = useMemo(() => {
    if (!selectedOption) return null;
    const [type, id] = selectedOption.split("-");
    if (type === "appt") {
      return doctorPatients.find((entry) => entry.appointments.some((appointment) => appointment.id === Number(id)));
    }
    return doctorPatients.find((entry) => entry.patient.id === Number(id));
  }, [selectedOption, doctorPatients]);

  const selectedAppointment = useMemo(() => {
    if (!selectedEntry || !selectedOption) return null;
    if (selectedOption.startsWith("appt-")) {
      const appointmentId = Number(selectedOption.replace("appt-", ""));
      return selectedEntry.appointments.find((appointment) => appointment.id === appointmentId) || null;
    }
    return null;
  }, [selectedEntry, selectedOption]);

  const handleFieldChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, e) => {
    const updated = [...formData.medicines];
    updated[index][e.target.name] = e.target.value;
    setFormData({ ...formData, medicines: updated });
  };

  const addMedicineRow = () => {
    setFormData({ ...formData, medicines: [...formData.medicines, { ...emptyMedicine }] });
  };

  const removeMedicineRow = (index) => {
    if (formData.medicines.length === 1) return;
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOption) {
      toast.error("Please select a patient and appointment.");
      return;
    }
    if (!formData.diagnosis.trim()) {
      toast.error("Please enter a diagnosis.");
      return;
    }

    const invalidMed = formData.medicines.some(
      (medicine) => !medicine.medicineName.trim() || !medicine.dosage.trim() || !medicine.frequency.trim() || !medicine.duration.trim()
    );
    if (invalidMed) {
      toast.error("Please fill all medicine fields.");
      return;
    }

    if (!selectedEntry) {
      toast.error("Selected patient was not found.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        patientId: selectedEntry.patient.id,
        appointmentId: selectedAppointment?.id,
        diagnosis: formData.diagnosis,
        precautions: formData.precautions || undefined,
        notes: formData.notes || undefined,
        followUpDate: formData.followUpDate || undefined,
        medicines: formData.medicines,
      };

      const res = await API.post("/prescriptions/create", payload);

      if (res.data.success) {
        setSuccess(true);
        toast.success("Prescription generated successfully.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to generate prescription.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)] px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-lg w-full">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <FileText className="h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Generated</h2>
          <p className="text-slate-500 mb-6">The prescription is saved and will appear in the patient’s dashboard immediately.</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => navigate("/doctor/prescriptions")}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              View Another Patient
            </button>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setSelectedOption("");
                setFormData({ diagnosis: "", precautions: "", notes: "", followUpDate: "", medicines: [{ ...emptyMedicine }] });
              }}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              Create New Prescription
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (doctorPatients.length === 0) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)] p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-10 shadow-lg">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Doctor Prescriptions</h1>
          <p className="text-slate-500 mb-8">No patients are assigned yet. Once a patient is linked to your profile, you can create prescriptions from this screen.</p>
          <button
            type="button"
            onClick={() => navigate("/doctor/dashboard")}
            className="rounded-2xl bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button
              type="button"
              onClick={() => navigate("/doctor/dashboard")}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">Doctor Prescription Center</h1>
            <p className="mt-2 text-sm text-slate-500">Select an assigned patient, choose an appointment, and generate a professional prescription.</p>
          </div>
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
            <div className="text-sm font-bold text-slate-900">Selected Patient</div>
            <div className="mt-2 text-lg text-blue-600 font-semibold">
              {selectedEntry?.patient.user.name || "Choose a patient"}
            </div>
            {selectedAppointment ? (
              <p className="text-sm text-slate-500">Appointment: {new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</p>
            ) : (
              <p className="text-sm text-slate-500">No appointment selected.</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-[0.6fr_0.4fr]">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Patient & Appointment</h2>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-600">Patient / Appointment</label>
                  <select
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select patient and appointment</option>
                    {patientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {selectedEntry && (
                    <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                      <p className="font-semibold text-slate-800">Assigned patient:</p>
                      <p>{selectedEntry.patient.user.name}</p>
                      <p>{selectedEntry.patient.gender} · Age {selectedEntry.patient.age} · Blood: {selectedEntry.patient.bloodGroup || "N/A"}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Diagnosis</h2>
                </div>
                <textarea
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleFieldChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe the diagnosis in detail"
                  required
                />
              </div>

              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Precautions & Notes</h2>
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Precautions</label>
                    <textarea
                      name="precautions"
                      value={formData.precautions}
                      onChange={handleFieldChange}
                      rows="4"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="E.g. avoid heavy lifting, stay hydrated"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2">Additional Notes</label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleFieldChange}
                      rows="4"
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Any extra instructions for the patient"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Pill className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-800">Medicines</h2>
                  </div>
                  <button
                    type="button"
                    onClick={addMedicineRow}
                    className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100"
                  >
                    <Plus className="w-4 h-4" />
                    Add Medicine
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="hidden grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto] gap-3 text-xs font-bold text-slate-500 sm:grid">
                    <span>Medicine</span>
                    <span>Dosage</span>
                    <span>Frequency</span>
                    <span>Duration</span>
                    <span className="w-9" />
                  </div>
                  {formData.medicines.map((medicine, index) => (
                    <div key={index} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[1fr_0.8fr_0.8fr_0.8fr_auto]">
                      <input
                        type="text"
                        name="medicineName"
                        value={medicine.medicineName}
                        onChange={(e) => handleMedicineChange(index, e)}
                        placeholder="Medicine name"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, e)}
                        placeholder="Dosage"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        name="frequency"
                        value={medicine.frequency}
                        onChange={(e) => handleMedicineChange(index, e)}
                        placeholder="Frequency"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        name="duration"
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, e)}
                        placeholder="Duration"
                        className="rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeMedicineRow(index)}
                        disabled={formData.medicines.length === 1}
                        className="rounded-2xl p-3 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-slate-800">Follow-up Date</h2>
                </div>
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleFieldChange}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  Generate Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
