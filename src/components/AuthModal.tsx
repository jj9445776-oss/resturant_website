import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, Phone, ArrowRight, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google Sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (mode === 'login') {
        if (!email || !password) {
          throw new Error('Please provide both email and password.');
        }
        await loginWithEmail(email, password);
        onClose();
      } else if (mode === 'register') {
        if (!displayName || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        await registerWithEmail(email, password, displayName, phone);
        onClose();
      } else if (mode === 'forgot') {
        if (!email) {
          throw new Error('Please enter your account email.');
        }
        await resetPassword(email);
        setSuccessMessage('Password reset link has been dispatched to your email.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = err?.message || 'Authentication error';
      if (msg.includes('user-not-found')) msg = 'No account found with this email.';
      if (msg.includes('wrong-password') || msg.includes('invalid-credential')) msg = 'Invalid email or password.';
      if (msg.includes('email-already-in-use')) msg = 'An account already exists with this email address.';
      if (msg.includes('weak-password')) msg = 'Password is too weak. Please use at least 6 characters.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-stone-900 border border-amber-900/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/80 z-10 overflow-hidden"
          id="auth-modal-dialog"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition"
            aria-label="Close authentication modal"
            id="auth-modal-close-btn"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="text-center mb-6">
            <span className="inline-block px-3 py-1 bg-amber-500/10 text-amber-400 text-xs tracking-widest font-semibold rounded-full uppercase border border-amber-500/20 mb-2">
              Royal Factory Access
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-100">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Join the Gourmet Club'}
              {mode === 'forgot' && 'Reset Password'}
            </h2>
            <p className="text-sm text-stone-400 mt-1">
              {mode === 'login' && 'Log in to track orders, claim coupons, and earn reward points'}
              {mode === 'register' && 'Create your customer profile in seconds'}
              {mode === 'forgot' && 'Enter your email to receive recovery instructions'}
            </p>
          </div>

          {/* Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle size={16} className="shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign-in Button */}
          {mode !== 'forgot' && (
            <>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-stone-700 bg-stone-800/80 hover:bg-stone-800 text-stone-200 font-medium text-sm transition hover:border-amber-500/50 mb-4 cursor-pointer disabled:opacity-50"
                id="auth-google-login-btn"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-stone-800 w-full" />
                <span className="bg-stone-900 px-3 text-xs text-stone-500 uppercase tracking-wider">or</span>
                <div className="border-t border-stone-800 w-full" />
              </div>
            </>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1" htmlFor="auth-name">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                  <input
                    id="auth-name"
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Bilal Ahmad"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1" htmlFor="auth-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                <input
                  id="auth-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition"
                />
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1" htmlFor="auth-phone">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                  <input
                    id="auth-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92 300 1234567"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-stone-300" htmlFor="auth-password">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setMode('forgot');
                      }}
                      className="text-xs text-amber-400 hover:text-amber-300 transition"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                  <input
                    id="auth-password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1" htmlFor="auth-confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                  <input
                    id="auth-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-stone-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              id="auth-submit-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login' && 'Sign In'}
                    {mode === 'register' && 'Create Account'}
                    {mode === 'forgot' && 'Send Reset Link'}
                  </span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Mode Switchers */}
          <div className="mt-6 text-center text-xs text-stone-400">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode('register');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium ml-1 underline transition"
                  id="auth-switch-to-register"
                >
                  Sign up now
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode('login');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium ml-1 underline transition"
                  id="auth-switch-to-login"
                >
                  Sign in
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your credentials?{' '}
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setMode('login');
                  }}
                  className="text-amber-400 hover:text-amber-300 font-medium ml-1 underline transition"
                  id="auth-switch-back-to-login"
                >
                  Back to Sign In
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
