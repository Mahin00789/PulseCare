import React, { useEffect, useState } from 'react';
import {
  FileText,
  Download,
  Eye,
  Clock,
  ChevronLeft,
  Pill,
  X,
  Stethoscope,
  Calendar,
  ClipboardList,
} from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';
import socket, { connectSocket } from '../services/socket';

const PrescriptionHistory = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const res = await API.get('/prescriptions/patient');
        if (res.data.success) {
          setPrescriptions(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching prescriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    const handleNewPrescription = ({ message }) => {
      toast.success(message || 'New prescription added.');
      fetchPrescriptions();
    };

    connectSocket();
    socket.on('newPrescription', handleNewPrescription);
    fetchPrescriptions();

    return () => {
      socket.off('newPrescription', handleNewPrescription);
    };
  }, []);

  const handleViewDetails = async (id) => {
    try {
      setDetailLoading(true);
      const res = await API.get(`/prescriptions/${id}`);
      if (res.data.success) {
        setSelectedPrescription(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await API.get(`/prescriptions/download/${id}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back button */}
      <div className="mb-4">
        <button
          onClick={() => (window.location.href = '/patient/dashboard')}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            My <span className="text-blue-600">Prescriptions</span>
          </h1>
          <p className="text-slate-500 mt-2">View and download your medical prescriptions.</p>
        </div>
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
          <FileText className="w-8 h-8 text-blue-600" />
        </div>
      </div>

      {/* Empty state */}
      {prescriptions.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm ring-1 ring-slate-100">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900">No Prescriptions Yet</h3>
          <p className="text-slate-500 mt-1">Your doctor hasn't issued any prescriptions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((rx) => (
            <div
              key={rx.id}
              className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-100 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(rx.createdAt).toLocaleDateString()} at{' '}
                    {new Date(rx.createdAt).toLocaleTimeString()}
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg truncate">{rx.diagnosis}</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Dr. {rx.doctor?.name}{' '}
                    {rx.doctor?.specialization && (
                      <span className="text-blue-500">· {rx.doctor.specialization}</span>
                    )}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-700">
                      <Pill className="w-3 h-3" />
                      {rx.medicines?.length || 0} medicine{rx.medicines?.length !== 1 ? 's' : ''}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-xs font-bold rounded-md ${
                        rx.status === 'ISSUED'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {rx.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={() => handleViewDetails(rx.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(rx.id)}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Prescription Details</h2>
                  <p className="text-xs text-slate-500">
                    ID: #PC-{selectedPrescription.id} ·{' '}
                    {new Date(selectedPrescription.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPrescription(null)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-all"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {detailLoading ? (
              <div className="p-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600" />
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Doctor Info */}
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {selectedPrescription.doctor?.name?.charAt(0) || 'D'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      Dr. {selectedPrescription.doctor?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedPrescription.doctor?.specialization || 'General Physician'}
                    </p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-700">Diagnosis</h3>
                  </div>
                  <p className="text-sm text-slate-800 bg-blue-50/50 p-3 rounded-lg">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>

                {/* Medicines */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Pill className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-700">Medicines</h3>
                  </div>
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">
                            Medicine
                          </th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">
                            Dosage
                          </th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">
                            Frequency
                          </th>
                          <th className="text-left px-4 py-2.5 text-xs font-bold text-slate-500">
                            Duration
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPrescription.medicines?.map((med, idx) => (
                          <tr key={idx} className="border-t border-slate-50 hover:bg-slate-50/50">
                            <td className="px-4 py-2.5 font-medium text-slate-900">
                              {med.medicineName}
                            </td>
                            <td className="px-4 py-2.5 text-slate-600">{med.dosage}</td>
                            <td className="px-4 py-2.5 text-slate-600">{med.frequency}</td>
                            <td className="px-4 py-2.5 text-slate-600">{med.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Precautions */}
                {selectedPrescription.precautions && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <ClipboardList className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-700">Precautions</h3>
                    </div>
                    <p className="text-sm text-slate-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100">
                      {selectedPrescription.precautions}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {selectedPrescription.notes && (
                  <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-2">Additional Notes</h3>
                    <p className="text-sm text-slate-600">{selectedPrescription.notes}</p>
                  </div>
                )}

                {/* Follow-up */}
                {selectedPrescription.followUpDate && (
                  <div className="flex items-center gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-xs text-green-600 font-bold">Follow-up Date</p>
                      <p className="text-sm font-semibold text-green-800">
                        {new Date(selectedPrescription.followUpDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                {/* Download */}
                <div className="pt-2">
                  <button
                    onClick={() => handleDownload(selectedPrescription.id)}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    <Download className="w-5 h-5" />
                    Download PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionHistory;
