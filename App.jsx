
import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  AppointmentStatus, 
  RiskCategory 
} from './types';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import { analyzeSymptoms } from './services/geminiService';

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('LANDING');
  const [appointments, setAppointments] = useState([]);
  const [clinicConfig, setClinicConfig] = useState({
    location: "Main Street Medical Center",
    specialization: "General Medicine & Cardiology",
    openingTime: "08:00",
    closingTime: "18:00",
    maxPatientsPerDay: 40,
    consultationDuration: 15
  });

  // Persistence Logic
  useEffect(() => {
    const savedUser = localStorage.getItem('priorcare_user');
    const savedAppointments = localStorage.getItem('priorcare_appointments');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    } else {
      // Mock initial data if empty
      const initial = [
        {
          id: '1',
          patientId: 'p1',
          patientName: 'John Doe',
          patientAge: 65,
          symptoms: 'Mild chest pain and dizziness',
          chronicConditions: ['Diabetes'],
          severityScore: 8,
          riskCategory: RiskCategory.HIGH,
          preferredWindow: 'MORNING',
          requestTime: Date.now() - 3600000,
          scheduledTime: '09:00 AM',
          status: AppointmentStatus.PENDING,
          estimatedWaitMinutes: 15,
          aiReasoning: 'Age and chronic condition combined with chest pain indicates cardiac risk.'
        }
      ];
      setAppointments(initial);
      localStorage.setItem('priorcare_appointments', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('priorcare_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('priorcare_user', JSON.stringify(user));
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('priorcare_user');
    setView('LANDING');
  };

  const addAppointment = async (data) => {
    const analysis = await analyzeSymptoms(
      data.symptoms || '', 
      data.patientAge || 30, 
      data.chronicConditions || []
    );

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      patientId: currentUser?.id || 'guest',
      patientName: currentUser?.name || 'Guest Patient',
      patientAge: currentUser?.age || 30,
      symptoms: data.symptoms || '',
      chronicConditions: data.chronicConditions || [],
      severityScore: analysis.severityScore,
      riskCategory: analysis.riskCategory,
      preferredWindow: data.preferredWindow || 'MORNING',
      requestTime: Date.now(),
      scheduledTime: null,
      status: AppointmentStatus.PENDING,
      estimatedWaitMinutes: appointments.filter(a => a.status === AppointmentStatus.PENDING).length * 15 + 10,
      aiReasoning: analysis.reasoning
    };

    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointmentStatus = (id, status) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status } : app));
  };

  const reorderQueue = (newOrder) => {
    setAppointments(newOrder);
  };

  return (
    <div className="min-h-screen">
      {view === 'LANDING' && (
        <LandingPage 
          onStartPatient={() => { setView('LOGIN'); }} 
          onStartDoctor={() => { setView('LOGIN'); }} 
        />
      )}
      
      {view === 'LOGIN' && (
        <LoginPage onLogin={handleLogin} onBack={() => setView('LANDING')} />
      )}

      {view === 'DASHBOARD' && currentUser?.role === UserRole.DOCTOR && (
        <DoctorDashboard 
          appointments={appointments} 
          onUpdateStatus={updateAppointmentStatus} 
          onLogout={handleLogout}
          onReorder={reorderQueue}
          clinicConfig={clinicConfig}
          onUpdateClinic={setClinicConfig}
          doctorName={currentUser.name}
        />
      )}

      {view === 'DASHBOARD' && currentUser?.role === UserRole.PATIENT && (
        <PatientDashboard 
          appointments={appointments.filter(a => a.patientId === currentUser.id)}
          onSubmitAppointment={addAppointment}
          onLogout={handleLogout}
          patientUser={currentUser}
        />
      )}
    </div>
  );
};

export default App;
