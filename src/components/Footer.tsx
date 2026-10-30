import React from 'react';
import { PageId } from '../types';
import { HeartHandshake, Shield, MapPin, Mail, Phone, Users, ExternalLink } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center">
                <HeartHandshake className="w-5 h-5 text-teal-100" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight block">
                  Saivibronics
                </span>
                <span className="text-[11px] text-teal-400 font-medium uppercase tracking-wider block">
                  Sri Sathya Sai Organisation
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              &ldquo;Love All, Serve All · Help Ever, Hurt Never&rdquo; — A community healthcare seva initiative bringing holistic Vibronics care and compassionate patient management to Padmanabhanagar, Bengaluru.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="footer" />
            </div>
          </div>

          {/* Pilot Project Context */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Academic Pilot Context
            </h4>
            <div className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Pilot Focus:</strong> Padmanabhanagar, Bengaluru, Karnataka 560070 (Expandable to multi-clinic network).
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Student Team:</strong> Developed by four Computer Science & Engineering (CSE) students as a healthcare technology pilot.
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Shortcuts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home & Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('find-clinic')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Find a Clinic (Bengaluru)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Patient Registration Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('signin')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sign-In Portal
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Patient Dashboard Preview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('practitioner-dashboard')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Practitioner Dashboard Preview
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Support Placeholder */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Contact & Seva Helpline
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+91 80 2669 4410 (Demonstration Only)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>seva.padmanabhanagar@saivibronics-demo.org</span>
              </div>
              <div className="pt-2 text-[11px] text-slate-500">
                Operating Days: Tuesday – Sunday, 9:00 AM – 1:00 PM & 4:30 PM – 7:30 PM IST.
              </div>
            </div>
          </div>
        </div>

        {/* Prototype Disclaimer Box */}
        <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 mb-8 text-xs text-slate-300">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-white">
                Demonstration Prototype Disclaimer
              </p>
              <p className="text-slate-400 leading-relaxed">
                This website is a frontend design prototype built for academic demonstration purposes by a student engineering team. It does not provide real clinical authentication, live database persistence, or automated medical diagnostic advice. All clinic names, practitioner hours, patient identifiers, and treatment notes shown are realistic fictional demonstration data. No real personal health information is captured or transmitted.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 Sri Sathya Sai Organisation · Saivibronics Patient Management Platform (Student Prototype).
          </div>
          <div className="flex items-center gap-4 text-[11px]">
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
