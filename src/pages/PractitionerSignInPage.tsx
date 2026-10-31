import React, { useState } from 'react';
import { Stethoscope, ShieldCheck, Lock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface PractitionerSignInPageProps {
  onSignInSuccess: () => void;
  onNavigatePublicHome?: () => void;
}

export const PractitionerSignInPage: React.FC<PractitionerSignInPageProps> = ({
  onSignInSuccess,
  onNavigatePublicHome,
}) => {
  const [practitionerId, setPractitionerId] = useState('dr.ramesh@saivibronics-seva.org');
  const [password, setPassword] = useState('seva1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!practitionerId.trim() || !password.trim()) {
      setError('Please provide your practitioner registration email or ID and security passcode.');
      return;
    }

    setLoading(true);
    setError(null);

    // Demonstration authentication delay
    setTimeout(() => {
      setLoading(false);
      onSignInSuccess();
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        {/* Portal Identifier */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-600 text-white shadow-lg mx-auto">
            <Stethoscope className="w-8 h-8 text-teal-100" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white font-['Plus_Jakarta_Sans',sans-serif]">
            Practitioner Clinical Portal
          </h2>
          <p className="text-xs text-teal-300 font-medium">
            Sri Sathya Sai Organisation · Vibronics Clinical Seva
          </p>
        </div>

        {/* Clinical Sign In Card */}
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-teal-950/60 border border-teal-800 text-teal-200 text-xs mb-6">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Authorized practitioner workspace for patient consultations and Vibronics remedy prescriptions.</span>
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
                Practitioner Email / Council ID
              </label>
              <input
                type="text"
                value={practitionerId}
                onChange={(e) => setPractitionerId(e.target.value)}
                placeholder="dr.name@saivibronics-seva.org"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm font-medium transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Clinical Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm font-medium transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Access Clinical Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Academic Prototype Notice */}
          <div className="mt-6 pt-5 border-t border-slate-700/60 text-[11px] text-slate-400 leading-relaxed text-center">
            <span className="font-semibold text-slate-300">Prototype Demonstration:</span> Pre-loaded with Dr. K. S. Ramesh, BAMS, MD (Ayu) for Padmanabhanagar Pilot. Production access requires backend session token verification.
          </div>
        </div>

        {/* Back link to public homepage if requested */}
        {onNavigatePublicHome && (
          <div className="text-center mt-6">
            <button
              onClick={onNavigatePublicHome}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-teal-300 transition-colors cursor-pointer"
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
