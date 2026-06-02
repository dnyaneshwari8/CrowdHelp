import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import DonorWall from './pages/DonorWall';
import Leaderboard from './pages/Leaderboard';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Success from './pages/Success';
import Failure from './pages/Failure';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';
import OTPVerification from './pages/OTPVerification';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminCampaigns from './pages/AdminCampaigns';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminNGOManagement from './pages/AdminNGOManagement';
import AdminNGOApplications from './pages/AdminNGOApplications';
import AdminCampaignApproval from './pages/AdminCampaignApproval';
import AdminAuditLogs from './pages/AdminAuditLogs';
import NGORegistration from './pages/NGORegistration';
import NGODashboard from './pages/NGODashboard';
import NGOAnalytics from './pages/NGOAnalytics';
import NGODonations from './pages/NGODonations';
import NGOMyCampaigns from './pages/NGOMyCampaigns';
import NGOCreateCampaign from './pages/NGOCreateCampaign';
import NGOCampaignDetails from './pages/NGOCampaignDetails';
import NGOUpdates from './pages/NGOUpdates';
import NGODocuments from './pages/NGODocuments';
import NGONotifications from './pages/NGONotifications';
import NGOProfile from './pages/NGOProfile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import NGORoute from './components/NGORoute';
import NGOOrAdminRoute from './components/NGOOrAdminRoute';
import NGOLayout from './components/NGOLayout';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/ngo') || location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isDashboard && <Navbar />}
      <main style={isDashboard ? {} : styles.main}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<OTPVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route path="/donor-wall" element={<DonorWall />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />

          {/* User Protected Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/favorites" element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          } />
          <Route path="/payment-success" element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          } />
          <Route path="/payment-failure" element={
            <ProtectedRoute>
              <Failure />
            </ProtectedRoute>
          } />
          <Route path="/donations" element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          } />
          <Route path="/apply-ngo" element={
            <ProtectedRoute>
              <NGORegistration />
            </ProtectedRoute>
          } />

          {/* NGO Protected Routes */}
          <Route path="/ngo" element={
            <NGORoute>
              <NGOLayout />
            </NGORoute>
          }>
            <Route path="dashboard" element={<NGODashboard />} />
            <Route path="analytics" element={<NGOAnalytics />} />
            <Route path="donations" element={<NGODonations />} />
            <Route path="my-campaigns" element={<NGOMyCampaigns />} />
            <Route path="create-campaign" element={<NGOCreateCampaign />} />
            <Route path="campaign/:id" element={<NGOCampaignDetails />} />
            <Route path="updates" element={<NGOUpdates />} />
            <Route path="documents" element={<NGODocuments />} />
            <Route path="notifications" element={<NGONotifications />} />
            <Route path="profile" element={<NGOProfile />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/campaigns" element={
            <NGOOrAdminRoute>
              <AdminCampaigns />
            </NGOOrAdminRoute>
          } />
          <Route path="/admin/analytics" element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          } />
          <Route path="/admin/ngo-management" element={
            <AdminRoute>
              <AdminNGOManagement />
            </AdminRoute>
          } />
          <Route path="/admin/ngo-applications" element={
            <AdminRoute>
              <AdminNGOApplications />
            </AdminRoute>
          } />
          <Route path="/admin/campaign-approvals" element={
            <AdminRoute>
              <AdminCampaignApproval />
            </AdminRoute>
          } />
          <Route path="/admin/audit-logs" element={
            <AdminRoute>
              <AdminAuditLogs />
            </AdminRoute>
          } />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

const styles = {
  main: {
    padding: '0 2rem',
    minHeight: '80vh'
  }
};

export default App;
