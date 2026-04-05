import React, { useState } from 'react'
import Navbar from './components/Navbar'
import {Routes, Route,  useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RideListings from './pages/RideListings';
import RideDetails from './pages/RideDetails';
import MyBookings from './pages/MyBookings';
import Layout from './pages/owner/Layout';
import Dashboard from './pages/owner/Dashboard';
import ManageRides from './pages/owner/ManageRides';
import ManageBookings from './pages/owner/ManageBookings';
import AddRide from './pages/owner/AddRide';
import Welcome from './pages/owner/Welcome';
import About from './pages/About';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const isOwnerPath = useLocation().pathname.startsWith('/owner')
  return (
    <>
      <LoginModal showLogin={showLogin} setShowLogin={setShowLogin} />
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/> }
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/rides" element={<RideListings />} />
        <Route path="/ride-details/:id" element={<RideDetails setShowLogin={setShowLogin} />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/owner" element={<Layout setShowLogin={setShowLogin} />} >
          <Route index element={<Welcome />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-rides" element={<ManageRides />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="add-ride" element={<AddRide />} />
        </Route>
      </Routes> 
      {!isOwnerPath && <Footer /> }
    </>
  )
}

export default App
