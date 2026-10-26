import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  Briefcase,
  Users,
  PlusCircle,
} from 'lucide-react';

export const BusinessProjectsPage = () => {
  const { currentBusiness, businesses, projects, updateProjectStatus, currentUser } = useApp();
  const business = currentBusiness || businesses[0];

  const myProjects = projects.filter(
    (p) =>
      p.businessId === business?.id ||
      p.businessId === business?._id ||
      p.businessId === business?.userId ||
      (currentUser && (p.businessUser === currentUser.id || p.businessUser === currentUser._id))
  );

  const handleToggleStatus = (projectId, currentStatus) => {
    const nextStatus = currentStatus === 'Closed' ? 'Open' : 'Closed';
    updateProjectStatus(projectId, nextStatus);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Posted Projects</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your project briefs, track candidate applications, and select finalists.
          </p>
        </div>

        <Link
          to="/business/projects/new"
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Project</span>
        </Link>
      </div>

      {myProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No project briefs created yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Use our guided wizard to describe what you need in plain words.
          </p>
          <Link
            to="/business/projects/new"
            className="inline-block px-4 py-2 bg-teal-700 text-white rounded-xl text-xs font-semibold hover:bg-teal-800"
          >
            Create First Brief
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myProjects.map(project => {
            const isSelected = project.status === 'Selected';
            const isClosed = project.status === 'Closed';

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {project.category}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Posted {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">
                      Deadline: {project.applicationDeadline}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${project.id}`}
                    className="text-base font-bold text-slate-900 hover:text-teal-700 transition-colors block"
                  >
                    {project.title}
                  </Link>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      Budget: <strong className="text-slate-900 tabular-nums">{formatINR(project.budgetAmount)}</strong>
                    </span>
                    <span>·</span>
                    <span>Duration: <strong>{project.durationWeeks} weeks</strong></span>
                    <span>·</span>
                    <span>Mode: <strong>{project.arrangement}</strong></span>
                  </div>
                </div>

                {/* Right Side: Status & Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isSelected
                        ? 'bg-emerald-100 text-emerald-800'
                        : isClosed
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {project.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/business/projects/${project.id}/applicants`}
                      className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Review Applicants ({project.applicantCount})</span>
                    </Link>

                    <button
                      onClick={() => handleToggleStatus(project.id, project.status)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      {project.status === 'Closed' ? 'Re-open' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
