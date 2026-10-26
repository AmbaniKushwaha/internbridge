import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard = () => {
  const { students, businesses, projects, teams, applications, resetDemoData, updateProjectStatus, addToast } = useApp();
  const [activeTab, setActiveTab] = useState('projects');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleReset = () => {
    resetDemoData();
    setShowConfirmReset(false);
    addToast('Demo Data Reset', 'Platform sample dataset has been restored to default seed.', 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Platform Demonstration Console</h1>
            <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Admin Mode
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Overview of current simulated records across students, businesses, and submitted applications.
          </p>
        </div>

        {showConfirmReset ? (
          <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 p-1.5 rounded-xl text-xs">
            <span className="text-rose-800 font-semibold pl-2">Reset all sample records?</span>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold"
            >
              Confirm
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-2 py-1 text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Sample Dataset</span>
          </button>
        )}
      </div>

      {/* Illustrative Demo Notice */}
      <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Illustrative Demonstration Notice:</strong>
          <span className="ml-1 text-amber-800">
            All user profiles, colleges, business entities, and financial metrics in this prototype are sample mock records designed to test the full B.Tech Minor Project end-to-end user journeys.
          </span>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Students</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{students.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Businesses</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{businesses.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Projects</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{projects.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Teams / Squads</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{teams.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Applications</div>
          <div className="text-xl font-bold text-slate-900 tabular-nums">{applications.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">Selected Finalists</div>
          <div className="text-xl font-bold text-emerald-700 tabular-nums">
            {applications.filter(a => a.status === 'Selected').length}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'projects'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'students'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('businesses')}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'businesses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Registered Businesses ({businesses.length})
          </button>
        </div>

        {/* Tab 1: Projects Table */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Title & Business</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Budget</th>
                    <th className="p-3.5">Applicants</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-medium text-slate-900">
                        <Link to={`/projects/${p.id}`} className="hover:text-indigo-600 block font-bold">
                          {p.title}
                        </Link>
                        <span className="text-[11px] text-slate-500">{p.businessName}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{p.category}</td>
                      <td className="p-3.5 tabular-nums font-semibold text-slate-800">{formatINR(p.budgetAmount)}</td>
                      <td className="p-3.5 tabular-nums">{p.applicantCount} applicants</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          p.status === 'Open' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => updateProjectStatus(p.id, p.status === 'Closed' ? 'Open' : 'Closed')}
                          className="text-xs text-indigo-600 hover:underline cursor-pointer"
                        >
                          {p.status === 'Closed' ? 'Re-open' : 'Close'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Students Table */}
        {activeTab === 'students' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Student</th>
                    <th className="p-3.5">College & Degree</th>
                    <th className="p-3.5">Self-Reported Skills</th>
                    <th className="p-3.5">Availability</th>
                    <th className="p-3.5 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <img src={s.avatar} alt={s.name} className="w-7 h-7 rounded-full object-cover" />
                        <span>{s.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">
                        <div>{s.college}</div>
                        <div className="text-[11px] text-slate-400">{s.course} ({s.graduationYear})</div>
                      </td>
                      <td className="p-3.5 text-slate-600 line-clamp-1">
                        {s.selfReportedSkills.slice(0, 4).join(', ')}
                      </td>
                      <td className="p-3.5 text-slate-600">{s.availability}</td>
                      <td className="p-3.5 text-right">
                        <Link to={`/students/${s.id}`} className="text-indigo-600 hover:underline font-semibold">
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Businesses Table */}
        {activeTab === 'businesses' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Business Name</th>
                    <th className="p-3.5">Sector</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Contact Person</th>
                    <th className="p-3.5">Posted Projects</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {businesses.map(b => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                        <img src={b.logo} alt={b.name} className="w-7 h-7 rounded-lg object-cover" />
                        <span>{b.name}</span>
                      </td>
                      <td className="p-3.5 text-slate-600">{b.businessType}</td>
                      <td className="p-3.5 text-slate-600">{b.location}</td>
                      <td className="p-3.5 text-slate-600">
                        <div>{b.contactPerson}</div>
                        <div className="text-[11px] text-slate-400">{b.contactEmail}</div>
                      </td>
                      <td className="p-3.5 tabular-nums font-semibold text-slate-800">
                        {projects.filter(p => p.businessId === b.id || p.businessId === b._id || p.businessUser === b.userId).length} briefs
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
