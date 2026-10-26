import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Users,
  User,
  Eye,
  Building,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const StudentApplicationsPage = () => {
  const { applications, currentStudent, students, teams, currentUser } = useApp();
  const student = currentStudent || students[0];

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Filter applications for current student (solo or squad member)
  const myApplications = applications.filter((a) => {
    if (a.studentId === student?.id || a.studentId === student?._id || a.studentId === student?.userId) return true;
    if (currentUser && (a.studentId === currentUser.id || a.studentId === currentUser._id)) return true;
    if (a.teamMembers?.some((m) => m.studentId === student?.id || m.studentId === student?._id)) return true;
    if (a.teamId) {
      const matchTeam = teams.find((t) => t.id === a.teamId || t._id === a.teamId);
      if (matchTeam?.members?.some((m) => m.studentId === student?.id || m.studentId === student?._id)) return true;
    }
    return false;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Project Applications</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Track the live review status of your proposals and squad submissions.
        </p>
      </div>

      {myApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Browse active business briefs on the explore page and submit a proposal solo or with your squad.
          </p>
          <Link
            to="/projects"
            className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700"
          >
            Explore Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map(app => {
            const isSelected = app.status === 'Selected';
            const isShortlisted = app.status === 'Shortlisted';
            const isPending = app.status === 'Pending';

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-500">
                      Applied {new Date(app.appliedDate).toLocaleDateString()}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[11px] font-medium text-slate-600 flex items-center gap-1">
                      {app.applicantType === 'team' ? (
                        <>
                          <Users className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Squad: {app.teamName}</span>
                        </>
                      ) : (
                        <>
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>Individual Application</span>
                        </>
                      )}
                    </span>
                  </div>

                  <Link
                    to={`/projects/${app.projectId}`}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                  >
                    {app.projectTitle}
                  </Link>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Business: {app.businessName}</span>
                    <span>·</span>
                    <span>Timeline: {app.estimatedTimeline}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 italic pt-1">
                    "{app.proposalText}"
                  </p>
                </div>

                {/* Status & Action */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        isSelected
                          ? 'bg-emerald-100 text-emerald-800'
                          : isShortlisted
                          ? 'bg-indigo-100 text-indigo-800'
                          : isPending
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>

                  {app.matchScore && (
                    <div className="text-[11px] text-slate-500">
                      Estimated Match: <strong className="text-slate-800 tabular-nums">{app.matchScore}%</strong>
                    </div>
                  )}

                  <button
                    onClick={() => setSelectedApplication(app)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Review Proposal</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Proposal Review Modal */}
      {selectedApplication && (
        <Modal
          isOpen={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          title={`Application Details: ${selectedApplication.projectTitle}`}
          description={`Submitted to ${selectedApplication.businessName} on ${new Date(selectedApplication.appliedDate).toLocaleDateString()}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Application Type:</span>
                <span className="font-bold text-slate-900 capitalize">
                  {selectedApplication.applicantType === 'team'
                    ? `Team Application (${selectedApplication.teamName})`
                    : 'Individual Application'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Review Status:</span>
                <span className="font-bold text-indigo-700">{selectedApplication.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proposed Timeline:</span>
                <span className="font-semibold text-slate-800">{selectedApplication.estimatedTimeline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Declared Availability:</span>
                <span className="font-semibold text-slate-800">{selectedApplication.availability}</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-900 block mb-1">Your Submitted Proposal:</span>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                {selectedApplication.proposalText}
              </div>
            </div>

            {selectedApplication.highlightedPortfolioProject && (
              <div>
                <span className="font-bold text-slate-900 block mb-1">Highlighted Portfolio Project:</span>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700">
                  {selectedApplication.highlightedPortfolioProject}
                </div>
              </div>
            )}

            {selectedApplication.matchReasons && selectedApplication.matchReasons.length > 0 && (
              <div className="space-y-1 pt-1">
                <span className="font-bold text-slate-900 block">Rule-Based Match Factors:</span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  {selectedApplication.matchReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedApplication(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
