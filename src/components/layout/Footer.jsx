import React from 'react';
import { Link } from 'react-router-dom';
import { Layers } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Project Info */}
          <div className="md:col-span-1 space-y-3">
            <Link to="/" className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span>InternBridge</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Student–Business Project Discovery & Team Matching Platform. Empowering college students to solve real-world industry challenges.
            </p>
            <div className="text-[11px] text-slate-400">
              B.Tech Computer Science & Engineering Minor Project.
            </div>
          </div>

          {/* Quick Links: Students */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">For Students</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/projects" className="hover:text-indigo-600 transition-colors">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link to="/student/find-teammates" className="hover:text-indigo-600 transition-colors">
                  Find Teammates
                </Link>
              </li>
              <li>
                <Link to="/student/teams/create" className="hover:text-indigo-600 transition-colors">
                  Create a Team
                </Link>
              </li>
              <li>
                <Link to="/student/portfolio" className="hover:text-indigo-600 transition-colors">
                  Student Portfolio
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links: Businesses */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">For Businesses</h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/business/projects/new" className="hover:text-indigo-600 transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/business/dashboard" className="hover:text-indigo-600 transition-colors">
                  Business Dashboard
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-indigo-600 transition-colors">
                  How Matching Works
                </Link>
              </li>
              <li>
                <Link to="/business/profile" className="hover:text-indigo-600 transition-colors">
                  Company Profiles
                </Link>
              </li>
            </ul>
          </div>

          {/* Project & Platform Ethics */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider">Platform Notice</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              All project metrics and company accounts are illustrative sample data for evaluation. All student skills are self-reported.
            </p>
            <div className="text-[11px] text-slate-400">
              Terms & direct collaboration are agreed directly between businesses and student teams.
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} InternBridge. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="hover:text-slate-900">How It Works</Link>
            <Link to="/projects" className="hover:text-slate-900">All Opportunities</Link>
            <Link to="/admin/dashboard" className="hover:text-slate-900">Demo Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
