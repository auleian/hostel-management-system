import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import HostelsPage from './Pages/HostelsPage';


import HomePage from './Pages/main/HomePage';
import SearchPage from './Pages/main/SearchPage';
import AboutPage from './Pages/main/AboutPage';
import HostelDetailPage from './Pages/main/HostelDetailPage';
import BookingDetailPage from './Pages/main/BookingDetailPage';

// Admin
import ManageHostelsPage from './Pages/dashboard/admin/ManageHostels'
import NewHostelPage from './Pages/dashboard/admin/NewHostel'
import EditHostel from './Pages/dashboard/Admin/EditHostel'
import Settings from './Pages/dashboard/admin/Settings'

import AdminHomePage from './Pages/dashboard/HomePage'
import NewRoomPage from './Pages/dashboard/hostelAdmin/NewRoom'
import ManageRoomPage from './Pages/dashboard/hostelAdmin/ManageRoom'
import BookingsPage from './Pages/dashboard/hostelAdmin/Bookings'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/hostel/:id" element={<HostelDetailPage />} />
        <Route path="/booking/:id" element={<BookingDetailPage />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/hostels" element={<ManageHostelsPage />} />
        <Route path="/admin/hostels/new" element={<NewHostelPage />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/hostels/:id/rooms/new" element={<NewRoomPage />} />
        <Route path="/admin/hostels/:id/rooms" element={<ManageRoomPage />} />
        <Route path="/admin/hostels/:id/bookings" element={<BookingsPage />} />
        <Route path="/admin/hostels/:id" element={<EditHostel />} />

        
      </Routes>
    </Router>

  )
}

export default App
