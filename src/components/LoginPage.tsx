import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  QrCode,
  KeyRound,
  FileText,
  HeartPulse,
  X,
  Phone,
} from 'lucide-react';
import { AuthUser, LanguageCode } from '../types/health';
import { t } from '../utils/translations';

interface LoginPageProps {
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  currentLang: LanguageCode;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang,
}) => {
  const [authMode, setAuthMode] = useState<'abha' | 'email' | 'register'>('abha');
  const [identifier, setIdentifier] = useState('rahul.verma@abdm');
  const [emailInput, setEmailInput] = useState('rahul.verma@example.com');
  const [password, setPassword] = useState('Password@123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState<'input' | 'otp' | 'success'>('input');
  const [otpVal, setOtpVal] = useState('');

  // Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regGender, setRegGender] = useState('Male');
  const [regYob, setRegYob] = useState('1990');
  const [regBlood, setRegBlood] = useState('B+ Positive');

  if (!isOpen) return null;

  const handle1ClickDemo = (type: 'abha' | 'email') => {
    if (type === 'abha') {
      setAuthMode('abha');
      setIdentifier('rahul.verma@abdm');
      setPassword('Password@123');
    } else {
      setAuthMode('email');
      setEmailInput('rahul.verma@example.com');
      setPassword('Password@123');
    }
    setErrorMsg(null);
  };

  const handleSubmitLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const loginId = authMode === 'abha' ? identifier.trim() : emailInput.trim();
    if (!loginId) {
      setErrorMsg('Please enter your ABHA Address or Email ID.');
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your login password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    // Simulated secure credential verification
    setTimeout(() => {
      setIsLoading(false);
      const isAbha = authMode === 'abha';

      const userObj: AuthUser = {
        id: 'usr-rahul-01',
        name: 'Rahul Verma',
        email: isAbha ? 'rahul.verma@example.com' : loginId,
        abhaAddress: isAbha ? loginId : 'rahul.verma@abdm',
        abhaNumber: '91-4521-8720-3341',
        gender: 'Male',
        yearOfBirth: '1982',
        bloodGroup: 'B+ Positive',
        isVerified: true,
      };

      onLoginSuccess(userObj);
      if (onClose) onClose();
    }, 600);
  };

  const handleRegisterNewAbha = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regPassword) {
      setErrorMsg('Please fill in all mandatory fields.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const randomId = Math.floor(1000 + Math.random() * 9000);
      const generatedAbha = `${regName.toLowerCase().replace(/\s+/g, '.')}${randomId}@abdm`;
      const generatedNumber = `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${randomId}`;

      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: regName,
        email: regEmail || `${regName.toLowerCase().replace(/\s+/g, '')}@example.com`,
        abhaAddress: generatedAbha,
        abhaNumber: generatedNumber,
        gender: regGender,
        yearOfBirth: regYob,
        bloodGroup: regBlood,
        isVerified: true,
      };

      onLoginSuccess(newUser);
      if (onClose) onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-teal-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-linear-to-r from-teal-800 via-cyan-900 to-slate-900 text-white p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full bg-teal-400/10 blur-2xl pointer-events-none" />

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <HeartPulse className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold tracking-tight">Patient Portal Sign In</h2>
                  <span className="text-[10px] font-bold bg-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40">
                    ABDM M1 / M2 Ready
                  </span>
                </div>
                <p className="text-xs text-cyan-200 mt-0.5">
                  Ayushman Bharat Health Account (ABHA) & ArogyaCopilot
                </p>
              </div>
            </div>

            {onClose && (
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-5">
          {/* 1-Click Demo Fast Credentials Banner */}
          <div className="p-3.5 bg-linear-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="text-xs text-teal-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span className="font-bold">Fast Evaluation Demo:</span>
              <span className="text-slate-600 hidden sm:inline">Pre-fill verified test patient</span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => handle1ClickDemo('abha')}
                className="bg-teal-600 hover:bg-teal-700 active:scale-95 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
              >
                ABHA Demo
              </button>
              <button
                type="button"
                onClick={() => handle1ClickDemo('email')}
                className="bg-white hover:bg-slate-50 border border-teal-300 text-teal-900 text-[11px] font-bold px-2.5 py-1 rounded-lg cursor-pointer"
              >
                Email Demo
              </button>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => {
                setAuthMode('abha');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'abha'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In with ABHA ID
            </button>
            <button
              onClick={() => {
                setAuthMode('email');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'email'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In with Email
            </button>
            <button
              onClick={() => {
                setAuthMode('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                authMode === 'register'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create ABHA ID
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form (ABHA or Email) */}
          {(authMode === 'abha' || authMode === 'email') && (
            <form onSubmit={handleSubmitLogin} className="space-y-4 text-xs">
              {/* Identifier Input (ABHA Address or Email) */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {authMode === 'abha'
                    ? 'ABHA Address (PHR) or 14-Digit ABHA Number'
                    : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    {authMode === 'abha' ? (
                      <ShieldCheck className="w-4 h-4 text-teal-600" />
                    ) : (
                      <Mail className="w-4 h-4 text-teal-600" />
                    )}
                  </div>
                  <input
                    type={authMode === 'abha' ? 'text' : 'email'}
                    placeholder={
                      authMode === 'abha'
                        ? 'e.g. rahul.verma@abdm or 91-4521-8720-3341'
                        : 'e.g. rahul.verma@example.com'
                    }
                    value={authMode === 'abha' ? identifier : emailInput}
                    onChange={(e) =>
                      authMode === 'abha'
                        ? setIdentifier(e.target.value)
                        : setEmailInput(e.target.value)
                    }
                    className="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium"
                    required
                  />
                </div>
                {authMode === 'abha' && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your official Ayushman Bharat Health Account handle
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-bold text-slate-700">Account Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setForgotStep('input');
                    }}
                    className="text-[11px] text-teal-700 hover:underline font-semibold cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4 text-teal-600" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your confidential password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-teal-500 font-medium tracking-wide"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me and Security Badge */}
              <div className="flex items-center justify-between text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span>Remember my login on this device</span>
                </label>
                <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  256-Bit TLS Secured
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 active:scale-98 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Authenticating with ABDM Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Health Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Registration Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterNewAbha} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Full Legal Name (as per Aadhaar)</label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="e.g. 98765 43210"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Email ID (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. priya@example.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={regGender}
                    onChange={(e) => setRegGender(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Year of Birth</label>
                  <input
                    type="number"
                    min="1920"
                    max="2026"
                    value={regYob}
                    onChange={(e) => setRegYob(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-bold text-center"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50"
                  >
                    <option value="B+ Positive">B+</option>
                    <option value="O+ Positive">O+</option>
                    <option value="A+ Positive">A+</option>
                    <option value="AB+ Positive">AB+</option>
                    <option value="O- Negative">O-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Create Account Password</label>
                <input
                  type="password"
                  placeholder="Min 6 characters with letters and numbers"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white font-extrabold rounded-xl shadow-md transition-all cursor-pointer text-xs"
              >
                {isLoading ? 'Creating Verified ABHA Profile...' : 'Generate New ABHA Health Account'}
              </button>
            </form>
          )}

          {/* Forgot Password Modal / Step */}
          {showForgotPassword && (
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-2xl space-y-3 text-xs animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <KeyRound className="w-4 h-4 text-teal-600" />
                  Forgot Password Recovery (ABDM OTP)
                </span>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {forgotStep === 'input' && (
                <div className="space-y-2">
                  <p className="text-slate-600">
                    Enter your registered mobile or ABHA address to receive a 6-digit Aadhaar OTP:
                  </p>
                  <input
                    type="text"
                    defaultValue="+91 98765 43210"
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setForgotStep('otp')}
                    className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg"
                  >
                    Send One-Time Password (OTP)
                  </button>
                </div>
              )}

              {forgotStep === 'otp' && (
                <div className="space-y-2">
                  <p className="text-emerald-700 font-semibold">
                    OTP sent to +91 ******3210. (Demo OTP: 452187)
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otpVal}
                    onChange={(e) => setOtpVal(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-300 bg-white text-center font-mono tracking-widest text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('success');
                      setPassword('Password@123');
                    }}
                    className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg"
                  >
                    Verify & Reset Password
                  </button>
                </div>
              )}

              {forgotStep === 'success' && (
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-xl space-y-1">
                  <p className="font-bold">Password reset successful!</p>
                  <p>Your password has been restored to: Password@123</p>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-xs font-bold underline"
                  >
                    Return to Login
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>National Health Authority (NHA) Standards</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Secure Token ID: ABDM-AUTH-992
          </span>
        </div>
      </div>
    </div>
  );
};
