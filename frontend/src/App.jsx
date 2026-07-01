import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Common/Navbar';
import Footer from './components/Common/Footer';
import ProtectedRoute from './components/Common/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BrowseAuctions from './pages/BrowseAuctions';
import AuctionDetails from './pages/AuctionDetails';
import CreateAuction from './pages/CreateAuction';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14] transition-colors duration-300">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/browse" element={<BrowseAuctions />} />
                  <Route path="/auctions/:id" element={<AuctionDetails />} />

                  {/* Protected Routes */}
                  <Route path="/create-auction" element={
                    <ProtectedRoute><CreateAuction /></ProtectedRoute>
                  } />
                  <Route path="/dashboard" element={
                    <ProtectedRoute><Dashboard /></ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute><Profile /></ProtectedRoute>
                  } />
                  <Route path="/admin" element={
                    <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
                  } />

                  {/* 404 catch-all */}
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
                      <p className="text-7xl font-black text-slate-200 dark:text-slate-800 mb-4">404</p>
                      <h2 className="text-2xl font-extrabold text-slate-800 dark:text-slate-200 mb-2">Page Not Found</h2>
                      <p className="text-slate-400 mb-6">The page you're looking for doesn't exist.</p>
                      <a href="/" className="btn-primary px-6 py-2.5 text-sm font-bold">Go Home</a>
                    </div>
                  } />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
