import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Users,
  ShieldCheck,
  UserPlus,
  Check,
  X,
  LogOut,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

import { Avatar } from '../../components/ui/Avatar';

export const TeamDetailPage = () => {
  const { teamId } = useParams();
  const {
    teams,
    currentStudent,
    requestToJoinTeam,
    respondToJoinRequest,
    leaveTeam,
    applications,
    addToast,
  } = useApp();
  const navigate = useNavigate();

  const team = teams.find((t) => t.id === teamId || t._id === teamId);

  if (!team) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Team Not Found</h2>
        <Link
          to="/student/teams"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Teams</span>
        </Link>
      </div>
    );
  }

  const isLeader =
    team.leaderId === currentStudent?.id ||
    team.leaderId === currentStudent?._id ||
    team.leaderId === currentStudent?.userId;
  const isMember = team.members.some(
    (m) =>
      m.studentId === currentStudent?.id ||
      m.studentId === currentStudent?._id ||
      m.studentId === currentStudent?.userId
  );
  const hasRequested = team.pendingJoinRequests.some(
    (r) =>
      r.studentId === currentStudent?.id ||
      r.studentId === currentStudent?._id ||
      r.studentId === currentStudent?.userId
  );

  // Applications submitted by this team
  const teamApplications = applications.filter(
    (a) =>
      a.applicantType === 'team' &&
      (a.teamId === team.id || a.teamId === team._id)
  );

  const handleLeave = () => {
    leaveTeam(team.id);
    addToast(`You have left ${team.name}`, 'info');
    navigate('/student/teams');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <div>
        <Link
          to="/student/teams"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Teams</span>
        </Link>
      </div>

      {/* Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar
              src={team.avatar}
              name={team.name}
              size="2xl"
              rounded="rounded-2xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">{team.name}</h1>
                <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  {team.visibility} Squad
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Squad Leader: <strong className="text-slate-800">{team.leaderName}</strong> · {team.members.length} Active Members
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            {!isMember && currentStudent && (
              <button
                onClick={() => requestToJoinTeam(team.id)}
                disabled={hasRequested}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  hasRequested
                    ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{hasRequested ? 'Join Request Pending' : 'Request to Join Team'}</span>
              </button>
            )}

            {isMember && !isLeader && (
              <button
                onClick={handleLeave}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Leave Team</span>
              </button>
            )}

            {isLeader && (
              <Link
                to="/student/find-teammates"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <UserPlus className="w-4 h-4" />
                <span>Find & Invite Teammates</span>
              </Link>
            )}
          </div>
        </div>

        {/* Team Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-5">
          {team.description}
        </p>

        {/* Combined Skills */}
        <div className="border-t border-slate-100 pt-5 space-y-2">
          <div className="text-xs font-bold text-slate-900">Combined Squad Capabilities:</div>
          <div className="flex flex-wrap gap-2">
            {team.combinedSkills.map(skill => (
              <span
                key={skill}
                className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Leader Admin: Pending Join Requests */}
      {isLeader && team.pendingJoinRequests.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-amber-900">Pending Join Requests ({team.pendingJoinRequests.length})</h3>
              <p className="text-xs text-amber-700">Students seeking to join this squad.</p>
            </div>
          </div>

          <div className="divide-y divide-amber-200/60 bg-white rounded-xl border border-amber-200">
            {team.pendingJoinRequests.map(req => (
              <div key={req.studentId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar src={req.studentAvatar} name={req.studentName} size="md" rounded="rounded-full" />
                  <div>
                    <Link
                      to={`/students/${req.studentId}`}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600"
                    >
                      {req.studentName}
                    </Link>
                    <div className="text-[11px] text-slate-500">
                      Skills: {req.skills.slice(0, 3).join(' · ')} · Requested {req.requestDate}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => respondToJoinRequest(team.id, req.studentId, true)}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept Member</span>
                  </button>
                  <button
                    onClick={() => respondToJoinRequest(team.id, req.studentId, false)}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmed Members Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Squad Members ({team.members.length})</h2>
            <p className="text-xs text-slate-500">Confirmed contributors and their defined roles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.members.map(member => (
            <div
              key={member.studentId}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={member.avatar}
                  name={member.name}
                  size="md"
                  rounded="rounded-full"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Link
                      to={`/students/${member.studentId}`}
                      className="text-xs font-bold text-slate-900 hover:text-indigo-600 truncate"
                    >
                      {member.name}
                    </Link>
                    {member.isLeader && (
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-1.5 py-0.5 rounded">
                        Lead
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">{member.role}</div>
                </div>
              </div>

              <div className="text-xs text-slate-600 border-t border-slate-100 pt-2">
                <span className="font-semibold text-slate-700">Key skills: </span>
                <span>{member.skills.join(' · ')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Open Positions */}
      {team.openPositions && team.openPositions.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900">Open Squad Positions</h3>
          <p className="text-xs text-slate-500">
            This team is actively looking to recruit students with these complementary capabilities:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {team.openPositions.map((pos, i) => (
              <span
                key={i}
                className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1 rounded-lg text-xs font-medium"
              >
                {pos}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Team Project Applications */}
      {teamApplications.length > 0 && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Team Applications ({teamApplications.length})</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {teamApplications.map(app => (
              <div key={app.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <div className="font-bold text-slate-900">{app.projectTitle}</div>
                  <div className="text-slate-500 text-[11px]">{app.businessName} · Applied {new Date(app.appliedDate).toLocaleDateString()}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  app.status === 'Selected'
                    ? 'bg-emerald-50 text-emerald-700'
                    : app.status === 'Shortlisted'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
