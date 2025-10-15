import {BrowserRouter as Router, Routes, Route} from 'react-router'; 
import './App.css';
import LogReg from "./pages/LoginRegister";
import ToDo from "./pages/ToDo";

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LogReg/>}/>
        <Route path='/ToDo' element={<ToDo/>}/>
      </Routes>
    </Router>
  )
}

export default App
