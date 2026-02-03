
import React from 'react';
import { COLORS } from '../constants';

interface LandingPageProps {
  onStartPatient: () => void;
  onStartDoctor: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartPatient, onStartDoctor }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 text-white shadow-lg" style={{ backgroundColor: COLORS.MEDICAL_BLUE }}>
        <div className="flex items-center space-x-2">
          <i className="fa-solid fa-house-medical text-2xl"></i>
          <span className="text-2xl font-bold tracking-tight">PriorCare</span>
        </div>
        <div className="hidden md:flex space-x-8 font-medium">
          <a href="#" className="hover:text-blue-100 transition">About</a>
          <a href="#" className="hover:text-blue-100 transition">Features</a>
          <a href="#" className="hover:text-blue-100 transition">Contact</a>
        </div>
        <div className="flex space-x-4">
          <button onClick={onStartPatient} className="px-4 py-2 border border-white rounded-md hover:bg-white hover:text-blue-600 transition duration-300">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow flex flex-col items-center justify-center px-6 py-20 text-center bg-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            AI-Powered Smart Appointment <br/>
            <span className="text-blue-600">Scheduling for Faster Healthcare</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Get prioritized medical attention based on symptoms, not arrival time. Our AI analyzes your severity in real-time to save lives.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStartPatient}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
              style={{ backgroundColor: COLORS.MEDICAL_BLUE }}
            >
              <i className="fa-solid fa-user-injured"></i>
              <span>I'm a Patient</span>
            </button>
            <button 
              onClick={onStartDoctor}
              className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center justify-center space-x-2"
              style={{ backgroundColor: COLORS.SUCCESS_GREEN }}
            >
              <i className="fa-solid fa-user-md"></i>
              <span>I'm a Doctor</span>
            </button>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-4">
              <i className="fa-solid fa-clock"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">30% Faster Triage</h3>
            <p className="text-gray-500">AI automatically sorts patients based on severity for critical care.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center text-red-600 mb-4">
              <i className="fa-solid fa-bolt"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Emergency Detection</h3>
            <p className="text-gray-500">Instant prioritization of life-threatening symptoms and chronic alerts.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left">
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center text-green-600 mb-4">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3 className="text-lg font-bold mb-2">Clinic Optimization</h3>
            <p className="text-gray-500">Smart load balancing to reduce burnout and maximize patient output.</p>
          </div>
        </div>
      </header>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <i className="fa-solid fa-house-medical text-xl text-blue-400"></i>
            <span className="text-xl font-bold">PriorCare</span>
          </div>
          <p className="text-slate-400 text-sm">&copy; 2024 PriorCare AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
