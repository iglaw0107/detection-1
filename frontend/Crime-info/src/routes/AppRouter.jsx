import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Cameras from "../pages/Cameras";
import Crimes from "../pages/Crimes";
import VideoDetect from "../pages/VideoDetect";
import PredictRisk from "../pages/PredictRisk";
import Analytics from "../pages/Analytics";
import Alerts from "../pages/Alerts";
import Users from "../pages/Users";
import Profile from "../pages/Profile";
import { useAuth } from "../context/AuthContext";
import Signup from "../pages/Signup";
// import CrimeAI from "../pages/crimeAi";
import CrimeAI from "../pages/CrimeAI2"
import CrimeGlobe from "../components/layout/CrimeGlobe";
import LiveCamera from "../pages/LiveCamera";
import AdminCameras from "../pages/AdminCameras";
import AdminDashboard from "../pages/AdminDashboard";

function Private({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}


function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") {
    return <Navigate to="/dashboard" />; // 🔥 redirect non-admin
  }

  return children;
}

export default function AppRouter() {
  const { loading } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/" element={<CrimeAI />} />
      
      <Route path="/dashboard" element={<Private><Dashboard /></Private>} />
      <Route path="/cameras" element={<Private><Cameras /></Private>} />
      <Route path="/crimes" element={<Private><Crimes /></Private>} />
      <Route path="/video-detect" element={<Private><VideoDetect /></Private>} />
      <Route path="/predict-risk" element={<Private><PredictRisk /></Private>} />
      <Route path="/analytics" element={<Private><Analytics /></Private>} />
      <Route path="/alerts" element={<Private><Alerts /></Private>} />
      <Route path="/users" element={<Private><Users /></Private>} />
      <Route path="/profile" element={<Private><Profile /></Private>} />
      {/* <Route path="/globe" element={<CrimeGlobe />} /> */}
      

      <Route path="*" element={<Navigate to="/dashboard" />} />
      <Route path="/admin/cameras" element= {<AdminRoute><AdminCameras /></AdminRoute>}/> 
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      
      </Routes>
      
  );
}