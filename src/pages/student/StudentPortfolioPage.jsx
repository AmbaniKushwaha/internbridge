import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderGit2,
  PlusCircle,
  ExternalLink,
  Github,
  Trash2,
  Edit2,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const StudentPortfolioPage = () => {
  const { currentStudent, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, students } = useApp();
  const student = currentStudent || students[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('Web Development');
  const [technologiesStr, setTechnologiesStr] = useState('');
  const [skillsStr, setSkillsStr] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [completedDate, setCompletedDate] = useState('Jan 2026');
  const [personalRole, setPersonalRole] = useState('Full Stack Developer');
  const [contextType, setContextType] = useState('Personal Project');

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setDescription('');
    setProjectType('Web Development');
    setTechnologiesStr('React, Tailwind CSS, TypeScript');
    setSkillsStr('Frontend Architecture, API Integration');
    setGithubUrl('');
    setLiveUrl('');
    setCompletedDate('Jan 2026');
    setPersonalRole('Lead Developer');
    setContextType('Personal Project');
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setProjectType(item.projectType);
    setTechnologiesStr(item.technologies.join(', '));
    setSkillsStr(item.skillsDemonstrated.join(', '));
    setGithubUrl(item.githubUrl || '');
    setLiveUrl(item.liveUrl || '');
    setCompletedDate(item.completedDate);
    setPersonalRole(item.personalRole);
    setContextType(item.contextType);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const technologies = technologiesStr.split(',').map(s => s.trim()).filter(Boolean);
    const skillsDemonstrated = skillsStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingItem) {
      updatePortfolioItem(editingItem.id, {
        title,
        description,
        projectType,
        technologies,
        skillsDemonstrated,
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        completedDate,
        personalRole,
        contextType,
      });
    } else {
      addPortfolioItem({
        title,
        description,
        projectType,
        technologies,
        skillsDemonstrated,
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        completedDate,
        personalRole,
        contextType,
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, itemTitle) => {
    deletePortfolioItem(id);
  };

  const portfolioItems = student.portfolioItems || [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Student Portfolio Showcase</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Document your college assignments, personal prototypes, or freelance client deliveries.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Showcase Project</span>
        </button>
      </div>

      {/* Portfolio Items List */}
      {portfolioItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
          <FolderGit2 className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">No portfolio projects uploaded yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Adding at least one project demonstrates tangible proof to businesses and boosts your rule-based match score.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-semibold text-indigo-700">
                      {item.contextType} · {item.projectType} · {item.completedDate}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(item)}
                      title="Edit project"
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.title)}
                      title="Delete project"
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.description}
                </p>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>
                    <span className="font-semibold text-slate-800">Your Contribution: </span>
                    <span>{item.personalRole}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-800">Tech Stack: </span>
                    <span>{item.technologies.join(' · ')}</span>
                  </div>
                  {item.skillsDemonstrated.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-800">Skills Demonstrated: </span>
                      <span>{item.skillsDemonstrated.join(' · ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  {item.githubUrl && (
                    <a
                      href={item.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-slate-600 hover:text-slate-900 flex items-center gap-1 font-medium"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code Repo</span>
                    </a>
                  )}
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>

                <span className="text-[11px] text-slate-400">Verified Self-Submission</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingItem ? 'Edit Portfolio Project' : 'Add Showcase Project'}
          description="Document your project contributions and technologies used."
          maxWidth="xl"
        >
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Local Kirana Order System"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Project Domain</label>
                <select
                  value={projectType}
                  onChange={e => setProjectType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Content/Video">Content / Video</option>
                  <option value="Branding">Branding</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Context Origin</label>
                <select
                  value={contextType}
                  onChange={e => setContextType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="College Project">College Project</option>
                  <option value="Personal Project">Personal Project</option>
                  <option value="Business Project">Business Project</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Description & Impact <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What did this project achieve? What problem did it solve?"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Personal Role / Contribution <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={personalRole}
                  onChange={e => setPersonalRole(e.target.value)}
                  placeholder="e.g. Solo Developer or Lead UI Designer"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Completion Date</label>
                <input
                  type="text"
                  value={completedDate}
                  onChange={e => setCompletedDate(e.target.value)}
                  placeholder="e.g. Dec 2025"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Technologies Used (comma separated)
              </label>
              <input
                type="text"
                value={technologiesStr}
                onChange={e => setTechnologiesStr(e.target.value)}
                placeholder="React, Tailwind CSS, Express, MongoDB"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Skills Demonstrated (comma separated)
              </label>
              <input
                type="text"
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
                placeholder="REST APIs, State Management, Responsive Design"
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">GitHub / Code URL (Optional)</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Live Demo URL (Optional)</label>
                <input
                  type="url"
                  value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs cursor-pointer"
              >
                {editingItem ? 'Save Changes' : 'Add to Portfolio'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
