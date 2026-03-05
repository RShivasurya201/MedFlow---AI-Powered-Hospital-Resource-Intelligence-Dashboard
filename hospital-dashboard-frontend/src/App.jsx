import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPages";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import ResourcesPage from "./pages/ResourcesPage";
import PredictionsPage from "./pages/PredictionsPage";
import AlertsPage from "./pages/AlertsPage";
import MainLayout from "./layout/MainLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./styles/global.css";
import { ToastProvider } from "./context/ToastContext";

function App() {
  console.log("APP RENDERED");
  return (
    
    <ToastProvider >
    <Router>
      <Routes>
        {/* Always show login by default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Layout Wrapper */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
        </Route>

        {/* Default redirect: anything unknown goes to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
    </ToastProvider>
  
  );
}

export default App;