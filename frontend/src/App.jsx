import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Pages/Home';
import ExampleAdd from './Pages/ExampleAdd';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Header from './Components/Header'; // Pamiętaj o imporcie!

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Przy odświeżeniu pobierz token ORAZ rolę
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
    {/* Przekazujemy stan i funkcję wylogowania do Header */}
    <Header 
        isAuthenticated={isAuthenticated} 
        userRole={userRole} 
        onLogout={handleLogout} 
    />

    <Routes>
      <Route path="/" element={<Home/>}/>
      
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
      <Route path="/ExampleAdd" element={<ExampleAdd/>}/>
    </Routes>
  </>)
}

export default App;