import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Save } from 'lucide-react';

export const StudentProfileEdit = () => {
  const { currentStudent, updateStudentProfile, students } = useApp();
  const student = currentStudent || students[0];

  const [name, setName] = useState(student.name);
  const [college, setCollege] = useState(student.college);
  const [course, setCourse] = useState(student.course);
  const [graduationYear, setGraduationYear] = useState(student.graduationYear);
  const [bio, setBio] = useState(student.bio);
  const [skillsStr, setSkillsStr] = useState(student.selfReportedSkills.join(', '));
  const [interestsStr, setInterestsStr] = useState(student.interests.join(', '));
  const [availability, setAvailability] = useState(student.availability);
  const [preferredArrangement, setPreferredArrangement] = useState(student.preferredArrangement);
  const [experienceLevel, setExperienceLevel] = useState(student.experienceLevel);
  const [githubUrl, setGithubUrl] = useState(student.githubUrl || '');
  const [linkedinUrl, setLinkedinUrl] = useState(student.linkedinUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(student.websiteUrl || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const interests = interestsStr.split(',').map(s => s.trim()).filter(Boolean);

    updateStudentProfile({
      name,
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
      <div>
        <h1 className="text-xl font-bold text-slate-900">Student Profile Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep your academic credentials, availability, and skills updated for project matching.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Basic Information</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">College / University</label>
              <input
                type="text"
                required
                value={college}
                onChange={e => setCollege(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
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
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Graduation Year</label>
              <input
                type="number"
                required
                value={graduationYear}
                onChange={e => setGraduationYear(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
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
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
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
              placeholder="Web Development, UI/UX Design, E-commerce"
              className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Weekly Availability</label>
              <select
                value={availability}
                onChange={e => setAvailability(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
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
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Experience Depth</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
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
              <label className="block text-xs font-semibold text-slate-800 mb-1">GitHub URL</label>
              <input
                type="url"
                value={githubUrl}
                onChange={e => setGithubUrl(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">Website URL</label>
              <input
                type="url"
                value={websiteUrl}
                onChange={e => setWebsiteUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
