import React, { useState } from 'react';
import { Building2, Layers, ShieldCheck, Lock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface AdminSignInPageProps {
  onSignInSuccess: (adminRole: 'clinic-admin' | 'org-admin') => void;
  onNavigatePublicHome?: () => void;
}

export const AdminSignInPage: React.FC<AdminSignInPageProps> = ({
  onSignInSuccess,
  onNavigatePublicHome,
}) => {
  const [adminScope, setAdminScope] = useState<'clinic-admin' | 'org-admin'>('clinic-admin');
  const [adminEmail, setAdminEmail] = useState('admin.padmanabhanagar@saivibronics.org');
  const [password, setPassword] = useState('seva1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScopeChange = (scope: 'clinic-admin' | 'org-admin') => {
    setAdminScope(scope);
    if (scope === 'clinic-admin') {
      setAdminEmail('admin.padmanabhanagar@saivibronics.org');
    } else {
      setAdminEmail('state.coordinator@saivibronics.org');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !password.trim()) {
      setError('Please provide administrator credentials.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      onSignInSuccess(adminScope);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Portal Identifier */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-700 text-white shadow-xl mx-auto">
            <Building2 className="w-8 h-8 text-indigo-100" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Administration Portal
          </h2>
          <p className="text-xs text-indigo-300 font-medium">
            Sri Sathya Sai Organisation · Multi-Clinic Administration
          </p>
        </div>

        {/* Admin Sign In Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Conceptual Role Scope Switcher for Prototype Evaluation */}
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Administrative Authority Scope
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 border border-slate-800 rounded-xl">
              <button
                type="button"
                onClick={() => handleScopeChange('clinic-admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  adminScope === 'clinic-admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Clinic Desk</span>
              </button>
              <button
                type="button"
                onClick={() => handleScopeChange('org-admin')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  adminScope === 'org-admin'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Organisation</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              {adminScope === 'clinic-admin'
                ? 'Scoped to Padmanabhanagar Pilot center: reception, token queue, and schedules.'
                : 'State Coordinator authority: multi-clinic governance, practitioner onboarding, and network metrics.'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Administrator Email / System ID
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="admin@saivibronics.org"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm font-medium transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In as {adminScope === 'clinic-admin' ? 'Clinic Administrator' : 'State Coordinator'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Prototype Security Architecture Notice */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed text-center space-y-1">
            <div className="font-semibold text-amber-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Architectural Prototype Status</span>
            </div>
            <p>
              In production, this portal will be deployed to a dedicated administrative subdomain (e.g. <code>admin.saivibronics.org</code>) protected by server-side RBAC and hardware token MFA.
            </p>
          </div>
        </div>

        {/* Back link to public homepage */}
        {onNavigatePublicHome && (
          <div className="text-center mt-6">
            <button
              onClick={onNavigatePublicHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-indigo-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Website</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
