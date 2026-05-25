import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import API from "../services/api.js";

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      const res = await API.get(`/doctor/patient/${id}`);

      setPatient(res.data.patient);
      setVitals(res.data.recentVitals);
    } catch (error) {
      console.log(error);
    }
  };

  if (!patient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Patient Details
        </h1>
        <button
          onClick={() => navigate(`/doctor/prescription/create/${patient.id}`)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <FileText className="w-5 h-5" />
          Create Prescription
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <p><strong>Name:</strong> {patient.user?.name ?? patient.name}</p>
        <p><strong>Email:</strong> {patient.user?.email ?? patient.email}</p>
        <p><strong>Age:</strong> {patient.age}</p>
        <p><strong>Gender:</strong> {patient.gender}</p>
        <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Last 3 Recent Vitals
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Heart Rate</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Sugar Level</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Blood Pressure</th>
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {vitals.map((vital) => (
                <tr key={vital.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-3">{vital.heartRate} bpm</td>
                  <td className="border border-gray-300 px-4 py-3">{vital.sugarLevel} mg/dL</td>
                  <td className="border border-gray-300 px-4 py-3">{vital.bpSystolic}/{vital.bpDiastolic} mmHg</td>
                  <td className="border border-gray-300 px-4 py-3">
                    {new Date(vital.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;