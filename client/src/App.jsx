import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HostelsPage from './Pages/HostelsPage';


function App() {
  return (
    <Router>
        <Navbar/>
        <Routes>
          
            <Route path="/hostels" element={<HostelsPage/>} />
            
        </Routes>
    </Router>

  )
}

export default App
