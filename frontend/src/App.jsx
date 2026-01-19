import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Header from './Components/Header';
import AdminPanel from './Pages/AdminPanel';
import Boats from './Pages/Boats';
import Boat from './Pages/Boat';
import Dashboard from './Pages/Dashboard';
import ProtectedRoute from './Components/ProtectedRoute';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    
    setIsAuthenticated(false);
    setUserRole(null);
    navigate('/login');
  };

  return(<>
    <Header 
        isAuthenticated={isAuthenticated} 
        userRole={userRole} 
        onLogout={handleLogout} 
    />
    
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route 
          path="/boats" 
          element={<Boats isAuthenticated={isAuthenticated} />}
      />
      <Route path="/boats/:id" element={<Boat isAuthenticated={isAuthenticated}/>} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Dashboard isAuthenticated={isAuthenticated}/>
          </ProtectedRoute>
        }
      />

      <Route 
        path="/login" 
        element={
          <Login 
            setIsAuthenticated={setIsAuthenticated} 
            setUserRole={setUserRole} 
          />
        }
      />
      
      <Route path="/register" element={<Register/>}/> 
      
      <Route 
        path="/AdminPanel" 
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AdminPanel 
              setIsAuthenticated={setIsAuthenticated} 
              setUserRole={setUserRole} 
            />
          </ProtectedRoute>
        }
      />
    </Routes>
  </>)
}

export default App;