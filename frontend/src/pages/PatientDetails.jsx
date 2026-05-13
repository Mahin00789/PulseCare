import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api.js";

const PatientDetails = () => {
  const { id } = useParams();

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
      <h1 className="text-3xl font-bold mb-6">
        Patient Details
      </h1>

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