import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  FileText,
  ChevronLeft,
  Pill,
  Stethoscope,
  Calendar,
  ClipboardList,
  CheckCircle2,
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const emptyMedicine = { medicineName: '', dosage: '', frequency: '', duration: '' };

const CreatePrescription = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    diagnosis: '',
    precautions: '',
    notes: '',
    followUpDate: '',
    medicines: [{ ...emptyMedicine }],
  });

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/doctor/patient/${patientId}`);
        setPatient(res.data.patient);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load patient info');
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, [patientId]);

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

    // Basic validation
    if (!formData.diagnosis.trim()) {
      toast.error('Please enter a diagnosis');
      return;
    }
    const invalidMed = formData.medicines.some(
      (m) => !m.medicineName.trim() || !m.dosage.trim() || !m.frequency.trim() || !m.duration.trim()
    );
    if (invalidMed) {
      toast.error('Please fill all medicine fields');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        patientId: parseInt(patientId),
        diagnosis: formData.diagnosis,
        precautions: formData.precautions || undefined,
        notes: formData.notes || undefined,
        followUpDate: formData.followUpDate || undefined,
        medicines: formData.medicines,
      };

      const res = await API.post('/prescriptions/create', payload);
      if (res.data.success) {
        setSuccess(true);
        toast.success('Prescription created successfully!');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create prescription');
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
      <div className="flex items-center justify-center min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)]">
        <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Prescription Created!</h2>
          <p className="text-slate-500 mb-6">The prescription has been saved and the patient can now view and download it.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => navigate(`/doctor/patient/${patientId}`)}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all"
            >
              Back to Patient
            </button>
            <button
              onClick={() => {
                setSuccess(false);
                setFormData({ diagnosis: '', precautions: '', notes: '', followUpDate: '', medicines: [{ ...emptyMedicine }] });
              }}
              className="px-6 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-all"
            >
              Create Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#dce8ff_0,#eaf3ff_42%,#f8fbff_100%)] p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(`/doctor/patient/${patientId}`)}
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mb-4 text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Patient Details
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Create Prescription</h1>
              {patient && (
                <p className="text-sm text-slate-500">
                  For: <span className="font-semibold text-slate-700">{patient.user?.name || patient.name}</span>
                  {' · '}Age: {patient.age} · {patient.gender} · Blood: {patient.bloodGroup}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diagnosis Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Diagnosis</h2>
            </div>
            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleFieldChange}
              rows="3"
              className="w-full rounded-xl border border-slate-200 p-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
              placeholder="Enter the diagnosis details..."
              required
            />
          </div>

          {/* Medicines Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-800">Medicines</h2>
              </div>
              <button
                type="button"
                onClick={addMedicineRow}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {/* Header Row */}
              <div className="hidden sm:grid sm:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_auto] gap-3 text-xs font-bold text-slate-500 px-1">
                <span>Medicine Name</span>
                <span>Dosage</span>
                <span>Frequency</span>
                <span>Duration</span>
                <span className="w-9" />
              </div>

              {formData.medicines.map((med, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_0.7fr_0.7fr_0.7fr_auto] gap-3 bg-slate-50 rounded-xl p-3 ring-1 ring-slate-100"
                >
                  <input
                    type="text"
                    name="medicineName"
                    value={med.medicineName}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="e.g. Paracetamol"
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <input
                    type="text"
                    name="dosage"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, e)}
                    placeholder="e.g. 500mg"
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <select
                    name="frequency"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(index, e)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Thrice daily">Thrice daily</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="As needed">As needed</option>
                    <option value="Before meals">Before meals</option>
                    <option value="After meals">After meals</option>
                  </select>
                  <select
                    name="duration"
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, e)}
                    className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="3 days">3 days</option>
                    <option value="5 days">5 days</option>
                    <option value="7 days">7 days</option>
                    <option value="10 days">10 days</option>
                    <option value="14 days">14 days</option>
                    <option value="1 month">1 month</option>
                    <option value="2 months">2 months</option>
                    <option value="3 months">3 months</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeMedicineRow(index)}
                    disabled={formData.medicines.length === 1}
                    className="self-center p-2 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Precautions & Notes Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Precautions & Notes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Precautions</label>
                <textarea
                  name="precautions"
                  value={formData.precautions}
                  onChange={handleFieldChange}
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="e.g. Avoid cold foods, rest adequately..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleFieldChange}
                  rows="3"
                  className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Any additional notes for the patient..."
                />
              </div>
            </div>
          </div>

          {/* Follow-up Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-slate-800">Follow-up</h2>
            </div>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate}
              onChange={handleFieldChange}
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-auto"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  Save Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePrescription;
