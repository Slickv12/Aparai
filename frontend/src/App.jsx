import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import OpenPositionsPage from './pages/OpenPositionsPage';
import ApplyFormPage from './pages/ApplyFormPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 md:pt-24">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/positions" element={<OpenPositionsPage />} />
            <Route path="/apply" element={<ApplyFormPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
