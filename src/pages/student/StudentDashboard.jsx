import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  Compass,
  FileText,
  Users,
  FolderGit2,
  CheckCircle2,
  Clock,
  ArrowRight,
  PlusCircle,
  Sparkles,
  ExternalLink,
  Bell,
  Building,
  Target,
  ChevronRight,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { AvatarGroup } from '../../components/ui/AvatarGroup';

export const StudentDashboard = () => {
  const { currentStudent, projects, applications, teams, students } = useApp();
  const navigate = useNavigate();

  const student = currentStudent || students[0];

  // Time-of-day greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  // Teams student belongs to
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

  // Applications submitted by this student or student's teams
  const myApplications = applications.filter((a) => {
    if (a.studentId === student?.id || a.studentId === student?._id || a.studentId === student?.userId) return true;
    if (currentUser && (a.studentId === currentUser.id || a.studentId === currentUser._id)) return true;
    if (a.teamMembers?.some((m) => m.studentId === student?.id || m.studentId === student?._id)) return true;
    if (a.teamId && myTeams.some((t) => t.id === a.teamId || t._id === a.teamId)) return true;
    return false;
  });

  // Recommended projects based on student's self-reported skills
  const studentSkillSet = new Set(student.selfReportedSkills.map((s) => s.toLowerCase()));
  const recommendedProjects = projects
    .filter((p) => p.status === 'Open')
    .map((p) => {
      const matchCount = p.requiredSkills.filter(
        (rs) =>
          studentSkillSet.has(rs.toLowerCase()) ||
          Array.from(studentSkillSet).some(
            (ss) => ss.includes(rs.toLowerCase()) || rs.toLowerCase().includes(ss)
          )
      ).length;
      const fitScore = Math.min(98, Math.max(65, Math.round((matchCount / Math.max(1, p.requiredSkills.length)) * 100)));
      return { project: p, matchCount, fitScore };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, 3);

  // Suggested teammates
  const primaryTeamMemberIds = new Set(myTeams[0]?.members.map((m) => m.studentId) || [student.id]);
  const suggestedTeammates = students
    .filter((s) => s.id !== student.id && !primaryTeamMemberIds.has(s.id))
    .slice(0, 3);

  // Calculate profile completion percentage and missing items
  let completedFields = 0;
  const checklist = [];

  if (student.name && student.college) {
    completedFields++;
  } else {
    checklist.push('Add College & Degree');
  }

  if (student.bio && student.bio.length > 20) {
    completedFields++;
  } else {
    checklist.push('Write short bio');
  }

  if (student.selfReportedSkills && student.selfReportedSkills.length >= 3) {
    completedFields++;
  } else {
    checklist.push('Add 3+ core skills');
  }

  if (student.portfolioItems && student.portfolioItems.length > 0) {
    completedFields++;
  } else {
    checklist.push('Upload a portfolio project');
  }

  if (student.githubUrl || student.linkedinUrl) {
    completedFields++;
  } else {
    checklist.push('Link GitHub or LinkedIn');
  }

  if (myTeams.length > 0) {
    completedFields++;
  } else {
    checklist.push('Create or join a student squad');
  }

  const completionPercentage = Math.round((completedFields / 6) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-8"
    >
      {/* Welcome & Profile Header Banner */}
      <Card hover={false} className="p-6 sm:p-8 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <Link
              to="/student/profile"
              className="relative group block shrink-0 cursor-pointer"
              title="Click to update profile & avatar"
            >
              <Avatar
                src={student.avatar}
                name={student.name}
                size="2xl"
                rounded="rounded-2xl"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" />
              <span className="absolute inset-0 rounded-2xl bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">
                Edit
              </span>
            </Link>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {greeting}, {student.name.split(' ')[0]}
                </h1>
                <Badge variant="indigo">Student Workspace</Badge>
              </div>

              <p className="text-xs text-slate-500 mt-1 font-medium">
                {student.course} · {student.college} (Graduating {student.graduationYear})
              </p>

              <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                <span>Available: {student.availability}</span>
                <span className="text-slate-300">·</span>
                <span>{student.preferredArrangement} Mode</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/portfolio')}
              icon={PlusCircle}
            >
              Add Project
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/teams/create')}
              icon={Users}
            >
              Form Squad
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/projects')}
              icon={Compass}
            >
              Explore Briefs
            </Button>
          </div>
        </div>
      </Card>

      {/* Profile Readiness Score Card */}
      <Card hover={false} className="p-5 sm:p-6 bg-gradient-to-r from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Profile Readiness Score</span>
          </div>
          <span className="font-black text-indigo-700 tabular-nums text-sm">
            {completionPercentage}% Ready
          </span>
        </div>

        <div className="w-full bg-indigo-200/50 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-2.5 rounded-full transition-all duration-500 shadow-2xs"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-indigo-900 pt-1">
          <div className="text-[11px] text-indigo-800">
            {checklist.length > 0 ? (
              <span>
                To maximize your match ranking: <strong>{checklist[0]}</strong>
              </span>
            ) : (
              <span>Your profile is 100% complete and fully optimized for discovery!</span>
            )}
          </div>
          <Link
            to="/student/profile"
            className="font-bold underline text-indigo-700 hover:text-indigo-900 shrink-0 text-xs"
          >
            Update Profile Credentials →
          </Link>
        </div>
      </Card>

      {/* 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Applications & Recommended Projects */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Applications Section */}
          <Card hover={false} className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  My Recent Applications
                </h2>
                <p className="text-xs text-slate-500">Live review status for your solo & squad submissions</p>
              </div>
              <Link
                to="/student/applications"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View All ({myApplications.length})
              </Link>
            </div>

            {myApplications.length === 0 ? (
              <div className="py-10 text-center text-xs text-slate-500 space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <p>You haven't submitted any project proposals yet.</p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/projects')}
                  icon={Compass}
                >
                  Browse Open Briefs
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {myApplications.slice(0, 3).map((app) => {
                  const isSelected = app.status === 'Selected';
                  const isShortlisted = app.status === 'Shortlisted';
                  const isPending = app.status === 'Pending';

                  return (
                    <div
                      key={app.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/projects/${app.projectId}`}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate text-sm"
                          >
                            {app.projectTitle}
                          </Link>
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-medium">
                            {app.applicantType === 'team' ? `${app.teamName} (Squad)` : 'Solo'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          {app.businessName} · Applied {new Date(app.appliedDate).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <Badge
                          variant={
                            isSelected
                              ? 'success'
                              : isShortlisted
                              ? 'indigo'
                              : isPending
                              ? 'default'
                              : 'danger'
                          }
                        >
                          {app.status}
                        </Badge>
                        <Link
                          to="/student/applications"
                          className="text-slate-400 hover:text-slate-700 p-1 rounded"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Recommended Projects Feed */}
          <Card hover={false} className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">
                    Recommended for Your Skills
                  </h2>
                  <Badge variant="indigo">Best Matches</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Matched with: {student.selfReportedSkills.slice(0, 3).join(', ')}
                </p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Explore More
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedProjects.map(({ project, fitScore }) => (
                <div
                  key={project.id}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:bg-slate-50/50 transition-all space-y-2.5 text-xs bg-white shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {project.businessName} · {project.category}
                      </div>
                      <Link
                        to={`/projects/${project.id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 mt-0.5 block text-sm"
                      >
                        {project.title}
                      </Link>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-slate-900 tabular-nums block">
                        {formatINR(project.budgetAmount)}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                        {fitScore}% Rule Match
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-600 line-clamp-2 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-500 text-[11px]">
                    <span>
                      {project.arrangement} · {project.durationWeeks} weeks
                    </span>
                    <Link
                      to={`/projects/${project.id}`}
                      className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>View & Apply</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column (1 col): Current Squads & Suggested Teammates */}
        <div className="space-y-8">
          {/* My Current Squads */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                My Squads ({myTeams.length})
              </h2>
              <Link
                to="/student/teams"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Manage
              </Link>
            </div>

            {myTeams.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500 space-y-3">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p>You haven't formed or joined a team yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/student/teams/create')}
                  icon={PlusCircle}
                >
                  Create Squad
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {myTeams.map((team) => (
                  <Link
                    key={team.id}
                    to={`/student/teams/${team.id}`}
                    className="block p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={team.avatar}
                        name={team.name}
                        size="md"
                        rounded="rounded-xl"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {team.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {team.members.length} members ·{' '}
                          {team.leaderId === student.id ? 'Squad Leader' : 'Contributor'}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          {/* Suggested Teammates */}
          <Card hover={false} className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Suggested Teammates
              </h2>
              <Link
                to="/student/find-teammates"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                Directory
              </Link>
            </div>

            <div className="space-y-3">
              {suggestedTeammates.map((tm) => (
                <div
                  key={tm.id}
                  className="p-3 rounded-xl border border-slate-200/90 flex items-center justify-between gap-3 text-xs bg-white"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar
                      src={tm.avatar}
                      name={tm.name}
                      size="sm"
                      rounded="rounded-full"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/students/${tm.id}`}
                        className="font-bold text-slate-900 hover:text-indigo-600 truncate block"
                      >
                        {tm.name}
                      </Link>
                      <div className="text-[11px] text-slate-500 truncate">{tm.college}</div>
                    </div>
                  </div>
                  <Link
                    to={`/students/${tm.id}`}
                    className="px-2.5 py-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg shrink-0"
                  >
                    Profile
                  </Link>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};
