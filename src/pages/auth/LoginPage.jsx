import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const LoginPage = () => {
  const { currentUser, login, switchUserRole, addToast } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const getDashboardPathForRole = (r) => {
    if (r === 'student') return '/student/dashboard';
    if (r === 'business') return '/business/dashboard';
    if (r === 'admin') return '/admin/dashboard';
    return '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your account email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const loggedUser = await login(email.trim(), role, password);
      if (loggedUser) {
        const actualRole = loggedUser?.role || role;
        navigate(getDashboardPathForRole(actualRole), { replace: true });
      }
    } catch (err) {
      const msg = err.message || 'Authentication failed. Please check your credentials.';
      setErrorMessage(msg);
      addToast('Sign In Error', msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickLogin = (selectedRole, targetId) => {
    setErrorMessage('');
    const switchedUser = switchUserRole(selectedRole, targetId);
    const actualRole = switchedUser?.role || selectedRole;
    navigate(getDashboardPathForRole(actualRole), { replace: true });
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotModalOpen(false);
    addToast(
      'Password Reset Link Sent',
      `Simulated instructions sent to ${forgotEmail || 'your email'}. Check your inbox.`,
      'info'
    );
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span>InternBridge</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
        <p className="text-xs text-slate-500">
          Enter your registered email and password to access your workspace.
        </p>

        {currentUser && (
          <div className="mt-3 p-3 bg-indigo-50/80 border border-indigo-200 rounded-xl text-left flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <div className="text-xs font-bold text-indigo-950 truncate">
                Signed in as {currentUser.name}
              </div>
              <div className="text-[11px] text-indigo-700 capitalize">
                Role: {currentUser.role}
              </div>
            </div>
            <Link
              to={getDashboardPathForRole(currentUser.role)}
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-lg whitespace-nowrap shadow-2xs"
            >
              Go to Workspace →
            </Link>
          </div>
        )}
      </div>

      {/* Demo Quick-Login Box */}
      <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
        <div className="text-xs font-bold text-indigo-900 flex items-center justify-between">
          <span>One-Click Test Accounts</span>
          <span className="text-[10px] text-indigo-600 font-normal">Pre-seeded in MongoDB</span>
        </div>
        <div className="grid grid-cols-1 gap-2 text-xs">
          <button
            type="button"
            onClick={() => handleQuickLogin('student', 'user-student-1')}
            className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-indigo-200 text-left cursor-pointer transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <div>
                <div className="font-bold text-slate-900">Rohan Verma (Student)</div>
                <div className="text-[11px] text-slate-500">rohan.verma@college.edu</div>
              </div>
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold">Enter →</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('business', 'user-business-1')}
            className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-teal-200 text-left cursor-pointer transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-teal-600" />
              <div>
                <div className="font-bold text-slate-900">Bangalore TechRetail (Business)</div>
                <div className="text-[11px] text-slate-500">contact@techretail.in</div>
              </div>
            </div>
            <span className="text-[11px] text-teal-700 font-semibold">Enter →</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('admin', 'user-admin-1')}
            className="flex items-center justify-between p-2.5 bg-white hover:bg-slate-50 rounded-xl border border-amber-200 text-left cursor-pointer transition-colors shadow-2xs"
          >
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              <div>
                <div className="font-bold text-slate-900">Platform Admin</div>
                <div className="text-[11px] text-slate-500">admin@internbridge.in</div>
              </div>
            </div>
            <span className="text-[11px] text-amber-700 font-semibold">Enter →</span>
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* Regular Login Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">Sign In As:</label>
          <div className="grid grid-cols-3 gap-2">
            {['student', 'business', 'admin'].map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => {
                  setRole(r);
                  setErrorMessage('');
                }}
                className={`py-2 text-xs font-semibold rounded-lg capitalize border transition-colors cursor-pointer ${
                  role === r
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'student' ? 'e.g. rohan.verma@college.edu' : 'e.g. contact@techretail.in'}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-800">Password</label>
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-[11px] text-indigo-600 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full text-xs pl-9 pr-9 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating with MongoDB...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign In to {role.toUpperCase()} Workspace</span>
            </>
          )}
        </button>

        <div className="text-center text-xs text-slate-500 pt-3 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
            Register here
          </Link>
        </div>
      </form>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <Modal
          isOpen={forgotModalOpen}
          onClose={() => setForgotModalOpen(false)}
          title="Reset Password"
          description="Enter your email to receive a password reset link."
        >
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Your Email</label>
              <input
                type="email"
                required
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setForgotModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer"
              >
                Send Reset Link
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
