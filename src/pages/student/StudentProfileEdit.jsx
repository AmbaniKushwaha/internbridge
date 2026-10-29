import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Save, ExternalLink, User } from 'lucide-react';
import { AvatarUpload } from '../../components/ui/AvatarUpload';

export const StudentProfileEdit = () => {
  const { currentStudent, updateStudentProfile, students } = useApp();
  const student = currentStudent || students[0];

  const [name, setName] = useState(student?.name || '');
  const [avatar, setAvatar] = useState(student?.avatar || '');
  const [college, setCollege] = useState(student?.college || '');
  const [course, setCourse] = useState(student?.course || '');
  const [graduationYear, setGraduationYear] = useState(student?.graduationYear || 2026);
  const [bio, setBio] = useState(student?.bio || '');
  const [skillsStr, setSkillsStr] = useState((student?.selfReportedSkills || []).join(', '));
  const [interestsStr, setInterestsStr] = useState((student?.interests || []).join(', '));
  const [availability, setAvailability] = useState(student?.availability || '15-25 hrs/week');
  const [preferredArrangement, setPreferredArrangement] = useState(student?.preferredArrangement || 'Remote');
  const [experienceLevel, setExperienceLevel] = useState(student?.experienceLevel || 'Intermediate');
  const [githubUrl, setGithubUrl] = useState(student?.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(student?.linkedinUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(student?.websiteUrl || '');

  useEffect(() => {
    if (student) {
      setName(student.name || '');
      setAvatar(student.avatar || '');
      setCollege(student.college || '');
      setCourse(student.course || '');
      setGraduationYear(student.graduationYear || 2026);
      setBio(student.bio || '');
      setSkillsStr((student.selfReportedSkills || []).join(', '));
      setInterestsStr((student.interests || []).join(', '));
      setAvailability(student.availability || '15-25 hrs/week');
      setPreferredArrangement(student.preferredArrangement || 'Remote');
      setExperienceLevel(student.experienceLevel || 'Intermediate');
      setGithubUrl(student.githubUrl || '');
      setLinkedinUrl(student.linkedinUrl || '');
      setWebsiteUrl(student.websiteUrl || '');
    }
  }, [student]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const interests = interestsStr.split(',').map(s => s.trim()).filter(Boolean);

    updateStudentProfile({
      name,
      avatar,
      college,
      course,
      graduationYear: Number(graduationYear),
      bio,
      selfReportedSkills: skills,
      interests,
      availability,
      preferredArrangement,
      experienceLevel,
      githubUrl,
      linkedinUrl,
      websiteUrl,
    });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Student Profile Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Update your profile photo, skills, and academic credentials for matching with briefs and squad invitations.
          </p>
        </div>

        {student && (
          <Link
            to={`/students/${student.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200/80 transition-colors self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Profile</span>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-7">
        {/* Profile Picture Upload Section */}
        <AvatarUpload
          currentAvatar={avatar}
          name={name || 'Student'}
          onAvatarChange={(newUrl) => setAvatar(newUrl)}
          label="Profile Picture"
          helperText="Upload your avatar or headshot. JPG, PNG, WEBP, or GIF up to 5MB."
          role="student"
        />

        {/* Basic Info */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Basic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rohan Verma"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="e.g. Bangalore Institute of Technology"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Degree / Course</label>
              <input
                type="text"
                required
                value={course}
                onChange={e => setCourse(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engg"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Graduation Year</label>
              <input
                type="number"
                required
                min="2020"
                max="2032"
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell businesses about your engineering strengths and what projects excite you..."
            />
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Skills & Experience</h3>
            <span className="text-[11px] text-slate-400">Distinguished as self-reported</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Self-Reported Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsStr}
              onChange={e => setSkillsStr(e.target.value)}
              placeholder="React, TypeScript, Tailwind CSS, Python, Node.js"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Interests & Focus Areas (comma separated)
            </label>
            <input
              type="text"
              value={interestsStr}
              onChange={e => setInterestsStr(e.target.value)}
              placeholder="Web Development, UI/UX Design, E-commerce, AI"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Weekly Availability</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="10-15 hrs/week">10-15 hrs/week</option>
                <option value="15-25 hrs/week">15-25 hrs/week</option>
                <option value="Full-time / Summer">Full-time / Summer</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Work Arrangement</label>
              <select
                value={preferredArrangement}
                onChange={e => setPreferredArrangement(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Experience Depth</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Online Presence (Optional)</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">GitHub Profile</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">LinkedIn Profile</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Personal Portfolio / Website</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://yourportfolio.dev"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            All updates are synchronized directly to your InternBridge account profile.
          </p>

          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
