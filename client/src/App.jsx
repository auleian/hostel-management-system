import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HostelsPage from './Pages/HostelsPage';


import HomePage from './Pages/main/HomePage';
import SearchPage from './Pages/main/SearchPage';
import AboutPage from './Pages/main/AboutPage';
import HostelDetailPage from './Pages/main/HostelDetailPage';
import BookingDetailPage from './Pages/main/BookingDetailPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/hostel/:id" element={<HostelDetailPage />} />
        <Route path="/booking/:id" element={<BookingDetailPage />} />
      </Routes>
    </Router>

  )
}

export default App
