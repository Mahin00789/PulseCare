import { useState } from "react";
import API from "../../services/api";
import { UploadCloud } from "lucide-react";

function VitalsForm({ patient,fetchVitals, }) {

  const [formData, setFormData] = useState({
    heartRate: "",
    sugarLevel: "",
    bpSystolic: "",
    bpDiastolic: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    console.log(formData);

    try {

      setLoading(true);

      const res = await API.post("/vitals/add", {
        patientId: patient.id,
        heartRate: Number(formData.heartRate),
        sugarLevel: Number(formData.sugarLevel),
        bpSystolic: Number(formData.bpSystolic),
        bpDiastolic: Number(formData.bpDiastolic),
      });

      alert(res.data.message);
      fetchVitals();
      setFormData({
        heartRate: "",
        sugarLevel: "",
        bpSystolic: "",
        bpDiastolic: "",
      });

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <section className="rounded-2xl bg-[#f8fbff] p-5 shadow-sm">

      <div className="mb-4 flex items-center justify-between">

        <div>

          <h2 className="text-sm font-bold text-slate-800">
            Submit Vitals
          </h2>

          <p className="text-xs font-medium text-slate-400">
            Record personal readings for doctor review
          </p>

        </div>

        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

          <UploadCloud size={20} />

        </div>

      </div>

      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >

        <div>

          <label className="mb-2 block text-xs font-bold text-slate-500">
            Heart Rate
          </label>

          <input
            type="number"
            name="heartRate"
            value={formData.heartRate}
            onChange={handleChange}
            placeholder="Enter heart rate"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            required
          />

        </div>

        <div>

          <label className="mb-2 block text-xs font-bold text-slate-500">
            Sugar Level
          </label>

          <input
            type="number"
            name="sugarLevel"
            value={formData.sugarLevel}
            onChange={handleChange}
            placeholder="Enter sugar level"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            required
          />

        </div>

        <div>

          <label className="mb-2 block text-xs font-bold text-slate-500">
            BP Systolic
          </label>

          <input
            type="number"
            name="bpSystolic"
            value={formData.bpSystolic}
            onChange={handleChange}
            placeholder="Enter systolic BP"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            required
          />

        </div>

        <div>

          <label className="mb-2 block text-xs font-bold text-slate-500">
            BP Diastolic
          </label>

          <input
            type="number"
            name="bpDiastolic"
            value={formData.bpDiastolic}
            onChange={handleChange}
            placeholder="Enter diastolic BP"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            required
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >

          {loading ? "Submitting..." : "Submit Vitals"}

        </button>

      </form>

    </section>

  );

}

export default VitalsForm;