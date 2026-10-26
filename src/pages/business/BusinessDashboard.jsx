import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  Briefcase,
  Users,
  PlusCircle,
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';

export const BusinessDashboard = () => {
  const { currentBusiness, businesses, projects, applications, currentUser } = useApp();
  const business = currentBusiness || businesses[0];

  // Projects posted by this business
  const myProjects = projects.filter(
    (p) =>
      p.businessId === business?.id ||
      p.businessId === business?._id ||
      p.businessId === business?.userId ||
      (currentUser && (p.businessUser === currentUser.id || p.businessUser === currentUser._id))
  );
  const myProjectIds = new Set(myProjects.map((p) => p.id || p._id));
  const activeProjects = myProjects.filter((p) => p.status === 'Open' || p.status === 'Under Review');
  const awaitingSelection = myProjects.filter((p) => p.applicantCount > 0 && p.status !== 'Selected' && p.status !== 'Closed');

  // Applications received across all projects of this business
  const myApplications = applications.filter(
    (a) =>
      a.businessId === business?.id ||
      a.businessId === business?._id ||
      myProjectIds.has(a.projectId)
  );

  // Suggested / Top candidates
  const recentApplications = [...myApplications]
    .sort((a, b) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Avatar
            src={business.logo}
            name={business.name}
            size="2xl"
            rounded="rounded-2xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {business.name}
              </h1>
              <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-100">
                Business Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {business.businessType} · {business.location} · Contact: {business.contactPerson}
            </p>
          </div>
        </div>

        <Link
          to="/business/projects/new"
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Active Briefs</div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{activeProjects.length}</div>
          <div className="text-[11px] text-slate-400">Open for applications</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Applicants</div>
          <div className="text-2xl font-black text-slate-900 tabular-nums">{myApplications.length}</div>
          <div className="text-[11px] text-slate-400">Individuals & Squads</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Awaiting Selection</div>
          <div className="text-2xl font-black text-amber-700 tabular-nums">{awaitingSelection.length}</div>
          <div className="text-[11px] text-slate-400">Review ready</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
          <div className="text-xs text-slate-500 font-medium">Completed / Selected</div>
          <div className="text-2xl font-black text-emerald-700 tabular-nums">
            {myProjects.filter(p => p.status === 'Selected').length}
          </div>
          <div className="text-[11px] text-slate-400">Assigned teams</div>
        </div>
      </div>

      {/* 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left (2 cols): My Posted Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Posted Projects</h2>
              <p className="text-xs text-slate-500">Manage applicants and monitor submission timelines</p>
            </div>
            <Link
              to="/business/projects"
              className="text-xs font-semibold text-teal-700 hover:text-teal-900"
            >
              View All ({myProjects.length})
            </Link>
          </div>

          {myProjects.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-600">You haven't posted any projects yet.</p>
              <Link
                to="/business/projects/new"
                className="inline-block px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold"
              >
                Create Your First Project Brief
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myProjects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-teal-800">{proj.category}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] text-slate-500">{proj.durationWeeks} weeks</span>
                    </div>

                    <Link
                      to={`/business/projects/${proj.id}/applicants`}
                      className="text-sm font-bold text-slate-900 hover:text-teal-700 transition-colors block"
                    >
                      {proj.title}
                    </Link>

                    <div className="text-xs text-slate-500">
                      Budget: <strong className="text-slate-800 tabular-nums">{formatINR(proj.budgetAmount)}</strong> · Deadline: {proj.applicationDeadline}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      to={`/business/projects/${proj.id}/applicants`}
                      className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Review Applicants ({proj.applicantCount})</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right (1 col): Recently Received Applicants */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Recent Applicants</h2>
            <span className="text-xs text-slate-500">{myApplications.length} total</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            {recentApplications.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                No applications received yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs space-y-3 pt-1">
                {recentApplications.map(app => (
                  <div key={app.id} className="pt-3 first:pt-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-slate-900 truncate">
                        {app.applicantType === 'team' ? `${app.teamName} (Squad)` : app.studentName}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded tabular-nums">
                        {app.matchScore || 85}% Match
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-1">
                      For: {app.projectTitle}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">
                        {new Date(app.appliedDate).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/business/projects/${app.projectId}/applicants`}
                        className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
                      >
                        Evaluate →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
