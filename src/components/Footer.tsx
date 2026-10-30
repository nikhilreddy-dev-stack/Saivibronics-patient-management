import React from 'react';
import { PageId } from '../types';
import { HeartHandshake, Shield, MapPin, Mail, Phone, Users } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <HeartHandshake className="w-6 h-6 text-teal-100" />
              </div>
              <div>
                <span className="text-xl font-extrabold text-white tracking-tight block">
                  Saivibronics
                </span>
                <span className="text-xs text-teal-400 font-bold uppercase tracking-wider block">
                  Sri Sathya Sai Organisation
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              &ldquo;Love All, Serve All · Help Ever, Hurt Never&rdquo; — A community healthcare seva initiative bringing holistic Vibronics care and compassionate patient management to Padmanabhanagar, Bengaluru.
            </p>
            <div className="pt-2">
              <PWAInstallButton variant="footer" />
            </div>
          </div>

          {/* Pilot Project Context */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic Pilot Context
            </h4>
            <div className="space-y-3 text-sm text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Pilot Focus:</strong> Padmanabhanagar, Bengaluru, Karnataka 560070 (Expandable to multi-clinic network).
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Users className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Student Team:</strong> Developed by four Computer Science & Engineering (CSE) students as a healthcare technology pilot.
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Shortcuts with accessible touch targets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-clinic')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Find a Clinic (Bengaluru)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Patient Registration Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signin')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Sign-In Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-dashboard')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Patient Dashboard (Senior Grid)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practitioner-dashboard')}
                  className="hover:text-white text-slate-300 py-1 transition-colors cursor-pointer min-h-[36px] flex items-center"
                >
                  Practitioner Clinical Console
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Placeholder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Seva Helpline
            </h4>
            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <span className="text-white font-bold">+91 80 2669 4410 (Demo)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>seva.padmanabhanagar@saivibronics-demo.org</span>
              </div>
              <div className="pt-2 text-xs text-slate-500">
                Operating Days: Tuesday – Sunday, 9:00 AM – 1:00 PM & 4:30 PM – 7:30 PM IST.
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer Box */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 mb-8 text-xs sm:text-sm text-slate-300">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-white text-sm">
                Demonstration Prototype Disclaimer
              </p>
              <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
                This website is a frontend design prototype built for academic demonstration purposes by a student engineering team. It does not provide real clinical authentication, live database persistence, or automated medical diagnostic advice. All clinic names, practitioner hours, patient identifiers, and treatment notes shown are realistic fictional demonstration data. No real personal health information is captured or transmitted.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <div>
            © 2026 Sri Sathya Sai Organisation · Saivibronics Patient Management Platform (Student Prototype).
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span>Padmanabhanagar Pilot</span>
            <span>·</span>
            <span>Bengaluru, Karnataka, India</span>
            <span>·</span>
            <span>PWA Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
