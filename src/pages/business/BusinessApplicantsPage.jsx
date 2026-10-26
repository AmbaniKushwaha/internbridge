import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/ui/Avatar';

export const BusinessApplicantsPage = () => {
  const { projectId } = useParams();
  const {
    projects,
    applications,
    updateApplicationStatus,
    savedApplicantIds,
    toggleSaveApplicant,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [confirmSelectModalApp, setConfirmSelectModalApp] = useState(null);

  const project = projects.find((p) => p.id === projectId || p._id === projectId);

  // Filter applications for this project
  const projectApplications = useMemo(() => {
    return applications
      .filter((a) => {
        const matchesProject =
          a.projectId === projectId ||
          (project && (a.projectId === project.id || a.projectId === project._id));
        if (!matchesProject) return false;
        if (statusFilter !== 'All' && a.status !== statusFilter) return false;
        if (typeFilter !== 'All' && a.applicantType !== typeFilter) return false;
        return true;
      })
      .sort((a, b) => (b.matchScore || 80) - (a.matchScore || 80));
  }, [applications, projectId, project, statusFilter, typeFilter]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
        <Link
          to="/business/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-700 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Projects</span>
        </Link>
      </div>
    );
  }

  const handleConfirmSelect = () => {
    if (confirmSelectModalApp) {
      updateApplicationStatus(confirmSelectModalApp.id, 'Selected');
      setConfirmSelectModalApp(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Back button & Header */}
      <div className="space-y-4">
        <div>
          <Link
            to="/business/projects"
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to My Projects</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                {project.category}
              </span>
              <span className="text-xs text-slate-500">Project Status: <strong>{project.status}</strong></span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Applicants for "{project.title}"
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review individual students and assembled squads. Match scores are calculated transparently using client-side rules.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg shrink-0">
            {projectApplications.length} candidate(s)
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-600 mr-1">Status:</span>
          {['All', 'Pending', 'Shortlisted', 'Selected', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600 mr-1">Applicant Type:</span>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="p-1.5 text-xs rounded-lg border border-slate-200 bg-white font-medium text-slate-800"
          >
            <option value="All">All Types (Solo & Squads)</option>
            <option value="individual">Individual Students Only</option>
            <option value="team">Student Squads Only</option>
          </select>
        </div>
      </div>

      {/* Applicants List */}
      {projectApplications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No applicants found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {statusFilter !== 'All'
              ? `There are no applicants marked as "${statusFilter}". Try selecting "All".`
              : 'Students haven\'t applied to this brief yet. Active projects will receive proposals shortly.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {projectApplications.map(app => {
            const isSaved = savedApplicantIds.includes(app.id);
            const isSquad = app.applicantType === 'team';
            const isSelected = app.status === 'Selected';
            const isShortlisted = app.status === 'Shortlisted';
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app.id}
                className={`bg-white rounded-2xl border p-6 shadow-xs space-y-5 transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : isShortlisted
                    ? 'border-indigo-400 bg-indigo-50/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header: Name, Match Score, Save */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar
                      src={app.applicantType === 'team' ? app.teamAvatar : app.studentAvatar}
                      name={app.applicantType === 'team' ? app.teamName : app.studentName}
                      size="xl"
                      rounded={isSquad ? 'rounded-2xl' : 'rounded-full'}
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base font-bold text-slate-900">
                          {isSquad ? app.teamName : app.studentName}
                        </h3>
                        <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {isSquad ? 'Assembled Squad' : 'Individual Student'}
                        </span>
                        {isSelected && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Selected Finalist
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-500 mt-0.5">
                        Applied {new Date(app.appliedDate).toLocaleDateString()} · Timeline: {app.estimatedTimeline} · Availability: {app.availability}
                      </div>
                    </div>
                  </div>

                  {/* Match Score Badge & Bookmark */}
                  <div className="flex items-center gap-3 self-end sm:self-start">
                    <div className="text-right">
                      <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="tabular-nums">{app.matchScore || 85}% Rule Match</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Deterministic score</div>
                    </div>

                    <button
                      onClick={() => toggleSaveApplicant(app.id)}
                      title={isSaved ? 'Remove from saved' : 'Save candidate'}
                      className="p-2 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      {isSaved ? <BookmarkCheck className="w-4 h-4 text-teal-700" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Team Members Breakdown if Squad */}
                {isSquad && app.teamMembers && app.teamMembers.length > 0 && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="text-xs font-bold text-slate-900">Squad Composition ({app.teamMembers.length} Members):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {app.teamMembers.map(m => (
                        <div key={m.studentId} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                          <Avatar src={m.avatar} name={m.name} size="xs" rounded="rounded-full" />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{m.name}</div>
                            <div className="text-[11px] text-slate-500 truncate">{m.role}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Proposal Text */}
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-900 block">Submitted Proposal:</span>
                  <p className="text-xs text-slate-700 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
                    "{app.proposalText}"
                  </p>
                </div>

                {/* Relevant Skills & Portfolio Highlight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-slate-100 pt-3">
                  <div>
                    <span className="font-semibold text-slate-800">Relevant Skills: </span>
                    <span className="text-slate-600">{app.relevantSkills.join(' · ')}</span>
                  </div>

                  {app.highlightedPortfolioProject && (
                    <div>
                      <span className="font-semibold text-slate-800">Highlighted Portfolio Work: </span>
                      <span className="text-teal-700 font-medium">{app.highlightedPortfolioProject}</span>
                    </div>
                  )}
                </div>

                {/* Why This Applicant Matches (Transparent rule explanation) */}
                {app.matchReasons && app.matchReasons.length > 0 && (
                  <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-100 space-y-1 text-xs">
                    <span className="font-bold text-teal-950 block">Why this applicant matches:</span>
                    <ul className="space-y-0.5 text-teal-800 text-[11px]">
                      {app.matchReasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Decision Actions Bar */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    {isSquad ? (
                      <Link
                        to={`/teams/${app.teamId}`}
                        className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <span>View Squad Profile</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    ) : (
                      <Link
                        to={`/students/${app.studentId}`}
                        className="font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <span>View Student Portfolio</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>

                  {/* Status Actions */}
                  <div className="flex items-center gap-2">
                    {/* Shortlist button */}
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Shortlisted')}
                      disabled={isShortlisted || isSelected}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        isShortlisted
                          ? 'bg-indigo-100 text-indigo-700 cursor-default'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700'
                      }`}
                    >
                      {isShortlisted ? 'Shortlisted' : 'Shortlist'}
                    </button>

                    {/* Reject button */}
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'Rejected')}
                      disabled={isRejected || isSelected}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                        isRejected
                          ? 'bg-rose-100 text-rose-700 cursor-default'
                          : 'bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700'
                      }`}
                    >
                      {isRejected ? 'Rejected' : 'Decline'}
                    </button>

                    {/* Select Finalist button */}
                    <button
                      onClick={() => setConfirmSelectModalApp(app)}
                      disabled={isSelected}
                      className={`px-4 py-1.5 rounded-lg font-bold shadow-xs transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-600 text-white cursor-default'
                          : 'bg-teal-700 hover:bg-teal-800 text-white'
                      }`}
                    >
                      {isSelected ? 'Selected Finalist' : 'Select Applicant'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal to Select Applicant */}
      {confirmSelectModalApp && (
        <Modal
          isOpen={!!confirmSelectModalApp}
          onClose={() => setConfirmSelectModalApp(null)}
          title="Confirm Applicant Selection"
          description={`Project: "${project.title}"`}
        >
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              Are you sure you want to select <strong>{confirmSelectModalApp.applicantType === 'team' ? confirmSelectModalApp.teamName : confirmSelectModalApp.studentName}</strong> for this project?
            </p>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1 text-emerald-900">
              <div className="font-bold">What happens next:</div>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800">
                <li>Application status updates to <strong>Selected</strong>.</li>
                <li>Project status transitions to <strong>Selected</strong>.</li>
                <li>The candidate will receive an immediate notification to begin milestone collaboration.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setConfirmSelectModalApp(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSelect}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs cursor-pointer"
              >
                Confirm & Select Candidate
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
