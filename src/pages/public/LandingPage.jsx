import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  Compass,
  Users,
  Briefcase,
  ArrowRight,
  Sparkles,
  ChevronRight,
  FileCheck2,
  Award,
  Search,
  Check,
} from 'lucide-react';
import { formatINR } from '../../utils/matching';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../../components/ui/Button';
import { AvatarGroup } from '../../components/ui/AvatarGroup';

export const LandingPage = () => {
  const { projects, students } = useApp();
  const navigate = useNavigate();

  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0);

  const workflowSteps = [
    {
      step: '01',
      title: 'Discover Projects',
      desc: 'Browse active briefs posted by businesses seeking student teams and individual talent for practical engineering and design tasks.',
      badge: 'Step 1: Discovery',
      highlight: 'Real-World Briefs',
      preview: {
        headline: 'Verified Business Briefs with Clear Scopes',
        sub: 'Filter by tech stack, project duration, and remote requirements without vague or unpaid assignments.',
        icon: Search,
        tags: ['React Storefront', 'UI/UX Design', 'API Integration', 'Mobile App'],
      },
    },
    {
      step: '02',
      title: 'Form a Team',
      desc: 'Connect with peers across disciplines—combining developers, designers, and strategists to build balanced project squads.',
      badge: 'Step 2: Team Building',
      highlight: 'Cross-Disciplinary Squads',
      preview: {
        headline: 'Collaborative Squad Formation',
        sub: 'Invite teammates, align on project goals, and present a unified front to business founders.',
        icon: Users,
        tags: ['Full-Stack Lead', 'UI Designer', 'Product Strategist', 'Shared Portfolio'],
      },
    },
    {
      step: '03',
      title: 'Apply with Your Portfolio',
      desc: 'Submit transparent portfolio links, GitHub repositories, and design prototypes rather than traditional paper resumes.',
      badge: 'Step 3: Application',
      highlight: 'Portfolio-First',
      preview: {
        headline: 'Proof Over Paper Resumes',
        sub: 'Businesses review real deliverables, past project contributions, and technical proof directly.',
        icon: FileCheck2,
        tags: ['GitHub Linked', 'Figma Wireframes', 'Code Samples', 'Verified Profile'],
      },
    },
    {
      step: '04',
      title: 'Collaborate & Deliver',
      desc: 'Work side-by-side with business founders, deliver working software or design artifacts, and build verified experience.',
      badge: 'Step 4: Collaboration',
      highlight: 'Direct Founder Mentorship',
      preview: {
        headline: 'Direct Mentorship & Real Experience',
        sub: 'Gain hands-on industry exposure, milestone feedback, and verifiable project credentials for your resume.',
        icon: Award,
        tags: ['Direct Access', 'Milestone Reviews', 'Production Deliverables', 'Verified Experience'],
      },
    },
  ];

  const featuredProjects = projects.slice(0, 3);
  const dominantProject = projects[0] || {
    title: 'Next-Gen E-Commerce PWA Storefront',
    businessName: 'Bangalore TechRetail',
    category: 'Full-Stack Web',
    budgetAmount: 25000,
    durationWeeks: 4,
    shortDescription: 'Looking for a 3-student squad to build a lightning-fast React PWA storefront with secure checkout integration.',
    requiredSkills: ['React', 'Tailwind', 'REST API', 'PWA'],
  };

  return (
    <div className="bg-[#141414] text-[#F4F0E8] selection:bg-indigo-600 selection:text-white">
      {/* Cinematic Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-36 md:pb-48 bg-[#141414] overflow-hidden border-b border-white/10">
        {/* Grain overlay */}
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[700px] h-[350px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[250px] bg-blue-500/10 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
            {/* Left Column: Asymmetrical Editorial Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 space-y-8 text-left"
            >
              {/* <div className="inline-flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-indigo-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Student-Business Project Discovery & Team Matching</span>
              </div> */}

              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.98] text-balance">
                Real work. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-300 to-indigo-200">
                  Real people.
                </span> <br />
                Your next big thing.
              </h1>

              <p className="text-lg sm:text-xl text-[#F4F0E8]/70 leading-relaxed max-w-xl font-normal text-balance">
                InternBridge connects ambitious students, individual talent, and student squads with growing businesses through verifiable real-world projects.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-5 pt-4">
                <button
                  onClick={() => navigate('/projects')}
                  className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-3 shadow-lg shadow-indigo-600/35 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Compass className="w-5 h-5" />
                  <span>Explore Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/student/teams/create')}
                  className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-[#F4F0E8] border border-white/15 font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer hover:border-white/30"
                >
                  <Users className="w-5 h-5 text-indigo-400" />
                  <span>Build Your Team</span>
                </button>
              </div>

              {/* Truthful Stats Metadata */}
              <div className="pt-10 border-t border-white/10 grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">Verified</div>
                  <div className="text-xs text-[#F4F0E8]/60 font-medium mt-1">Business Briefs</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">Squads</div>
                  <div className="text-xs text-[#F4F0E8]/60 font-medium mt-1">& Individual Talent</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-display font-bold text-white">Direct</div>
                  <div className="text-xs text-[#F4F0E8]/60 font-medium mt-1">Founder Access</div>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Animated Living Collaboration Scene */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Subtle Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/30 to-blue-500/30 rounded-3xl blur-2xl opacity-40" />

                <div className="relative bg-[#1a1a1a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl">
                  {/* Scene Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 font-bold font-mono">
                        IB
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">Active Collaboration Scene</div>
                        <div className="text-xs text-[#F4F0E8]/60">Squad Formation & Brief Match</div>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 text-xs font-mono font-medium">
                      Squad Ready
                    </span>
                  </div>

                  {/* Simulated Brief Card */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-indigo-400">
                      <span>{dominantProject.category}</span>
                      <span>{formatINR(dominantProject.budgetAmount)}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {dominantProject.title}
                    </h3>
                    <p className="text-xs text-[#F4F0E8]/70 leading-relaxed">
                      {dominantProject.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {dominantProject.requiredSkills.map((skill) => (
                        <span key={skill} className="px-2.5 py-1 rounded-md bg-white/5 text-[#F4F0E8]/90 text-xs font-mono border border-white/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Connected Teammates Preview */}
                  <div className="space-y-3 pt-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-[#F4F0E8]/50">Matched Squad Members</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          AK
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Aarav K.</div>
                          <div className="text-[10px] text-[#F4F0E8]/60 font-mono">Full-Stack Lead</div>
                        </div>
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          PS
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Priya S.</div>
                          <div className="text-[10px] text-[#F4F0E8]/60 font-mono">UI/UX Designer</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AvatarGroup avatars={students.slice(0, 3)} max={3} size="sm" />
                      <span className="text-xs text-[#F4F0E8]/60">Squad of 3</span>
                    </div>
                    <button
                      onClick={() => navigate('/projects')}
                      className="text-xs font-mono font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Brief</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Floating SVG Connection Indicator */}
                
                {/* <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-white/15 px-4 py-3 rounded-xl shadow-xl backdrop-blur-md hidden sm:flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                     {<div className="text-xs font-bold text-white">Verified Portfolio Match</div> }
                    <div className="text-[10px] text-[#F4F0E8]/60">GitHub & Figma Linked</div>
                  </div>
                </motion.div> */}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Editorial Section: Warm Ivory Surface */}
      <section className="py-28 bg-[#F4F0E8] text-[#141414] relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-[#141414]/15 pb-12">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
                How InternBridge Works
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-[#141414]">
                From discovery to real-world collaboration.
              </h2>
            </div>
            <p className="text-base text-[#141414]/70 max-w-sm leading-relaxed">
              A transparent four-step workflow designed to connect ambitious student talent directly with growing businesses.
            </p>
          </div>

          {/* Workflow Interactive Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Interactive Tabs */}
            <div className="lg:col-span-5 space-y-4">
              {workflowSteps.map((item, idx) => {
                const isActive = activeWorkflowStep === idx;
                return (
                  <button
                    key={item.step}
                    onClick={() => setActiveWorkflowStep(idx)}
                    className={`w-full text-left p-6 rounded-2xl transition-all duration-300 cursor-pointer border flex items-start gap-5 ${
                      isActive
                        ? 'bg-white border-[#141414] shadow-xl shadow-black/5 scale-[1.01]'
                        : 'bg-[#F4F0E8] border-[#141414]/15 hover:bg-white/60 hover:border-[#141414]/30'
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-display font-bold text-sm shrink-0 transition-colors ${
                      isActive ? 'bg-[#141414] text-white' : 'bg-[#141414]/5 text-[#141414]/70'
                    }`}>
                      {item.step}
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-xs font-mono uppercase tracking-wider text-indigo-700 font-semibold">{item.badge}</div>
                      <h3 className="font-display font-bold text-xl text-[#141414]">{item.title}</h3>
                      <p className="text-xs sm:text-sm text-[#141414]/70 leading-relaxed">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Dynamic Step Preview */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorkflowStep}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white border border-[#141414]/15 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-black/5 space-y-8 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                      {React.createElement(workflowSteps[activeWorkflowStep].preview.icon, { className: 'w-7 h-7' })}
                    </div>
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-200">
                      {workflowSteps[activeWorkflowStep].highlight}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-4xl font-display font-bold text-[#141414]">
                      {workflowSteps[activeWorkflowStep].preview.headline}
                    </h3>
                    <p className="text-[#141414]/70 text-base leading-relaxed">
                      {workflowSteps[activeWorkflowStep].preview.sub}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-[#141414]/10">
                    <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#141414]/50">Key Deliverables</div>
                    <div className="flex flex-wrap gap-2">
                      {workflowSteps[activeWorkflowStep].preview.tags.map((tag) => (
                        <div key={tag} className="px-3.5 py-2 rounded-xl bg-[#F4F0E8] border border-[#141414]/10 text-[#141414] text-xs font-mono font-semibold flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{tag}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => navigate('/projects')}
                      className="px-7 py-3.5 rounded-xl bg-[#141414] hover:bg-black text-white font-semibold text-sm flex items-center gap-2.5 transition-all cursor-pointer"
                    >
                      <span>Explore Active Projects</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Portfolio Index (Warm Ivory Surface continued) */}
      <section className="py-28 bg-[#F4F0E8] border-t border-[#141414]/15">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-700 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full">
                Curated Opportunities
              </span>
              <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-[#141414]">
                Featured real-world projects.
              </h2>
              <p className="text-[#141414]/70 text-base sm:text-lg">
                Browse active project briefs posted by businesses seeking individual student talent and cross-functional teams.
              </p>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-white/80 text-[#141414] border border-[#141414]/15 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>View All Projects</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-[#141414]/15 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#141414] transition-all flex flex-col justify-between space-y-8"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-xs font-semibold border border-indigo-100">
                      {project.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      {formatINR(project.budgetAmount)}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <h3 className="font-display font-bold text-2xl text-[#141414] hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs font-mono text-[#141414]/60">
                      {project.businessName} • {project.arrangement}
                    </p>
                    <p className="text-sm text-[#141414]/70 line-clamp-3 leading-relaxed pt-1">
                      {project.shortDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.requiredSkills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-lg bg-[#F4F0E8] text-[#141414]/80 text-xs font-mono border border-[#141414]/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#141414]/10 flex items-center justify-between">
                  <span className="text-xs font-mono text-[#141414]/60">{project.durationWeeks} weeks duration</span>
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="text-xs font-mono font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Brief</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cinematic Closing Section (Ink Black) */}
      <section className="py-28 bg-[#141414] text-[#F4F0E8] relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center space-y-10 relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-indigo-400 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Begin Your Journey</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-white">
            Ready to build your real-world portfolio?
          </h2>

          <p className="text-[#141414]/70 text-base sm:text-xl max-w-2xl mx-auto text-[#F4F0E8]/70">
            Connect with forward-thinking businesses, form high-performing student squads, and showcase your engineering or design capabilities.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-5 pt-6">
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-3 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer hover:scale-105"
            >
              <span>Get Started as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/business/projects/new')}
              className="px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold flex items-center gap-3 transition-all cursor-pointer hover:border-white/30"
            >
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Post a Project as Business</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
