import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home/Home';
import Report from './pages/Report/Report';
import Scams from './pages/Scams/Scams';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Help from './pages/Help/Help';
import UserManagement from './pages/UserManagement/UserManagement'; // Added import
import './styles/global.css';

function ProtectedRoute({ children, redirectTo = '/login', requiredRole = null }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to={redirectTo} />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/scams" />; // Redirect to a safe page if role doesn't match
  }
  return children;
}

function AuthRoute({ children }) {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
          <Route path="/scams" element={<ProtectedRoute><Scams /></ProtectedRoute>} />
          <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
          <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
          <Route path="/help" element={<Help />} />
          <Route
            path="/user-management"
            element={
              <ProtectedRoute requiredRole="law_enforcement">
                <UserManagement />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;