
import React, { useState } from 'react';
import { RiskCategory, AppointmentStatus } from '../types';
import { COLORS, SYMPTOMS_LIST, CHRONIC_CONDITIONS_LIST } from '../constants';

const PatientDashboard = ({ 
  appointments, 
  onSubmitAppointment, 
  onLogout,
  patientUser
}) => {
  const [isBooking, setIsBooking] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [symptomsText, setSymptomsText] = useState('');
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [preferredWindow, setPreferredWindow] = useState('MORNING');
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(item => item !== s) : [...prev, s]);
  };

  const toggleCondition = (c) => {
    setSelectedConditions(prev => prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const combinedSymptoms = [...selectedSymptoms, symptomsText].filter(Boolean).join(', ');
    
    await onSubmitAppointment({
      symptoms: combinedSymptoms,
      chronicConditions: selectedConditions,
      preferredWindow,
    });
    
    setIsSubmitting(false);
    setIsBooking(false);
    resetForm();
  };

  const resetForm = () => {
    setSelectedSymptoms([]);
    setSymptomsText('');
    setSelectedConditions([]);
    setPreferredWindow('MORNING');
    setIsEmergency(false);
  };

  const activeAppointment = appointments.find(a => a.status === AppointmentStatus.PENDING);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
            <i className="fa-solid fa-house-medical"></i>
          </div>
          <span className="text-xl font-black text-slate-800 tracking-tight">PriorCare</span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              {patientUser.name.charAt(0)}
            </div>
            <span className="text-sm font-bold text-slate-700">{patientUser.name}</span>
          </div>
          <button onClick={onLogout} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
            <i className="fa-solid fa-right-from-bracket"></i>
          </button>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-8">
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900">Health Portal</h1>
            <p className="text-slate-500 mt-2 font-medium">Track your symptoms and clinical priority.</p>
          </div>
          {!activeAppointment && !isBooking && (
            <button 
              onClick={() => setIsBooking(true)}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-xl hover:shadow-blue-200 hover:-translate-y-1 transition-all flex items-center justify-center space-x-3"
            >
              <i className="fa-solid fa-calendar-plus text-xl"></i>
              <span>Book Appointment</span>
            </button>
          )}
        </header>

        {isBooking ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden">
              {/* Form Header */}
              <div className="p-8 bg-slate-900 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black">Consultation Details</h2>
                  <p className="opacity-70 text-sm mt-1 font-medium">Help our AI prioritize your visit.</p>
                </div>
                <button onClick={() => setIsBooking(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                {/* Section 1: Symptoms */}
                <section>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <i className="fa-solid fa-virus"></i>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Identify Your Symptoms</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
                    {SYMPTOMS_LIST.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSymptom(s)}
                        className={`px-4 py-3 rounded-2xl text-xs font-bold border-2 transition-all duration-300 flex flex-col items-center gap-2 ${selectedSymptoms.includes(s) ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200 hover:text-blue-500'}`}
                      >
                        <i className={`fa-solid ${s === 'Fever' ? 'fa-thermometer' : s === 'Chest Pain' ? 'fa-heart-pulse' : 'fa-check'} text-lg`}></i>
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Additional details (Required)</label>
                    <div className="relative">
                      {/* Dark input with white text for high contrast */}
                      <textarea 
                        className="w-full px-6 py-5 rounded-3xl bg-slate-800 border-none text-white focus:ring-4 focus:ring-blue-500/20 transition-all placeholder-slate-500 resize-none font-medium" 
                        rows={4} 
                        placeholder="Please describe exactly what you are feeling and for how long..."
                        value={symptomsText}
                        onChange={(e) => setSymptomsText(e.target.value)}
                        required
                      ></textarea>
                      <div className="absolute bottom-4 right-4 text-xs text-slate-500 font-bold">
                        AI Enabled Analysis
                      </div>
                    </div>
                  </div>
                </section>

                {/* Section 2: Uploads & Medical History */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <i className="fa-solid fa-file-medical"></i>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Upload Reports</h3>
                    </div>
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer group">
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-slate-300 group-hover:text-blue-500 transition mb-3"></i>
                      <p className="text-sm font-bold text-slate-600">Drag old reports here</p>
                      <p className="text-xs text-slate-400 mt-1">PDF, JPG up to 10MB</p>
                    </div>
                  </section>

                  <section>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                        <i className="fa-solid fa-notes-medical"></i>
                      </div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">Chronic History</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {CHRONIC_CONDITIONS_LIST.map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleCondition(c)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border-2 transition-all ${selectedConditions.includes(c) ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-slate-200'}`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Final Step */}
                <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center gap-6">
                   <div className="flex-grow flex items-center space-x-4 bg-slate-50 p-6 rounded-3xl border border-slate-100 w-full">
                      <div className={`p-4 rounded-full transition-all ${isEmergency ? 'bg-red-500 text-white' : 'bg-slate-200 text-slate-400'}`}>
                        <i className="fa-solid fa-triangle-exclamation"></i>
                      </div>
                      <div className="flex-grow">
                        <label className="flex items-center justify-between cursor-pointer">
                          <div>
                            <p className="font-black text-slate-800">Mark as Critical</p>
                            <p className="text-xs text-slate-500 font-medium">Only for life-threatening emergencies</p>
                          </div>
                          <input 
                            type="checkbox" 
                            className="w-6 h-6 rounded-lg text-red-600 focus:ring-red-500" 
                            checked={isEmergency}
                            onChange={(e) => setIsEmergency(e.target.checked)}
                          />
                        </label>
                      </div>
                   </div>
                   
                   <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-12 py-5 rounded-3xl font-black text-white shadow-2xl transition-all flex items-center justify-center space-x-4 active:scale-95 ${isEmergency ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="relative w-5 h-5">
                          <div className="absolute inset-0 border-2 border-white/20 rounded-full"></div>
                          <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span>AI Triage...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-paper-plane"></i>
                        <span>Confirm Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {activeAppointment ? (
              <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden group">
                {/* Header with gradient */}
                <div className="p-8 bg-gradient-to-r from-blue-700 to-blue-500 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                  <div className="relative z-10 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <i className="fa-solid fa-wave-square animate-pulse text-xl"></i>
                      </div>
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Real-time Priority</p>
                        <h3 className="text-2xl font-black">Waiting for Consultation</h3>
                      </div>
                    </div>
                    <div className="hidden md:block px-6 py-2 bg-white/20 rounded-full text-sm font-black border border-white/30">
                      ID: #{activeAppointment.id.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="p-8 md:p-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center hover:shadow-lg transition group">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Wait Time</p>
                      <div className="text-5xl font-black text-slate-800 flex items-center justify-center">
                        {activeAppointment.estimatedWaitMinutes}
                        <span className="text-xl text-slate-400 ml-2">min</span>
                      </div>
                      <p className="text-xs text-blue-600 mt-4 font-bold flex items-center justify-center">
                        <i className="fa-solid fa-circle text-[6px] mr-2"></i> Live Update
                      </p>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center hover:shadow-lg transition">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Priority Level</p>
                      <div className="flex flex-col items-center">
                        <span className={`text-4xl font-black tracking-tight ${activeAppointment.riskCategory === RiskCategory.HIGH ? 'text-red-600' : activeAppointment.riskCategory === RiskCategory.MEDIUM ? 'text-amber-600' : 'text-green-600'}`}>
                          {activeAppointment.riskCategory}
                        </span>
                        <div className="flex space-x-1 mt-3">
                          {[1, 2, 3].map(i => (
                            <div key={i} className={`w-6 h-1.5 rounded-full ${
                              (activeAppointment.riskCategory === RiskCategory.HIGH) ? 'bg-red-500' :
                              (activeAppointment.riskCategory === RiskCategory.MEDIUM && i <= 2) ? 'bg-amber-500' :
                              (activeAppointment.riskCategory === RiskCategory.LOW && i <= 1) ? 'bg-green-500' : 'bg-slate-200'
                            }`}></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center hover:shadow-lg transition">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Scheduled Slot</p>
                      <div className="text-4xl font-black text-slate-800">
                        {activeAppointment.scheduledTime || 'TBD'}
                      </div>
                      <p className="text-xs text-slate-400 mt-4 font-bold">Dynamically Adjusted</p>
                    </div>
                  </div>

                  {/* AI Note */}
                  <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col md:flex-row items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-robot text-3xl"></i>
                    </div>
                    <div>
                      <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">AI Triage Reasoning</p>
                      <p className="text-lg font-medium leading-relaxed italic">“{activeAppointment.aiReasoning}”</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-24 text-center group hover:border-blue-300 transition-all">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-check text-4xl text-slate-300 group-hover:text-blue-400"></i>
                </div>
                <h3 className="text-2xl font-black text-slate-800">No Pending Requests</h3>
                <p className="text-slate-400 mt-2 font-medium">Your current health status is cleared.</p>
              </div>
            )}

            {/* Visit History Section */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-black text-slate-800">Clinical History</h3>
                <div className="px-4 py-1.5 bg-white rounded-full border border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Total Visits: {appointments.filter(a => a.status !== AppointmentStatus.PENDING).length}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Case Description</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Outcome</th>
                      <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.filter(a => a.status !== AppointmentStatus.PENDING).map(app => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition">
                        <td className="px-10 py-6 text-sm font-bold text-slate-500 whitespace-nowrap">
                          {new Date(app.requestTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="px-10 py-6">
                          <p className="text-sm text-slate-800 font-bold max-w-xs truncate">{app.symptoms}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Report #PR-{app.id.substr(0, 4)}</p>
                        </td>
                        <td className="px-10 py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            app.status === AppointmentStatus.CONSULTED ? 'bg-green-100 text-green-700' : 
                            app.status === AppointmentStatus.EMERGENCY ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-10 py-6 text-right">
                          <button className="text-blue-600 font-black text-xs hover:underline">Full Summary</button>
                        </td>
                      </tr>
                    ))}
                    {appointments.filter(a => a.status !== AppointmentStatus.PENDING).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-10 py-20 text-center text-slate-400 font-medium italic">No previous visit data found in your digital records.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatientDashboard;
