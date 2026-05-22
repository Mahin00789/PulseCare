import React, { useState } from 'react';
import { AlertTriangle, Activity, User, Clock, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import toast from 'react-hot-toast';

const SymptomChecker = () => {
  const [formData, setFormData] = useState({
    symptoms: '',
    age: '',
    gender: 'Male',
    duration: 'Less than a day',
    severityLevel: 'Mild',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.symptoms.length < 3) {
      toast.error('Please describe your symptoms in more detail.');
      return;
    }

    setLoading(true);
    try {
      const response = await API.post('/symptoms/analyze', {
        ...formData,
        age: parseInt(formData.age),
      });

      if (response.data.success) {
        setResult(response.data.data);
        toast.success('Analysis complete!');
      }
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      toast.error(error.response?.data?.message || 'Failed to analyze symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    Mild: 'bg-green-100 text-green-800 border-green-200',
    Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Severe: 'bg-orange-100 text-orange-800 border-orange-200',
    Emergency: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="mb-4">
        <button
          onClick={() => window.location.href = '/patient/dashboard'}
          className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-2"
        >
          <ChevronRight className="w-5 h-5 rotate-180" />
          Back to Dashboard
        </button>
      </div>
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          AI Symptom <span className="text-indigo-600">Checker</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Describe your symptoms naturally, and our advanced AI will help identify possible conditions and recommend the next steps.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-2xl shadow-xl shadow-indigo-100/50 p-6 border border-indigo-50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe your symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                rows="4"
                className="w-full rounded-xl border border-gray-200 p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none shadow-sm"
                placeholder="E.g., I've had a sharp headache for 2 days, and my vision is slightly blurry..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                    placeholder="Years"
                    required
                    min="0"
                    max="120"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 p-3 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm bg-white"
                  >
                    <option value="Less than a day">Less than a day</option>
                    <option value="1-3 days">1-3 days</option>
                    <option value="1 week">About a week</option>
                    <option value="More than a week">More than a week</option>
                    <option value="Months">Months</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <div className="relative">
                  <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    name="severityLevel"
                    value={formData.severityLevel}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm bg-white"
                  >
                    <option value="Mild">Mild - Barely noticeable</option>
                    <option value="Moderate">Moderate - Annoying but manageable</option>
                    <option value="Severe">Severe - Impacts daily activities</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Symptoms...
                </>
              ) : (
                <>
                  Analyze Symptoms
                  <ChevronRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {!result && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-10 h-10 text-indigo-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Awaiting Assessment</h3>
              <p className="text-gray-500">Fill out your symptoms and details on the left to receive an AI-powered initial assessment.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-2xl">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-100 rounded-full animate-ping absolute opacity-50" />
                <div className="w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin relative z-10" />
              </div>
              <p className="mt-6 text-lg font-medium text-indigo-600 animate-pulse">Running diagnostic models...</p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 space-y-6 animate-in slide-in-from-right-4 duration-500">
              
              {result.requiresImmediateAttention && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-4">
                  <div className="bg-red-100 p-2 rounded-full mt-1">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-red-800 font-bold text-lg">EMERGENCY ALERT</h3>
                    <p className="text-red-700 mt-1">Your symptoms suggest a potentially life-threatening condition. Please seek immediate medical attention or call emergency services.</p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900">Assessment Report</h2>
                <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${severityColors[result.severityClassification] || severityColors.Mild}`}>
                  {result.severityClassification} Severity
                </span>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-indigo-500" />
                  Possible Conditions
                </h3>
                <div className="space-y-3">
                  {result.possibleConditions?.map((condition, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-gray-900">{condition.condition}</span>
                        <span className={`text-xs px-2 py-1 rounded-md font-medium ${
                          condition.confidence === 'High' ? 'bg-green-100 text-green-700' :
                          condition.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {condition.confidence} Match
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{condition.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  Precautions
                </h3>
                <ul className="space-y-2">
                  {result.precautions?.map((precaution, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 bg-indigo-50/50 p-3 rounded-lg">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </div>

              {result.recommendedSpecialist && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Specialist</h3>
                  <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100">
                    {result.recommendedSpecialist}
                  </div>
                  
                  {result.recommendedDoctors?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      <p className="text-sm text-gray-500">Matching doctors available:</p>
                      {result.recommendedDoctors.map(doctor => (
                        <div key={doctor.id} className="flex items-center gap-4 bg-white border border-gray-200 p-3 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                            {doctor.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{doctor.name}</p>
                            <p className="text-xs text-gray-500">{doctor.specialization || 'Doctor'}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
