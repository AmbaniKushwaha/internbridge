import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Users,
  UserPlus,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Avatar } from '../../components/ui/Avatar';

export const FindTeammatesPage = () => {
  const { students, currentStudent, teams, inviteStudentToTeam } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');

  // Invite Modal
  const [invitingStudent, setInvitingStudent] = useState(null);
  const [targetTeamId, setTargetTeamId] = useState('');
  const [proposedRole, setProposedRole] = useState('Frontend Engineer');

  // Collect all unique skills across students
  const allSkills = useMemo(() => {
    const set = new Set();
    students.forEach(s => s.selfReportedSkills.forEach(sk => set.add(sk)));
    return Array.from(set).sort();
  }, [students]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      // Don't show current student to themselves
      if (
        currentStudent &&
        (student.id === currentStudent.id ||
          student._id === currentStudent._id ||
          student.userId === currentStudent.userId)
      ) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = student.name.toLowerCase().includes(q);
        const matchesCollege = student.college.toLowerCase().includes(q);
        const matchesSkills = student.selfReportedSkills.some(s => s.toLowerCase().includes(q));
        if (!matchesName && !matchesCollege && !matchesSkills) return false;
      }

      // Skill filter
      if (selectedSkill !== 'All' && !student.selfReportedSkills.includes(selectedSkill)) {
        return false;
      }

      // Availability filter
      if (selectedAvailability !== 'All' && student.availability !== selectedAvailability) {
        return false;
      }

      return true;
    });
  }, [students, currentStudent, searchQuery, selectedSkill, selectedAvailability]);

  // Teams led by current student
  const myLedTeams = teams.filter(t => t.leaderId === currentStudent?.id);

  const handleOpenInvite = (student) => {
    setInvitingStudent(student);
    if (myLedTeams.length > 0) setTargetTeamId(myLedTeams[0].id);
    setProposedRole('Team Contributor');
  };

  const handleSendInvite = () => {
    if (invitingStudent && targetTeamId) {
      inviteStudentToTeam(targetTeamId, invitingStudent.id, proposedRole);
      setInvitingStudent(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Student Talent Directory</div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1">Find Teammates & Classmates</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover peer developers, designers, and video editors across colleges to form high-impact project squads.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium tabular-nums">
          Showing <strong>{filteredStudents.length}</strong> available students
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, college (e.g. GGCT, IIT, BITS), or skill..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Filter by Skill</label>
            <select
              value={selectedSkill}
              onChange={e => setSelectedSkill(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
            >
              <option value="All">All Skills</option>
              {allSkills.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Availability</label>
            <select
              value={selectedAvailability}
              onChange={e => setSelectedAvailability(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs"
            >
              <option value="All">All Availabilities</option>
              <option value="10-15 hrs/week">10-15 hrs/week</option>
              <option value="15-25 hrs/week">15-25 hrs/week</option>
              <option value="Full-time / Summer">Full-time / Summer</option>
              <option value="Flexible">Flexible</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Directory Grid */}
      {filteredStudents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Users className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No teammates found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try clearing the skill filter or searching with a different college name.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map(student => (
            <div
              key={student.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={student.avatar}
                    name={student.name}
                    size="lg"
                    rounded="rounded-xl"
                  />
                  <div className="min-w-0">
                    <Link
                      to={`/students/${student.id}`}
                      className="text-sm font-bold text-slate-900 hover:text-indigo-600 truncate block"
                    >
                      {student.name}
                    </Link>
                    <div className="text-[11px] text-slate-500 truncate">{student.college}</div>
                    <div className="text-[11px] text-slate-400 truncate">{student.course} ({student.graduationYear})</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {student.bio}
                </p>

                {/* Self-reported skills unboxed */}
                <div className="text-xs text-slate-500 pt-1">
                  <span className="font-medium text-slate-700">Skills: </span>
                  <span className="line-clamp-1">{student.selfReportedSkills.join(' · ')}</span>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                  <span>{student.availability}</span>
                  <span className="tabular-nums font-semibold text-slate-700">
                    {student.portfolioItems?.length || 0} project(s)
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/students/${student.id}`}
                  className="font-semibold text-slate-600 hover:text-slate-900"
                >
                  View Profile
                </Link>

                {myLedTeams.length > 0 ? (
                  <button
                    onClick={() => handleOpenInvite(student)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Invite</span>
                  </button>
                ) : (
                  <Link
                    to={`/students/${student.id}`}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-lg"
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invite Modal */}
      {invitingStudent && (
        <Modal
          isOpen={!!invitingStudent}
          onClose={() => setInvitingStudent(null)}
          title={`Invite ${invitingStudent.name} to Squad`}
          description="Send a direct invitation to add this teammate to your active squad."
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Select Squad:</label>
              <select
                value={targetTeamId}
                onChange={e => setTargetTeamId(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                {myLedTeams.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.members.length} members)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Assigned Role:</label>
              <input
                type="text"
                value={proposedRole}
                onChange={e => setProposedRole(e.target.value)}
                placeholder="e.g. Frontend Developer"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setInvitingStudent(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSendInvite}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
              >
                Confirm & Invite
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
