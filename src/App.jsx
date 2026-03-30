import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Chatbot from './Components/Chatbot';
import Toast from './Components/Toast';
import Home from './Pages/Home';
import Flights from './Pages/Flights';
import Tours from './Pages/Tours';
import Hotels from './Pages/Hotels';
import MyTrips from './Pages/MyTrips';
import Login from './Pages/Login';
import Register from './Pages/Register';
import BookingPage from './Pages/BookingPage';
import FlightBooking from './Pages/FlightBooking';
import AdminDashboard from './Pages/AdminDashboard';
import TourDetails from './Pages/TourDetails';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--color-brand-bg)] text-white">
        <Navbar />
        <Toast />
        <main className="pt-0">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/flights" element={<Flights />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:id" element={<TourDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected User Routes */}
            <Route 
              path="/my-trips" 
              element={
                <ProtectedRoute>
                  <MyTrips />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book/:tourId" 
              element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/book-flight/:flightId" 
              element={
                <ProtectedRoute>
                  <FlightBooking />
                </ProtectedRoute>
              } 
            />

            {/* Protected Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <Chatbot />
      </div>
    </Router>
  );
}

export default App;