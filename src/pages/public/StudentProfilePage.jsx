import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  GraduationCap,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  UserPlus,
  FolderGit2,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/ui/Avatar';

export const StudentProfilePage = () => {
  const { studentId } = useParams();
  const { students, teams, currentUser, currentStudent, currentBusiness, projects, inviteStudentToTeam, addToast } = useApp();

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [inviteRole, setInviteRole] = useState('Frontend Contributor');
  const [businessInviteModalOpen, setBusinessInviteModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  const student = students.find((s) => s.id === studentId || s._id === studentId);

  if (!student) {
    const fallbackBackPath = currentUser?.role === 'business' ? '/business/dashboard' : currentUser?.role === 'student' ? '/student/find-teammates' : '/projects';
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Student Profile Not Found</h2>
        <Link
          to={fallbackBackPath}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Student Directory</span>
        </Link>
      </div>
    );
  }

  // Find teams led by current user where target student is not yet a member
  const userLedTeams = teams.filter(
    (t) =>
      (t.leaderId === currentStudent?.id ||
        t.leaderId === currentStudent?._id ||
        t.leaderId === currentStudent?.userId) &&
      !t.members.some((m) => m.studentId === student.id || m.studentId === student._id)
  );

  const handleSendInvite = () => {
    if (!selectedTeamId && userLedTeams.length > 0) {
      inviteStudentToTeam(userLedTeams[0].id, student.id, inviteRole);
    } else if (selectedTeamId) {
      inviteStudentToTeam(selectedTeamId, student.id, inviteRole);
    }
    setInviteModalOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to={currentUser?.role === 'business' ? '/business/dashboard' : currentUser?.role === 'student' ? '/student/find-teammates' : '/projects'}
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>
            {currentUser?.role === 'business'
              ? 'Back to Business Dashboard'
              : currentUser?.role === 'student'
              ? 'Back to Teammates Directory'
              : 'Back to Projects'}
          </span>
        </Link>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar
              src={student.avatar}
              name={student.name}
              size="2xl"
              rounded="rounded-2xl"
            />
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{student.name}</h1>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>{student.course} ({student.graduationYear})</span>
              </div>
              <div className="text-xs text-slate-500">{student.college}</div>
            </div>
          </div>

          {/* Action button: Role-segregated action */}
          {currentUser?.role === 'business' ? (
            <button
              onClick={() => {
                const businessProjects = projects.filter(p => p.businessId === currentBusiness?.id || p.businessId === currentUser.id);
                if (businessProjects.length > 0) {
                  setSelectedProjectId(businessProjects[0].id);
                }
                setBusinessInviteModalOpen(true);
              }}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite to Project Brief</span>
            </button>
          ) : currentStudent?.id === student.id ? (
            <Link
              to="/student/profile"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-2xs"
            >
              <span>Edit My Profile</span>
            </Link>
          ) : currentStudent ? (
            <button
              onClick={() => {
                if (userLedTeams.length > 0) setSelectedTeamId(userLedTeams[0].id);
                setInviteModalOpen(true);
              }}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite to Squad</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <span>Sign In to Connect</span>
            </Link>
          )}
        </div>

        {/* Bio */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-5">
          {student.bio}
        </p>

        {/* Meta Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-5 text-xs">
          <div>
            <div className="text-slate-400 text-[11px]">Availability</div>
            <div className="font-semibold text-slate-800 mt-0.5">{student.availability}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Work Mode</div>
            <div className="font-semibold text-slate-800 mt-0.5">{student.preferredArrangement}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Experience Depth</div>
            <div className="font-semibold text-slate-800 mt-0.5">{student.experienceLevel}</div>
          </div>
          <div>
            <div className="text-slate-400 text-[11px]">Completed Projects</div>
            <div className="font-semibold text-slate-800 mt-0.5 tabular-nums">
              {student.completedProjectsCount} projects
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-slate-100 pt-5 flex flex-wrap gap-4 text-xs">
          {student.githubUrl && (
            <a
              href={student.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          )}
          {student.linkedinUrl && (
            <a
              href={student.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
            </a>
          )}
          {student.websiteUrl && (
            <a
              href={student.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900"
            >
              <Globe className="w-4 h-4" />
              <span>Personal Site</span>
            </a>
          )}
        </div>
      </div>

      {/* Skills & Interests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Self-Reported Skills</h3>
            <span className="text-[11px] text-slate-400">(Declared by student)</span>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {(student.selfReportedSkills || []).map(skill => (
              <span
                key={skill}
                className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Interests & Preferred Work</h3>
          <div className="flex flex-wrap gap-2 pt-1">
            {(student.interests || []).map(interest => (
              <span
                key={interest}
                className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md text-xs font-medium"
              >
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Showcase Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Portfolio Projects</h2>
            <p className="text-xs text-slate-500">Documented project evidence and role contributions</p>
          </div>
          <span className="text-xs text-slate-500 tabular-nums">
            {student.portfolioItems?.length || 0} project(s)
          </span>
        </div>

        {(!student.portfolioItems || student.portfolioItems.length === 0) ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
            <FolderGit2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-xs text-slate-600">No portfolio projects uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {student.portfolioItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold text-indigo-600">
                        {item.contextType} · {item.completedDate}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 mt-0.5">{item.title}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-xs text-slate-600 space-y-1">
                    <div>
                      <span className="font-semibold text-slate-800">Role: </span>
                      <span>{item.personalRole}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-800">Tech Stack: </span>
                      <span>{(item.technologies || []).join(' · ')}</span>
                    </div>
                    {item.skillsDemonstrated && item.skillsDemonstrated.length > 0 && (
                      <div>
                        <span className="font-semibold text-slate-800">Skills Demonstrated: </span>
                        <span>{item.skillsDemonstrated.join(' · ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                    >
                      <span>Repository</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-teal-600 hover:text-teal-800 font-semibold flex items-center gap-1"
                    >
                      <span>Live Demo</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invite to Team Modal */}
      {inviteModalOpen && (
        <Modal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          title={`Invite ${student.name} to Team`}
          description="Send an invitation to join your student squad."
        >
          <div className="space-y-4">
            {userLedTeams.length === 0 ? (
              <div className="text-xs text-slate-600 space-y-3">
                <p>You do not currently lead any teams. Create a team first from your dashboard.</p>
                <Link
                  to="/student/teams/create"
                  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
                >
                  Create a Team
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Select Your Squad:
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={e => setSelectedTeamId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    {userLedTeams.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({(t.members || []).length} members)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Proposed Role in Squad:
                  </label>
                  <input
                    type="text"
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value)}
                    placeholder="e.g. Frontend Developer or UI Designer"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => setInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendInvite}
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    Send Invitation
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}

      {/* Business Invite Modal */}
      {businessInviteModalOpen && (
        <Modal
          isOpen={businessInviteModalOpen}
          onClose={() => setBusinessInviteModalOpen(false)}
          title={`Invite ${student.name} to Apply`}
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Send an invitation notifying <strong>{student.name}</strong> about one of your active project briefs.
            </p>

            {projects.filter(p => p.businessId === currentBusiness?.id || p.businessId === currentUser?.id).length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                <p>You do not currently have any active project briefs posted.</p>
                <Link
                  to="/business/projects/new"
                  className="inline-block px-3 py-1.5 bg-teal-700 text-white font-bold rounded-lg"
                >
                  Post a Project First
                </Link>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Select Your Project Brief:
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={e => setSelectedProjectId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                  >
                    {projects
                      .filter(p => p.businessId === currentBusiness?.id || p.businessId === currentUser?.id)
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.title} ({p.category})
                        </option>
                      ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    onClick={() => setBusinessInviteModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      addToast(
                        'Invitation Sent',
                        `Invited ${student.name} to apply for your project!`,
                        'success'
                      );
                      setBusinessInviteModalOpen(false);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg cursor-pointer shadow-xs"
                  >
                    Send Brief Invitation
                  </button>
                </div>
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
