
import React, { useState, useMemo } from 'react';
import { 
  Appointment, 
  AppointmentStatus, 
  RiskCategory, 
  ClinicConfig 
} from '../types';
import { COLORS } from '../constants';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DoctorDashboardProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: AppointmentStatus) => void;
  onLogout: () => void;
  onReorder: (newOrder: Appointment[]) => void;
  clinicConfig: ClinicConfig;
  onUpdateClinic: (config: ClinicConfig) => void;
  doctorName: string;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ 
  appointments, 
  onUpdateStatus, 
  onLogout,
  onReorder,
  clinicConfig,
  onUpdateClinic,
  doctorName
}) => {
  const [activeTab, setActiveTab] = useState<'QUEUE' | 'ANALYTICS' | 'SETTINGS'>('QUEUE');
  const [isEditingClinic, setIsEditingClinic] = useState(false);

  // AI Sorting Logic
  const sortedQueue = useMemo(() => {
    return [...appointments]
      .filter(a => a.status === AppointmentStatus.PENDING)
      .sort((a, b) => {
        // Priority first
        const priorityScore = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        if (priorityScore[a.riskCategory] !== priorityScore[b.riskCategory]) {
          return priorityScore[b.riskCategory] - priorityScore[a.riskCategory];
        }
        // Then severity score
        if (a.severityScore !== b.severityScore) {
          return b.severityScore - a.severityScore;
        }
        // Finally arrival time
        return a.requestTime - b.requestTime;
      });
  }, [appointments]);

  const statsData = [
    { name: '08:00', patients: 2 },
    { name: '10:00', patients: 8 },
    { name: '12:00', patients: 12 },
    { name: '14:00', patients: 7 },
    { name: '16:00', patients: 5 },
    { name: '18:00', patients: 1 },
  ];

  const riskData = [
    { name: 'High', value: appointments.filter(a => a.riskCategory === RiskCategory.HIGH).length },
    { name: 'Medium', value: appointments.filter(a => a.riskCategory === RiskCategory.MEDIUM).length },
    { name: 'Low', value: appointments.filter(a => a.riskCategory === RiskCategory.LOW).length },
  ];

  const RISK_COLORS = [COLORS.EMERGENCY_RED, COLORS.AMBER_WARNING, COLORS.SUCCESS_GREEN];

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col shadow-2xl z-10" style={{ backgroundColor: COLORS.SIDEBAR_BG }}>
        <div className="p-6 flex items-center space-x-3 text-white">
          <i className="fa-solid fa-house-medical text-3xl"></i>
          <span className="text-xl font-bold tracking-tight">PriorCare</span>
        </div>
        
        <nav className="flex-grow mt-10 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('QUEUE')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'QUEUE' ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-list-ul"></i>
            <span>Patient Queue</span>
          </button>
          <button 
            onClick={() => setActiveTab('ANALYTICS')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'ANALYTICS' ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-chart-line"></i>
            <span>Analytics</span>
          </button>
          <button 
            onClick={() => setActiveTab('SETTINGS')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'SETTINGS' ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'}`}
          >
            <i className="fa-solid fa-gear"></i>
            <span>Clinic Settings</span>
          </button>
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/10 p-4 rounded-xl flex items-center space-x-3 text-white mb-4">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600 font-bold">
              {doctorName.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{doctorName}</p>
              <p className="text-xs text-blue-200">On Duty</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full py-2 px-4 rounded-lg bg-red-500/80 hover:bg-red-500 text-white font-semibold transition flex items-center justify-center space-x-2"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          <header className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800">
                {activeTab === 'QUEUE' && 'Live Patient Queue'}
                {activeTab === 'ANALYTICS' && 'Performance Analytics'}
                {activeTab === 'SETTINGS' && 'Clinic Profile'}
              </h1>
              <p className="text-slate-500 mt-1">
                {activeTab === 'QUEUE' && `AI sorted list of patients based on clinical priority.`}
                {activeTab === 'ANALYTICS' && `Insights on load, wait times, and utilization.`}
                {activeTab === 'SETTINGS' && `Manage your working hours and clinic info.`}
              </p>
            </div>
            {activeTab === 'QUEUE' && (
              <div className="flex space-x-2">
                 <div className="px-4 py-2 bg-white rounded-lg shadow-sm flex items-center space-x-2 text-slate-600 border border-slate-200">
                   <i className="fa-solid fa-circle text-[10px] text-green-500"></i>
                   <span className="text-sm font-medium">System Active</span>
                 </div>
              </div>
            )}
          </header>

          {activeTab === 'QUEUE' && (
            <div className="space-y-6">
              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-blue-500">
                  <p className="text-slate-400 text-sm font-medium">Total Pending</p>
                  <p className="text-3xl font-bold text-slate-800">{sortedQueue.length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-red-500">
                  <p className="text-slate-400 text-sm font-medium">High Priority</p>
                  <p className="text-3xl font-bold text-red-600">{sortedQueue.filter(a => a.riskCategory === RiskCategory.HIGH).length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-amber-500">
                  <p className="text-slate-400 text-sm font-medium">Avg. Wait Time</p>
                  <p className="text-3xl font-bold text-slate-800">18<span className="text-sm font-normal text-slate-400 ml-1">min</span></p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm border-l-4 border-green-500">
                  <p className="text-slate-400 text-sm font-medium">Consulted Today</p>
                  <p className="text-3xl font-bold text-green-600">{appointments.filter(a => a.status === AppointmentStatus.CONSULTED).length}</p>
                </div>
              </div>

              {/* Queue List */}
              <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-200">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Level</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Symptoms / AI Reason</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedQueue.length > 0 ? (
                      sortedQueue.map((app, index) => (
                        <tr key={app.id} className={`hover:bg-slate-50/80 transition ${app.riskCategory === RiskCategory.HIGH ? 'bg-red-50/30' : ''}`}>
                          <td className="px-6 py-4">
                            <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                              {index + 1}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-bold text-slate-800">{app.patientName}</p>
                              <p className="text-xs text-slate-500">{app.patientAge} yrs • {app.chronicConditions.join(', ')}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              app.riskCategory === RiskCategory.HIGH ? 'bg-red-100 text-red-700' :
                              app.riskCategory === RiskCategory.MEDIUM ? 'bg-amber-100 text-amber-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {app.riskCategory} ({app.severityScore}/10)
                            </span>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="text-sm font-medium text-slate-700 line-clamp-1">{app.symptoms}</p>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2 italic">“{app.aiReasoning}”</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => onUpdateStatus(app.id, AppointmentStatus.CONSULTED)}
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold transition shadow-sm"
                              >
                                Consult
                              </button>
                              <button 
                                onClick={() => onUpdateStatus(app.id, AppointmentStatus.EMERGENCY)}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg text-xs font-bold transition"
                              >
                                Emergency
                              </button>
                              <button className="px-3 py-1.5 border border-slate-200 text-slate-500 rounded-lg text-xs hover:bg-slate-100 transition">
                                <i className="fa-solid fa-ellipsis"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center text-slate-400">
                          <i className="fa-solid fa-calendar-check text-4xl mb-3 block"></i>
                          No pending patients in the queue.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'ANALYTICS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Load Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData}>
                      <defs>
                        <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={COLORS.MEDICAL_BLUE} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={COLORS.MEDICAL_BLUE} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                      />
                      <Area type="monotone" dataKey="patients" stroke={COLORS.MEDICAL_BLUE} fillOpacity={1} fill="url(#colorPatients)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Patient Risk Distribution</h3>
                <div className="h-64 flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col justify-center space-y-2 ml-4">
                    {riskData.map((entry, index) => (
                      <div key={entry.name} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: RISK_COLORS[index] }}></div>
                        <span className="text-sm text-slate-600">{entry.name}: {entry.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Daily Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-xl">
                      <i className="fa-solid fa-user-clock"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Efficiency</p>
                      <p className="text-xl font-bold text-slate-800">84%</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl">
                      <i className="fa-solid fa-fire"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Peak Hours</p>
                      <p className="text-xl font-bold text-slate-800">11 AM - 1 PM</p>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl">
                      <i className="fa-solid fa-hospital-user"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Referred Case Rate</p>
                      <p className="text-xl font-bold text-slate-800">12%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SETTINGS' && (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Clinic Profile</h3>
                  <p className="text-sm text-slate-500">Update your clinic information and availability.</p>
                </div>
                <button 
                  onClick={() => setIsEditingClinic(!isEditingClinic)}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition shadow-md"
                >
                  {isEditingClinic ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Clinic Location</label>
                    <input 
                      disabled={!isEditingClinic}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50"
                      value={clinicConfig.location}
                      onChange={(e) => onUpdateClinic({ ...clinicConfig, location: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Specialization</label>
                    <input 
                      disabled={!isEditingClinic}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50"
                      value={clinicConfig.specialization}
                      onChange={(e) => onUpdateClinic({ ...clinicConfig, specialization: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Opening Time</label>
                      <input 
                        type="time"
                        disabled={!isEditingClinic}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50"
                        value={clinicConfig.openingTime}
                        onChange={(e) => onUpdateClinic({ ...clinicConfig, openingTime: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-600 mb-1">Closing Time</label>
                      <input 
                        type="time"
                        disabled={!isEditingClinic}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50"
                        value={clinicConfig.closingTime}
                        onChange={(e) => onUpdateClinic({ ...clinicConfig, closingTime: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Max Patients / Day</label>
                    <input 
                      type="number"
                      disabled={!isEditingClinic}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50"
                      value={clinicConfig.maxPatientsPerDay}
                      onChange={(e) => onUpdateClinic({ ...clinicConfig, maxPatientsPerDay: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 mb-1">Consultation Duration (Mins)</label>
                    <select 
                      disabled={!isEditingClinic}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition disabled:bg-slate-50 appearance-none"
                      value={clinicConfig.consultationDuration}
                      onChange={(e) => onUpdateClinic({ ...clinicConfig, consultationDuration: parseInt(e.target.value) || 15 })}
                    >
                      <option value={10}>10 Mins</option>
                      <option value={15}>15 Mins</option>
                      <option value={20}>20 Mins</option>
                      <option value={30}>30 Mins</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
