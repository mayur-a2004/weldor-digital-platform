import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { WELDOR_BRAND } from '../../config/branding';

export const LoginPage: React.FC = () => {
  const { login, setActiveView } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const targetEmail = (customEmail !== undefined ? customEmail : email).trim();
    const targetPassword = (customPass !== undefined ? customPass : password).trim();

    if (!targetEmail || !targetPassword) {
      setErrorMessage('Please enter both your work email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(targetEmail, targetPassword);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Invalid credentials. Please check your email and password.');
    } else {
      setActiveView('crm-dashboard');
    }
  };

  const handleQuickSuperAdminLogin = () => {
    setEmail('admin@weldorindustries.com');
    setPassword('Weldor@2026');
    handleLoginSubmit(undefined, 'admin@weldorindustries.com', 'Weldor@2026');
  };

  const fillCredentials = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="px-6 py-3.5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 rounded-xl shadow-md inline-flex items-center justify-center">
            <img 
              src={WELDOR_BRAND.logoUrl} 
              alt={WELDOR_BRAND.name} 
              className="h-7 sm:h-8 w-auto object-contain" 
            />
          </div>
          <div className="border-l border-slate-700 pl-3">
            <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
              <span>{WELDOR_BRAND.parentCompany}</span>
              <span className="text-[9px] font-mono bg-orange-950 text-orange-400 border border-orange-500/40 px-2 py-0.5 rounded font-bold">
                PORTAL
              </span>
            </h1>
            <p className="text-[9.5px] font-mono text-slate-400">
              Staff HRMS & Sales CRM Directorate
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveView('public-home')}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 transition-colors border border-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Public Website</span>
        </button>
      </header>

      {/* Main Login Card Stage */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-5">
          
          {/* Card Header with High-Contrast Logo Badge */}
          <div className="text-center space-y-2">
            <div className="mb-2 flex justify-center">
              <div className="bg-white p-3.5 rounded-2xl shadow-xl inline-flex items-center justify-center border border-slate-200">
                <img 
                  src={WELDOR_BRAND.logoUrl} 
                  alt={WELDOR_BRAND.brandName} 
                  className="h-10 sm:h-12 w-auto object-contain" 
                />
              </div>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              Sign In to Workspace
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {WELDOR_BRAND.name} • Internal CRM & HRMS Access
            </p>
          </div>

          {/* 1-Click Super Admin Login Hero Action */}
          <div className="p-3.5 bg-gradient-to-r from-orange-950/80 to-amber-950/70 border border-orange-500/40 rounded-2xl text-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-orange-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-mono">
                <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                <span>Super Admin Access</span>
              </span>
              <span className="text-[10px] font-mono text-amber-300/80 bg-orange-900/50 px-2 py-0.5 rounded border border-orange-700/50">
                Auto-Filled Ready
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickSuperAdminLogin}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs font-mono shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
            >
              <Zap className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
              <span>1-CLICK SIGN IN AS SUPER ADMIN</span>
            </button>
            <p className="text-[10.5px] font-mono text-slate-300 text-center">
              Login: <strong className="text-white">admin@weldorindustries.com</strong> • Pass: <strong className="text-white">Weldor@2026</strong>
            </p>
          </div>

          {/* Error Alert Box */}
          {errorMessage && (
            <div className="p-3.5 bg-rose-950/80 border border-rose-500/50 rounded-2xl text-xs font-mono text-rose-300 flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="admin@weldorindustries.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-slate-300 font-mono text-[11px] uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-slate-400 font-mono">Weldor@2026</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-mono text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 mt-1"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Select Staff Roles */}
          <div className="space-y-1.5 pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              Quick Fill Other Demo Roles:
            </span>
            <div className="grid grid-cols-3 gap-1.5 text-[10.5px] font-mono">
              <button
                type="button"
                onClick={() => fillCredentials('rajesh.sharma@weldorindustries.com', 'Rajesh@123')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-center cursor-pointer transition-colors"
              >
                Production
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('priya.patel@weldorindustries.com', 'Priya@123')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-center cursor-pointer transition-colors"
              >
                Sales Head
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('amit.verma@weldorindustries.com', 'Amit@123')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-center cursor-pointer transition-colors"
              >
                QC & Metallurgy
              </button>
            </div>
          </div>

          {/* Security & Concurrency Notice */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1 text-[11px] text-slate-400">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Single Active Session Policy</span>
            </p>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Logging in generates a cryptographic session token and safely signs out any conflicting sessions on other browsers.
            </p>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs font-mono text-slate-500 border-t border-slate-900 relative z-10">
        <p>© 2026 Weldor Industries Pvt. Ltd. • ISO 9001:2015 Certified Manufacturing</p>
      </footer>

    </div>
  );
};
