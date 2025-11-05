import {BrowserRouter as Router, Routes, Route} from 'react-router'; 
import './App.css';
import LogReg from "./pages/loginRegister/LoginRegister";
import ToDo from "./pages/todo/ToDo";

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
