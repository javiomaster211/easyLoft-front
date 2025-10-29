import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { Dashboard } from './components/Dashboard';

function App() {
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" />
          ) : (
            <div>
              <h1>EasyLoft - Sistema de Gestión de Palomares</h1>
              {showLogin ? (
                <>
                  <Login />
                  <p>
                    ¿No tienes cuenta? 
                    <button onClick={() => setShowLogin(false)}>Registrarse</button>
                  </p>
                  <p>
                    <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                  </p>
                </>
              ) : (
                <>
                  <Register />
                  <p>
                    ¿Ya tienes cuenta? 
                    <button onClick={() => setShowLogin(true)}>Iniciar Sesión</button>
                  </p>
                </>
              )}
            </div>
          )
        } />
        
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/dashboard" element={
          isAuthenticated ? <Dashboard /> : <Navigate to="/" />
        } />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
