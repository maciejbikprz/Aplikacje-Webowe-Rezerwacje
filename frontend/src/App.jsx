import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ExampleAdd from './Pages/ExampleAdd';
import Register from './Pages/Register';
import Login from './Pages/Login';

function App() {
  return(<>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/> 
      <Route path="/ExampleAdd" element={<ExampleAdd/>}/>
    </Routes>
  </>)
}

export default App;