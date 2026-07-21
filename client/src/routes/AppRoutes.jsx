import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppShell from '../components/layout/AppShell.jsx';
const HomePage = lazy(() => import('../pages/Home/HomePage.jsx'));
const LoginPage = lazy(() => import('../pages/Login/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../pages/Register/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage.jsx'));
const GuestEditorPage = lazy(() => import('../pages/GuestEditor/GuestEditorPage.jsx'));
const DocumentEditorPage = lazy(() => import('../pages/DocumentEditor/DocumentEditorPage.jsx'));
const UploadsPage = lazy(() => import('../pages/Uploads/UploadsPage.jsx'));
const ProfilePage = lazy(() => import('../pages/Profile/ProfilePage.jsx'));
const NotFoundPage = lazy(() => import('../pages/NotFound/NotFoundPage.jsx'));

const RouteFallback = () => (
  <div className="mx-auto max-w-2xl rounded-[28px] border border-white/60 bg-white/80 p-8 text-sm text-slate-600 shadow-lg backdrop-blur-md">
    Loading page...
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="/guest" element={<GuestEditorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <DocumentEditorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/uploads"
          element={
            <ProtectedRoute>
              <UploadsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route path="/new" element={<Navigate to="/documents/new" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
