import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DoctorDashboard from "./pages/DoctorDashboard";
import Login from "./pages/Login";
import PatientDashboard from "./pages/PatientDashboard";
import Register from "./pages/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
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
  path="/patient/dashboard"
  element={
    <ProtectedRoute role="PATIENT">
      <PatientDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
