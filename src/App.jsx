import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { ExploreProjectsPage } from './pages/public/ExploreProjectsPage';
import { ProjectDetailPage } from './pages/public/ProjectDetailPage';
import { StudentProfilePage } from './pages/public/StudentProfilePage';
import { TeamDetailPage } from './pages/public/TeamDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentProfileEdit } from './pages/student/StudentProfileEdit';
import { StudentPortfolioPage } from './pages/student/StudentPortfolioPage';
import { StudentApplicationsPage } from './pages/student/StudentApplicationsPage';
import { StudentTeamsPage } from './pages/student/StudentTeamsPage';
import { CreateTeamPage } from './pages/student/CreateTeamPage';
import { FindTeammatesPage } from './pages/student/FindTeammatesPage';
import { StudentNotificationsPage } from './pages/student/StudentNotificationsPage';

// Business Pages
import { BusinessDashboard } from './pages/business/BusinessDashboard';
import { BusinessProfilePage } from './pages/business/BusinessProfilePage';
import { BusinessProjectsPage } from './pages/business/BusinessProjectsPage';
import { PostProjectWizard } from './pages/business/PostProjectWizard';
import { BusinessApplicantsPage } from './pages/business/BusinessApplicantsPage';
import { BusinessNotificationsPage } from './pages/business/BusinessNotificationsPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Public Routes with PublicLayout - accessible to all (including logged-in users) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/projects" element={<ExploreProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/students/:studentId" element={<StudentProfilePage />} />
            <Route path="/teams/:teamId" element={<TeamDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Routes - protected for student role only */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRole="student">
                <DashboardLayout role="student" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<StudentProfileEdit />} />
            <Route path="portfolio" element={<StudentPortfolioPage />} />
            <Route path="applications" element={<StudentApplicationsPage />} />
            <Route path="teams" element={<StudentTeamsPage />} />
            <Route path="teams/create" element={<CreateTeamPage />} />
            <Route path="teams/:teamId" element={<TeamDetailPage />} />
            <Route path="find-teammates" element={<FindTeammatesPage />} />
            <Route path="notifications" element={<StudentNotificationsPage />} />
            <Route index element={<Navigate to="/student/dashboard" replace />} />
          </Route>

          {/* Business Routes - protected for business role only */}
          <Route
            path="/business"
            element={
              <ProtectedRoute allowedRole="business">
                <DashboardLayout role="business" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<BusinessDashboard />} />
            <Route path="profile" element={<BusinessProfilePage />} />
            <Route path="projects" element={<BusinessProjectsPage />} />
            <Route path="projects/new" element={<PostProjectWizard />} />
            <Route path="projects/:projectId/applicants" element={<BusinessApplicantsPage />} />
            <Route path="notifications" element={<BusinessNotificationsPage />} />
            <Route index element={<Navigate to="/business/dashboard" replace />} />
          </Route>

          {/* Admin Routes - protected for admin role only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <DashboardLayout role="admin" />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
          </Route>

          {/* Catch-all redirect to public home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
