
import React, { useState } from 'react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('eco_thread_users') || '[]');

    if (mode === 'signup') {
      if (users.find((u: any) => u.email === formData.email)) {
        setError('Email already exists');
        return;
      }
      const newUser = { 
        id: Math.random().toString(36).substr(2, 9),
        ...formData 
      };
      users.push(newUser);
      localStorage.setItem('eco_thread_users', JSON.stringify(users));
      onAuthSuccess({ id: newUser.id, email: newUser.email, fullName: newUser.fullName });
      onClose();
    } else {
      const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
      if (user) {
        onAuthSuccess({ id: user.id, email: user.email, fullName: user.fullName });
        onClose();
      } else {
        setError('Invalid credentials');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black tracking-tighter text-stone-900 mb-2">
            {mode === 'signup' ? 'JOIN THE FUTURE' : 'WELCOME BACK'}
          </h2>
          <p className="text-stone-500 text-sm">Join our AI-powered thrift community.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Full Name</label>
              <input 
                type="text" required
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none focus:ring-2 ring-green-500/20"
                placeholder="Alex Thompson"
              />
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Email Address</label>
            <input 
              type="email" required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none focus:ring-2 ring-green-500/20"
              placeholder="alex@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Password</label>
            <input 
              type="password" required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              className="w-full bg-stone-50 border border-stone-100 p-4 rounded-2xl outline-none focus:ring-2 ring-green-500/20"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}

          <button type="submit" className="w-full py-5 bg-stone-900 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl hover:bg-green-600 transition-all mt-4">
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
            className="text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors"
          >
            {mode === 'signup' ? 'Already have an account? Login' : 'New here? Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
