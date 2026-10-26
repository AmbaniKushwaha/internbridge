import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { formatINR } from '../../utils/matching';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Compass,
  X,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  PlusCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ApplicationModal } from '../../components/project/ApplicationModal';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

const CATEGORIES = [
  'Website / E-commerce',
  'Mobile Application',
  'Graphic Design & Branding',
  'Video Editing & Media',
  'Data & Dashboards',
  'Automation & Tools',
  'Content & Marketing',
];

export const ExploreProjectsPage = () => {
  const { projects, savedProjectIds, toggleSaveProject, currentUser, currentBusiness, currentStudent, applications, addToast } = useApp();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArrangement, setSelectedArrangement] = useState('All');
  const [selectedCompensation, setSelectedCompensation] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Application Modal state
  const [applyingProject, setApplyingProject] = useState(null);

  // Filter & Sort Logic
  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        // Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = (project.title || '').toLowerCase().includes(query);
          const matchesDesc = (project.shortDescription || '').toLowerCase().includes(query);
          const matchesBiz = (project.businessName || '').toLowerCase().includes(query);
          const matchesSkills = (project.requiredSkills || []).some((s) =>
            s.toLowerCase().includes(query)
          );
          if (!matchesTitle && !matchesDesc && !matchesBiz && !matchesSkills) return false;
        }

        // Category
        if (selectedCategory !== 'All' && project.category !== selectedCategory) {
          return false;
        }

        // Arrangement
        if (selectedArrangement !== 'All' && project.arrangement !== selectedArrangement) {
          return false;
        }

        // Compensation
        if (selectedCompensation === 'Paid' && (!project.budgetAmount || project.budgetAmount === 0)) {
          return false;
        }
        if (selectedCompensation === 'Voluntary' && project.compensationType !== 'Unpaid / Voluntary') {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'budget_high') {
          return (b.budgetAmount || 0) - (a.budgetAmount || 0);
        }
        if (sortBy === 'duration_short') {
          return a.durationWeeks - b.durationWeeks;
        }
        if (sortBy === 'applicants') {
          return b.applicantCount - a.applicantCount;
        }
        return 0;
      });
  }, [projects, searchQuery, selectedCategory, selectedArrangement, selectedCompensation, sortBy]);

  const handleApplyClick = (project) => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to apply to this project.', 'info');
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'student') {
      addToast('Role Restriction', 'Only students can apply to project briefs.', 'warning');
      return;
    }
    setApplyingProject(project);
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedArrangement !== 'All' ||
    selectedCompensation !== 'All';

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedArrangement('All');
    setSelectedCompensation('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Discovery Feed
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Explore Business Projects
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Browse real-world client requirements, compare deliverables, and apply individually or with your student team.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role === 'business' && (
            <Link
              to="/business/projects/new"
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Brief</span>
            </Link>
          )}
          <div className="text-xs text-slate-500 font-medium tabular-nums">
            Showing <strong>{filteredProjects.length}</strong> of {projects.length} opportunities
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, business, description, or required skill (e.g. React, Figma, Python)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
          />
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Category Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Project Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Arrangement Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Arrangement
            </label>
            <select
              value={selectedArrangement}
              onChange={(e) => setSelectedArrangement(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
            >
              <option value="All">All Arrangements</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Compensation Dropdown */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Compensation
            </label>
            <select
              value={selectedCompensation}
              onChange={(e) => setSelectedCompensation(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
            >
              <option value="All">All Compensation</option>
              <option value="Paid">Paid Only (INR)</option>
              <option value="Voluntary">Unpaid / Voluntary</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Sort Results
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-800"
            >
              <option value="newest">Newest First</option>
              <option value="budget_high">Highest Budget</option>
              <option value="duration_short">Shortest Duration</option>
              <option value="applicants">Most Applicants</option>
            </select>
          </div>
        </div>

        {/* Active Filters Bar */}
        {hasActiveFilters && (
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-[11px] mr-1">Active Filters:</span>
              {searchQuery.trim() && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] cursor-pointer"
                >
                  <span>"{searchQuery}"</span>
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              )}
              {selectedCategory !== 'All' && (
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[11px] cursor-pointer"
                >
                  <span>Category: {selectedCategory}</span>
                  <X className="w-3 h-3 text-indigo-400" />
                </button>
              )}
              {selectedArrangement !== 'All' && (
                <button
                  onClick={() => setSelectedArrangement('All')}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] cursor-pointer"
                >
                  <span>{selectedArrangement}</span>
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              )}
              {selectedCompensation !== 'All' && (
                <button
                  onClick={() => setSelectedCompensation('All')}
                  className="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] cursor-pointer"
                >
                  <span>{selectedCompensation}</span>
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer underline"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No matching projects found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing specific category filters, or selecting "All Categories".
          </p>
          <button
            onClick={clearAllFilters}
            className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const isSaved = savedProjectIds.includes(project.id);

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all space-y-4 group overflow-hidden"
              >
                {/* Optional Project Showcase Image Banner */}
                {project.imageUrl && (
                  <div className="-mx-5 -mt-5 mb-1 h-36 overflow-hidden relative border-b border-slate-100 bg-slate-100">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-900 border border-slate-200 shadow-2xs">
                      {project.category}
                    </div>
                  </div>
                )}

                {/* Header & Meta */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar
                        src={project.businessLogo}
                        name={project.businessName}
                        size="sm"
                        rounded="rounded-lg"
                      />
                      <div className="min-w-0">
                        <div className="text-xs text-slate-500 font-medium truncate">
                          {project.businessName} · {project.businessLocation}
                        </div>
                        <Link to={`/projects/${project.id}`} className="block">
                          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5 line-clamp-2">
                            {project.title}
                          </h3>
                        </Link>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveProject(project.id)}
                      title={isSaved ? 'Remove from saved' : 'Save project'}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Unboxed Metadata (Zero-pill discipline) */}
                  <div className="text-xs text-slate-500 flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-slate-700">{project.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.arrangement}</span>
                    <span aria-hidden="true">·</span>
                    <span>{project.durationWeeks} weeks</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {project.shortDescription}
                  </p>

                  {/* Skills unboxed */}
                  <div className="text-xs text-slate-500 pt-1">
                    <span className="font-medium text-slate-700">Skills: </span>
                    <span className="line-clamp-1">{(project.requiredSkills || []).join(' · ')}</span>
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-slate-400">Budget / Reward</div>
                    <div className="text-xs font-bold text-slate-900 tabular-nums">
                      {formatINR(project.budgetAmount)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/projects/${project.id}`}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      Details
                    </Link>

                    {currentUser?.role === 'business' ? (
                      project.businessId === currentBusiness?.id || project.businessId === currentUser.id ? (
                        <Link
                          to={`/business/projects/${project.id}/applicants`}
                          className="px-3 py-1.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-2xs"
                        >
                          Applicants ({project.applicantCount})
                        </Link>
                      ) : null
                    ) : currentUser?.role === 'admin' ? (
                      <Link
                        to={`/projects/${project.id}`}
                        className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                      >
                        Moderate
                      </Link>
                    ) : applications.some(
                        (a) =>
                          a.projectId === project.id &&
                          (a.studentId === currentStudent?.id ||
                            a.teamMembers?.some((m) => m.studentId === currentStudent?.id))
                      ) ? (
                      <Link
                        to="/student/applications"
                        className="px-3 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 rounded-lg transition-colors"
                      >
                        Applied ✓
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleApplyClick(project)}
                        className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs cursor-pointer"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Modal */}
      {applyingProject && (
        <ApplicationModal
          project={applyingProject}
          isOpen={!!applyingProject}
          onClose={() => setApplyingProject(null)}
        />
      )}
    </div>
  );
};
