import React, { useEffect, useState } from 'react';
import { Activity, Clock, Calendar, AlertCircle, ChevronRight, ActivitySquare } from 'lucide-react';
import API from '../services/api';

const SymptomHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await API.get('/symptoms/history');
        if (response.data.success) {
          setHistory(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching symptom history:', err);
        setError('Failed to load history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const severityColors = {
    Mild: 'bg-green-100 text-green-800',
    Moderate: 'bg-yellow-100 text-yellow-800',
    Severe: 'bg-orange-100 text-orange-800',
    Emergency: 'bg-red-100 text-red-800',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 animate-in fade-in zoom-in duration-500">
      <div className="mb-4">
        <button
          onClick={() => window.location.href = '/patient/dashboard'}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Dashboard
        </button>
      </div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Symptom <span className="text-indigo-600">History</span></h1>
          <p className="text-gray-500 mt-2">View your past symptom assessments and AI recommendations.</p>
        </div>
        <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100">
          <ActivitySquare className="w-8 h-8 text-indigo-600" />
        </div>
      </div>

      {history.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900">No History Found</h3>
          <p className="text-gray-500 mt-1">You haven't checked any symptoms yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.createdAt).toLocaleDateString()} at {new Date(record.createdAt).toLocaleTimeString()}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">Reported: {record.symptoms.length > 50 ? record.symptoms.substring(0, 50) + '...' : record.symptoms}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${severityColors[record.severityClassification] || severityColors.Mild}`}>
                  {record.severityClassification}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Possible Conditions</h4>
                  <ul className="space-y-1">
                    {record.possibleConditions?.slice(0, 2).map((condition, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                         <span className="text-indigo-400 mt-1">•</span> {condition.condition}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Next Step</h4>
                  <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-lg border border-blue-100">
                    Consult: <span className="font-bold">{record.recommendedSpecialist}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomHistory;
