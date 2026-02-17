
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenClone: () => void;
  isCloneActive: boolean;
  activeGender: 'Men' | 'Women';
  onGenderChange: (g: 'Men' | 'Women') => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenAccount: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  cartCount, onOpenCart, onOpenClone, isCloneActive, 
  activeGender, onGenderChange, currentUser, onOpenAuth, onOpenAccount 
}) => {
  return (
    <header className="sticky top-0 z-50 glass-morphism border-b border-stone-200 py-3 px-6 md:px-12 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <div className="w-10 h-10 bg-stone-900 flex items-center justify-center rounded-xl shadow-lg">
            <i className="fas fa-bolt text-green-400 text-xl"></i>
          </div>
          <h1 className="text-xl font-black tracking-tighter text-stone-900 hidden sm:block">ECOTHREAD</h1>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button 
            onClick={() => onGenderChange('Men')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeGender === 'Men' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            For Men
          </button>
          <button 
            onClick={() => onGenderChange('Women')}
            className={`px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              activeGender === 'Women' ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'
            }`}
          >
            For Women
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onOpenClone}
          className={`group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 hidden sm:flex ${
            isCloneActive 
              ? 'bg-green-50 border-green-200 text-green-700' 
              : 'bg-white border-stone-200 text-stone-600 hover:border-stone-900 hover:text-stone-900 shadow-sm'
          }`}
        >
          <div className={`w-2 h-2 rounded-full ${isCloneActive ? 'bg-green-500 animate-pulse' : 'bg-stone-300'}`}></div>
          <span className="text-xs font-bold uppercase tracking-wider">{isCloneActive ? 'Clone Active' : 'Setup AI Clone'}</span>
        </button>

        <div className="h-6 w-px bg-stone-200 hidden sm:block mx-1"></div>

        {currentUser ? (
          <button 
            onClick={onOpenAccount}
            className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-lg hover:scale-110 transition-transform"
          >
            {currentUser.fullName.charAt(0)}
          </button>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="text-stone-600 hover:text-stone-900 transition-colors p-2 bg-stone-50 rounded-xl"
          >
            <i className="fas fa-user text-lg"></i>
          </button>
        )}

        <button 
          onClick={onOpenCart}
          className="relative text-stone-800 hover:scale-110 transition-transform p-2 bg-stone-100 rounded-xl"
        >
          <i className="fas fa-shopping-bag text-lg"></i>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
