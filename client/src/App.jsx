import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import TpoDashboard from './pages/TpoDashboard';
import { useSelector } from 'react-redux';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />; // Or unauthorized page
  }

  return children;
};

// Redirect based on role if already logged in
const PublicRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated && user) {
    if (user.role === 'Student') return <Navigate to="/student" replace />;
    if (user.role === 'Recruiter') return <Navigate to="/recruiter" replace />;
    if (user.role === 'TPO') return <Navigate to="/tpo" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background font-sans antialiased">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

          {/* Dashboard Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['Student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/*"
            element={
              <ProtectedRoute allowedRoles={['Recruiter']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tpo/*"
            element={
              <ProtectedRoute allowedRoles={['TPO']}>
                <TpoDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - Redirect to Login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
