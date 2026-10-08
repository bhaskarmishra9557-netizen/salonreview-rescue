import React from 'react';
import import { Sparkles, LogOut, User, Store, ShieldCheck } from 'lucide-react';
import type { SalonProfile } from '../types/database';

interface NavbarProps {
  user: any;
  salonProfile: SalonProfile | null;
  activeTab: 'landing' | 'dashboard' | 'new-review' | 'history' | 'setup';
  onNavigate: (tab: 'landing' | 'dashboard' | 'new-review' | 'history' | 'setup') => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onSignOut: () => void;
 


export const Navbar: React.FC<NavbarProps> = ({
  user,
  salonProfile,
  activeTab,
  onNavigate,
  onOpenAuth,
  onSignOut,
  
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#faf9f6]/90 backdrop-blur-md border-b border-[#e7e3dc]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate(user ? 'dashboard' : 'landing')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#2c2724] text-[#f7eedf] flex items-center justify-center font-display font-semibold text-lg shadow-sm group-hover:bg-[#1a1715] transition-colors">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-display font-semibold text-lg text-[#1f1d1b] tracking-tight group-hover:text-[#423b36] transition-colors">
                SalonReview Rescue
              </span>
            </div>
          </button>

          {/* Database status indicator button */}
          <button
            onClick={onOpenSupabaseInfo}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-[#f0ece4] hover:bg-[#e7e1d5] text-[#5c544c] border border-[#ded8cc] transition-colors ml-2"
            title="Click to view Supabase database details"
          >
            <Database className="w-3 h-3 text-[#3ecf8e]" />
            <span>Supabase: {isLiveSupabase ? 'Connected' : 'Local Sandbox'}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#5c544c]">
          {user ? (
            <>
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors hover:text-[#1f1d1b] ${
                  activeTab === 'dashboard' ? 'text-[#1f1d1b] font-semibold border-b-2 border-[#2c2724] pb-0.5' : ''
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => onNavigate('new-review')}
                className={`transition-colors hover:text-[#1f1d1b] ${
                  activeTab === 'new-review' ? 'text-[#1f1d1b] font-semibold border-b-2 border-[#2c2724] pb-0.5' : ''
                }`}
              >
                New Review
              </button>
              <button
                onClick={() => onNavigate('history')}
                className={`transition-colors hover:text-[#1f1d1b] ${
                  activeTab === 'history' ? 'text-[#1f1d1b] font-semibold border-b-2 border-[#2c2724] pb-0.5' : ''
                }`}
              >
                Review History
              </button>
              <button
                onClick={() => onNavigate('setup')}
                className={`transition-colors hover:text-[#1f1d1b] ${
                  activeTab === 'setup' ? 'text-[#1f1d1b] font-semibold border-b-2 border-[#2c2724] pb-0.5' : ''
                }`}
              >
                Salon Setup
              </button>
            </>
          ) : (
            <>
              <a href="#how-it-works" className="hover:text-[#1f1d1b] transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-[#1f1d1b] transition-colors">
                The 3 Outputs
              </a>
              <a href="#pricing" className="hover:text-[#1f1d1b] transition-colors">
                Pricing
              </a>
              <a href="#safety" className="hover:text-[#1f1d1b] transition-colors">
                Safety Guardrails
              </a>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {salonProfile && (
                <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#5c544c] bg-[#f2eee7] px-3 py-1.5 rounded-md border border-[#e4ded4]">
                  <Store className="w-3.5 h-3.5 text-[#8c8275]" />
                  <span className="font-medium text-[#2c2724] truncate max-w-[140px]">{salonProfile.salon_name}</span>
                </div>
              )}
              <button
                onClick={() => onNavigate('new-review')}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2c2724] hover:bg-[#1a1715] rounded-md transition-colors shadow-sm whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#d9caa9]" />
                Handle Review
              </button>
              <button
                onClick={onSignOut}
                className="p-1.5 text-[#736a60] hover:text-[#1f1d1b] hover:bg-[#ede8df] rounded-md transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('signin')}
                className="px-3.5 py-1.5 text-xs font-medium text-[#423b36] hover:text-[#1f1d1b] transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#2c2724] hover:bg-[#1a1715] rounded-md transition-colors shadow-sm whitespace-nowrap"
              >
                Try SalonReview Rescue
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
