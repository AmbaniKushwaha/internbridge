import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Users, PlusCircle, ArrowRight, UserPlus } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { AvatarGroup } from '../../components/ui/AvatarGroup';

export const StudentTeamsPage = () => {
  const { teams, currentStudent, students } = useApp();
  const student = currentStudent || students[0];

  const myTeams = teams.filter(
    (t) =>
      t.leaderId === student?.id ||
      t.leaderId === student?._id ||
      t.members.some(
        (m) =>
          m.studentId === student?.id ||
          m.studentId === student?._id ||
          m.studentId === student?.userId
      )
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">My Student Squads</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your project squads, invite classmates, and review member join requests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/student/find-teammates"
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserPlus className="w-4 h-4 text-slate-600" />
            <span>Find Teammates</span>
          </Link>
          <Link
            to="/student/teams/create"
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Squad</span>
          </Link>
        </div>
      </div>

      {myTeams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">You are not in any squad yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Creating a team allows you to apply for multi-disciplinary client briefs requiring both engineering and design.
            </p>
          </div>
          <Link
            to="/student/teams/create"
            className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
          >
            Form Your First Squad
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myTeams.map(team => {
            const isLeader = team.leaderId === student.id;

            return (
              <div
                key={team.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-slate-300 transition-all"
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={team.avatar}
                        name={team.name}
                        size="md"
                        rounded="rounded-xl"
                      />
                      <div>
                        <Link
                          to={`/student/teams/${team.id}`}
                          className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors block"
                        >
                          {team.name}
                        </Link>
                        <div className="text-[11px] text-slate-500">
                          {team.members.length} members · {team.visibility} Squad
                        </div>
                      </div>
                    </div>

                    {isLeader && (
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                        Squad Leader
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {team.description}
                  </p>

                  {/* Members Avatars preview */}
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <div className="text-xs font-semibold text-slate-800">Squad Members:</div>
                    <div className="flex items-center gap-2">
                      <AvatarGroup avatars={team.members} size="sm" max={4} />
                      <span className="text-xs text-slate-500">
                        {team.members.map(m => m.name.split(' ')[0]).join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Combined Skills */}
                  <div className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Combined Skills: </span>
                    <span className="line-clamp-1">{team.combinedSkills.slice(0, 5).join(' · ')}</span>
                  </div>

                  {/* Leader Alerts: Pending requests */}
                  {isLeader && team.pendingJoinRequests.length > 0 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <span>{team.pendingJoinRequests.length} pending join request(s)</span>
                      <Link
                        to={`/student/teams/${team.id}`}
                        className="font-bold underline text-amber-800"
                      >
                        Review Now →
                      </Link>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {team.openPositions?.length || 0} open position(s)
                  </span>
                  <Link
                    to={`/student/teams/${team.id}`}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    <span>Manage Squad</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
