import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  ArrowLeft,
  Building,
  MapPin,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  Clock,
  Briefcase,
  Users,
} from 'lucide-react';
import { ApplicationModal } from '../../components/project/ApplicationModal';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const ProjectDetailPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    businesses,
    savedProjectIds,
    toggleSaveProject,
    applications,
    currentUser,
    currentStudent,
    addToast,
  } = useApp();

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const project = projects.find((p) => p.id === projectId || p._id === projectId);
  const business = project
    ? businesses.find(
        (b) =>
          b.id === project.businessId ||
          b._id === project.businessId ||
          b.userId === project.businessUser
      )
    : null;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-xs text-slate-500">
          The project listing you requested does not exist or has ended.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Explore Projects</span>
        </Link>
      </div>
    );
  }

  const isSaved = savedProjectIds.includes(project.id);
  const userApplication = applications.find(
    (a) =>
      a.projectId === project.id &&
      (a.studentId === currentStudent?.id ||
        a.teamMembers?.some((m) => m.studentId === currentStudent?.id))
  );

  const handleOpenApply = () => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in as a student to apply to this project.', 'info');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student') {
      addToast('Role Restriction', 'Only students can apply to project briefs.', 'warning');
      return;
    }
    setIsApplyModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumb / Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to="/projects"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Projects</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveProject(project.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-2xs"
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-indigo-600" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details Left, Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Optional Project Hero Banner */}
            {project.imageUrl && (
              <div className="h-56 sm:h-64 w-full overflow-hidden relative bg-slate-900">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1 rounded-md text-xs font-bold text-slate-900 shadow-sm">
                  {project.category}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-indigo-700">{project.category}</span>
                  <span>·</span>
                  <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                  <span>·</span>
                  <span>{project.applicantCount} Total Applicant(s)</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {project.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{project.businessName}</span>
                  <span>·</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{project.businessLocation}</span>
                </div>
              </div>

              {/* Overview / Problem Goal */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Background & Business Goal</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {project.problemGoal}
                </p>
              </div>

              {/* Expected Result */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Expected Result</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {project.expectedResult}
                </p>
              </div>

              {/* Deliverables List */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Key Deliverables</h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                  {(project.deliverables || []).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Skills */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Required Skills & Capabilities</h3>
                <div className="text-xs text-slate-700 flex flex-wrap gap-2">
                  {(project.requiredSkills || []).map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md font-medium border border-slate-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Both individuals with these skills and student squads covering these areas are invited to apply.
                </p>
              </div>

              {/* Applicant Instructions */}
              <div className="border-t border-slate-100 pt-5 space-y-2 text-xs text-slate-600 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900">How to Apply:</h4>
                <p className="leading-relaxed">
                  1. Submit a concise proposal explaining how you or your squad will implement the deliverables.
                  <br />
                  2. Highlight at least one relevant college or personal portfolio project.
                  <br />
                  3. The business will review transparent match scores and contact you directly via InternBridge.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Project Meta Card & Action (1 col) */}
        <div className="space-y-6">
          {/* Quick Action Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="text-xs text-slate-500 font-medium">Proposed Compensation</div>
              <div className="text-2xl font-black text-slate-900 tabular-nums mt-0.5">
                {formatINR(project.budgetAmount)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {project.compensationType} · Milestone based
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-semibold text-slate-800">{project.durationWeeks} weeks</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Arrangement:</span>
                <span className="font-semibold text-slate-800">{project.arrangement}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Application Deadline:</span>
                <span className="font-semibold text-slate-800">{project.applicationDeadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Status:</span>
                <span className="font-bold text-emerald-700">{project.status}</span>
              </div>
            </div>

            {/* Role-Specific Action Controls */}
            {currentUser?.role === 'business' ? (
              project.businessId === currentBusiness?.id || project.businessId === currentUser.id ? (
                <div className="space-y-2.5">
                  <Link
                    to={`/business/projects/${project.id}/applicants`}
                    className="w-full py-3 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Review Applicants ({project.applicantCount})</span>
                  </Link>
                  <Link
                    to="/business/projects"
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>Manage All My Projects</span>
                  </Link>
                </div>
              ) : (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-slate-800">Business Preview Mode</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    You are viewing another organization's posted brief. Students can submit proposals to this brief.
                  </p>
                  <Link
                    to="/business/projects/new"
                    className="block text-center py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    + Post Your Own Project
                  </Link>
                </div>
              )
            ) : currentUser?.role === 'admin' ? (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="text-xs font-bold text-amber-900">Admin Platform Mode</div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Project Brief ID: {project.id}. Active status: {project.status}.
                </p>
                <Link
                  to="/admin/dashboard"
                  className="block text-center py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Return to Admin Console
                </Link>
              </div>
            ) : userApplication ? (
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-center space-y-1">
                <div className="text-xs font-bold text-indigo-900">Application Submitted</div>
                <div className="text-[11px] text-indigo-700">
                  Status: <strong>{userApplication.status}</strong>
                </div>
                <Link
                  to="/student/applications"
                  className="text-xs font-semibold text-indigo-600 underline block pt-1"
                >
                  View in My Applications →
                </Link>
              </div>
            ) : (
              <button
                onClick={handleOpenApply}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{currentUser ? 'Apply to Project' : 'Sign In to Apply'}</span>
              </button>
            )}
          </div>

          {/* Business Profile Summary */}
          {business && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                About the Business
              </div>
              <div className="flex items-center gap-3">
                <Avatar
                  src={business.logo}
                  name={business.name}
                  size="md"
                  rounded="rounded-xl"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">{business.name}</div>
                  <div className="text-[11px] text-slate-500">{business.businessType}</div>
                  <div className="text-[11px] text-slate-500">{business.location}</div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {business.description}
              </p>

              <div className="text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                Contact: <strong className="text-slate-700">{business.contactPerson}</strong>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Flow Modal */}
      {isApplyModalOpen && (
        <ApplicationModal
          project={project}
          isOpen={isApplyModalOpen}
          onClose={() => setIsApplyModalOpen(false)}
        />
      )}
    </div>
  );
};
