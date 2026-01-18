import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import ExampleAdd from './Pages/ExampleAdd';

function App() {
  return(<>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/ExampleAdd" element={<ExampleAdd/>}/>
    </Routes>
  </>)
}

export default App;