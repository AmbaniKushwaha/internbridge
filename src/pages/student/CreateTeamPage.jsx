import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const CreateTeamPage = () => {
  const { createTeam, currentStudent, students } = useApp();
  const navigate = useNavigate();
  const student = currentStudent || students[0];

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [interestsStr, setInterestsStr] = useState('Website / E-commerce, Mobile Application');
  const [additionalSkillsStr, setAdditionalSkillsStr] = useState('Figma, Node.js');
  const [openPositionsStr, setOpenPositionsStr] = useState('UI/UX Designer, Backend Architect');
  const [visibility, setVisibility] = useState('Public');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectInterests = interestsStr.split(',').map(s => s.trim()).filter(Boolean);
    const combinedSkills = additionalSkillsStr.split(',').map(s => s.trim()).filter(Boolean);
    const openPositions = openPositionsStr.split(',').map(s => s.trim()).filter(Boolean);

    const newTeam = await createTeam({
      name: name || 'New Student Squad',
      description: description || 'Cross-functional engineering and design team.',
      projectInterests,
      combinedSkills,
      openPositions,
      visibility,
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    });

    navigate(`/student/teams/${newTeam?.id || newTeam?._id}`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/student/teams"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Squads</span>
        </Link>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Form a New Student Squad</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Assemble complementary skills to apply for ambitious client projects as an organized team.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Squad Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Nexus FullStack Collective"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Squad Mission & Description <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What does your team specialize in? Describe your joint capabilities..."
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Target Project Interests (comma separated)
          </label>
          <input
            type="text"
            value={interestsStr}
            onChange={e => setInterestsStr(e.target.value)}
            placeholder="Website / E-commerce, Mobile Application, Data & Dashboards"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Additional Squad Skills to Highlight (comma separated)
          </label>
          <input
            type="text"
            value={additionalSkillsStr}
            onChange={e => setAdditionalSkillsStr(e.target.value)}
            placeholder="Figma, Node.js, PostgreSQL, Docker"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
          <span className="text-[11px] text-slate-400">
            Your personal skills ({student.selfReportedSkills.slice(0, 3).join(', ')}) will be automatically included.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">
            Open Positions to Recruit (comma separated)
          </label>
          <input
            type="text"
            value={openPositionsStr}
            onChange={e => setOpenPositionsStr(e.target.value)}
            placeholder="UI Designer, Content Writer, Video Specialist"
            className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1">Visibility</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVisibility('Public')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                visibility === 'Public'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs">Public Squad</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Students can discover and request to join.</div>
            </button>

            <button
              type="button"
              onClick={() => setVisibility('Private')}
              className={`p-3 rounded-xl border text-left cursor-pointer transition-colors ${
                visibility === 'Private'
                  ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="font-bold text-xs">Private Squad</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Invite-only membership.</div>
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/student/teams"
            className="text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Launch Squad</span>
          </button>
        </div>
      </form>
    </div>
  );
};
