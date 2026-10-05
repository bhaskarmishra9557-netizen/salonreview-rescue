import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'signin',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    // Validation
    if (mode === 'signup') {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match. Please verify both password fields.');
        return;
      }
    }

    setLoading(true);

    try {
      if (mode === 'signup') {
        // 1. Register and auto-confirm through server helper to avoid unconfirmed email blocks
        const regRes = await fetch('/api/auth/register-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            password,
            full_name: fullName.trim(),
          }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          throw new Error(regData.error || 'Failed to create account.');
        }

        // 2. Sign in directly on client with public VITE_SUPABASE_ANON_KEY
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.user) {
          onSuccess();
          onClose();
        }
      } else if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // Provide friendly message for wrong credentials
          if (error.message.toLowerCase().includes('invalid') || error.status === 400) {
            setErrorMsg('Invalid login credentials. Please check your email and password.');
          } else {
            setErrorMsg(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          onSuccess();
          onClose();
        }
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        setSuccessMsg('Password reset instructions have been sent to ' + email.trim() + '.');
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication error occurred.');
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      const demoEmail = 'salonowner.rescue.demo@gmail.com';
      const demoPassword = 'DemoSalonPassword2026!';
      
      // Ensure user is confirmed in Supabase
      await fetch('/api/auth/register-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: demoEmail,
          password: demoPassword,
          full_name: 'Genevieve Dupré',
        }),
      });

      // Sign in via client-side anon key
      const { data, error } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (error) throw error;

      if (data.user) {
        onSuccess();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-[#ded8cc] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#ece7de] flex items-center justify-between bg-[#faf8f4]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#2c2724] text-white flex items-center justify-center font-display text-xs font-bold">
              S
            </div>
            <h3 className="font-display font-semibold text-base text-[#1c1a18]">
              {mode === 'signup' 
                ? 'Create Salon Owner Account' 
                : mode === 'forgot'
                ? 'Reset Your Password'
                : 'Sign In to SalonReview Rescue'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#827465] hover:text-[#1c1a18] hover:bg-[#ede8df] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#423b36] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Genevieve Dupré"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[#423b36] mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="salon.owner@example.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#423b36]">
                    Password
                  </label>
                  {mode === 'signin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setErrorMsg(null);
                        setSuccessMsg(null);
                        setMode('forgot');
                      }}
                      className="text-[11px] text-[#827465] hover:text-[#1c1a18] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                  />
                </div>
              </div>
            )}

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#423b36] mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#8c8275]">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-[#ded8cc] rounded-md focus:outline-none focus:ring-1 focus:ring-[#2c2724] focus:border-[#2c2724]"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#2c2724] hover:bg-[#1a1715] disabled:opacity-60 text-white text-xs font-semibold rounded-md transition-colors shadow-sm mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Please wait...</span>
              ) : mode === 'signup' ? (
                <span>Create Account</span>
              ) : mode === 'forgot' ? (
                <span>Send Reset Link</span>
              ) : (
                <span>Login</span>
              )}
            </button>
          </form>

          {/* Quick Demo Login Option */}
          {mode === 'signin' && (
            <div className="mt-5 pt-4 border-t border-[#ece7de]">
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={loading}
                className="w-full py-2 px-3 text-xs font-medium text-[#423b36] bg-[#f2eee7] hover:bg-[#eae4d8] rounded-md border border-[#ded8cc] transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#a88d5e]" />
                <span>Quick 1-Click Demo Login</span>
              </button>
              <p className="text-[11px] text-center text-[#827465] mt-1.5">
                Instantly signs into a verified salon account
              </p>
            </div>
          )}

          {/* Toggle mode links */}
          <div className="mt-4 text-center text-xs text-[#5c544c]">
            {mode === 'signup' ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setMode('signin');
                  }}
                  className="font-semibold text-[#2c2724] hover:underline"
                >
                  Login
                </button>
              </p>
            ) : mode === 'forgot' ? (
              <p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setMode('signin');
                  }}
                  className="font-semibold text-[#2c2724] hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Login</span>
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setSuccessMsg(null);
                    setMode('signup');
                  }}
                  className="font-semibold text-[#2c2724] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
