import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import PatientDetails from "./pages/PatientDetails";
import SymptomChecker from "./pages/SymptomChecker";
import SymptomHistory from "./pages/SymptomHistory";
import CreatePrescription from "./pages/CreatePrescription";
import DoctorPrescriptions from "./pages/DoctorPrescriptions";
import PrescriptionHistory from "./pages/PrescriptionHistory";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
  path="/doctor/dashboard"
  element={
    <ProtectedRoute role="DOCTOR">
      <DoctorDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/doctor/prescriptions"
  element={
    <ProtectedRoute role="DOCTOR">
      <DoctorPrescriptions />
    </ProtectedRoute>
  }
/>
        <Route
  path="/patient/dashboard"
  element={
    <ProtectedRoute role="PATIENT">
      <PatientDashboard />
    </ProtectedRoute>
  }
/>
        <Route
  path="/patient/symptom-checker"
  element={
    <ProtectedRoute role="PATIENT">
      <SymptomChecker />
    </ProtectedRoute>
  }
/>
        <Route
  path="/patient/symptom-history"
  element={
    <ProtectedRoute role="PATIENT">
      <SymptomHistory />
    </ProtectedRoute>
  }
/>
        <Route
  path="/patient/prescriptions"
  element={
    <ProtectedRoute role="PATIENT">
      <PrescriptionHistory />
    </ProtectedRoute>
  }
/>
        <Route
  path="/doctor/patient/:id"
  element={
    <ProtectedRoute role="DOCTOR">
      <PatientDetails />
    </ProtectedRoute>
  }
/>
        <Route
  path="/doctor/prescription/create/:patientId"
  element={
    <ProtectedRoute role="DOCTOR">
      <CreatePrescription />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
