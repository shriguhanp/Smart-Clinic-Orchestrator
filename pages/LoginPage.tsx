
import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { COLORS } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onBack: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '30'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const usersStr = localStorage.getItem('priorcare_users_db') || '[]';
    const users: User[] = JSON.parse(usersStr);

    if (isRegister) {
      // Check if exists
      if (users.find(u => u.email === formData.email)) {
        setError('Email already registered');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        email: formData.email,
        role: role,
        age: role === UserRole.PATIENT ? parseInt(formData.age) : undefined,
        chronicConditions: role === UserRole.PATIENT ? ['None'] : undefined
      };

      users.push(newUser);
      localStorage.setItem('priorcare_users_db', JSON.stringify(users));
      onLogin(newUser);
    } else {
      // Simple Login check
      const user = users.find(u => u.email === formData.email);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials or user not found');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50"></div>
        
        <button onClick={onBack} className="mb-8 text-slate-400 hover:text-slate-800 flex items-center space-x-2 transition group">
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span className="font-medium">Go back</span>
        </button>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-500 ${role === UserRole.DOCTOR ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
            <i className={`fa-solid ${role === UserRole.DOCTOR ? 'fa-user-doctor' : 'fa-user'} text-4xl`}></i>
          </div>
          <h2 className="text-3xl font-black text-slate-800">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <p className="text-slate-500 mt-2">Join the future of prioritized medical care.</p>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-8">
          <button 
            onClick={() => setRole(UserRole.PATIENT)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${role === UserRole.PATIENT ? 'bg-white shadow-lg text-blue-600 scale-100' : 'text-slate-500 hover:bg-slate-200 scale-95'}`}
          >
            <i className="fa-solid fa-person mr-2"></i>
            Patient
          </button>
          <button 
            onClick={() => setRole(UserRole.DOCTOR)}
            className={`flex-1 py-3 rounded-xl font-bold transition-all duration-300 ${role === UserRole.DOCTOR ? 'bg-white shadow-lg text-green-600 scale-100' : 'text-slate-500 hover:bg-slate-200 scale-95'}`}
          >
            <i className="fa-solid fa-user-md mr-2"></i>
            Doctor
          </button>
        </div>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 animate-bounce">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegister && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                name="name"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
                placeholder="Dr. Smith or John Doe"
                onChange={handleInputChange}
                value={formData.name}
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              name="email"
              type="email" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
              placeholder="name@example.com"
              onChange={handleInputChange}
              value={formData.email}
            />
          </div>
          {isRegister && role === UserRole.PATIENT && (
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Age</label>
              <input 
                name="age"
                type="number" 
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
                placeholder="How old are you?"
                onChange={handleInputChange}
                value={formData.age}
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <input 
              name="password"
              type="password" 
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition" 
              placeholder="••••••••"
              onChange={handleInputChange}
              value={formData.password}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-2xl font-black text-white shadow-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 mt-6 active:scale-95"
            style={{ backgroundColor: role === UserRole.DOCTOR ? COLORS.SUCCESS_GREEN : COLORS.MEDICAL_BLUE }}
          >
            {isRegister ? 'Register Now' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 font-medium">
          {isRegister ? 'Already have an account?' : "Don't have an account?"} 
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="ml-2 font-black text-blue-600 hover:underline"
          >
            {isRegister ? 'Log In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
