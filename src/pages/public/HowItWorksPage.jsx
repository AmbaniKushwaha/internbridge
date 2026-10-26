import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserCheck,
  Compass,
  Users,
  Award,
  FileSpreadsheet,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const HowItWorksPage = () => {
  const [activeTab, setActiveTab] = useState('student');
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="indigo">Architecture & Lifecycle</Badge>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          How InternBridge Operates
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
          InternBridge simplifies collaboration between college students and regional businesses. Select your pathway below to inspect the step-by-step cycle.
        </p>

        {/* Tab Toggle */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('student')}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'student'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              The Student Pathway
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`px-6 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'business'
                  ? 'bg-white text-teal-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              The Business Pathway
            </button>
          </div>
        </div>
      </div>

      {/* Student Pathway Details */}
      {activeTab === 'student' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm font-mono border border-indigo-100">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">Build Your Profile & Showcase</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Add your college, course, self-reported skills, and highlight your best academic or personal projects. No paid certifications or prior full-time experience required.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Honest self-reported skill tagging and portfolio evidence.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm font-mono border border-indigo-100">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Discover Real Client Briefs</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Browse projects posted by Indian stores, D2C startups, and regional businesses. Filter by skills, INR budget ranges, and duration that matches your exam schedule.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Clear expectations, deliverables, and compensation terms.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm font-mono border border-indigo-100">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Apply Solo or Form a Squad</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tackle small briefs alone, or create a squad with peers (frontend developer + UI designer + content writer) to take on ambitious full-stack deliverables.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Multi-student applications with clear individual role definitions.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black flex items-center justify-center text-sm font-mono border border-indigo-100">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900">Deliver Milestones & Get Verified</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Once selected by the business, collaborate on agreed milestones. Complete the project, receive compensation, and add proven outcomes to your portfolio.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Concrete reference proof for placements and job interviews.
              </div>
            </Card>
          </div>

          {/* Student CTA banner */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-indigo-950">Ready to start building?</h3>
              <p className="text-xs sm:text-sm text-indigo-700 max-w-xl">
                Explore real business projects looking for college developers and designers right now.
              </p>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/projects')}
              icon={Compass}
              iconRight={ArrowRight}
            >
              Explore Projects
            </Button>
          </div>
        </div>
      )}

      {/* Business Pathway Details */}
      {activeTab === 'business' && (
        <div className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-black flex items-center justify-center text-sm font-mono border border-teal-100">
                  01
                </div>
                <h3 className="text-base font-bold text-slate-900">Post in Plain Everyday Language</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Use our guided 5-step wizard. You don't need technical knowledge—simply describe what business problem you are trying to solve and what outcome you want.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Rule engine recommends category and suggested skills.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-black flex items-center justify-center text-sm font-mono border border-teal-100">
                  02
                </div>
                <h3 className="text-base font-bold text-slate-900">Receive Relevant Applications</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Students and organized squads submit proposals. Our client-side algorithm ranks applicants using transparent matching criteria (skill overlap, portfolio relevance, availability).
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Objective match score breakdowns explain why a student fits.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-black flex items-center justify-center text-sm font-mono border border-teal-100">
                  03
                </div>
                <h3 className="text-base font-bold text-slate-900">Shortlist & Select Finalists</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Review applicant proposal details, inspect GitHub and live demo links, shortlist contenders, and select your preferred candidate or team in one click.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Transparent candidate evaluation and direct selection flow.
              </div>
            </Card>

            <Card className="p-6 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 font-black flex items-center justify-center text-sm font-mono border border-teal-100">
                  04
                </div>
                <h3 className="text-base font-bold text-slate-900">Ship Real Deliverables</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Work directly with motivated students eager to deliver high quality to build their reputation. Receive your website, mobile app, designs, or data models.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
                Key: Cost-effective technical execution with enthusiastic young talent.
              </div>
            </Card>
          </div>

          {/* Business CTA banner */}
          <div className="bg-teal-50/70 border border-teal-100 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-xl font-bold text-teal-950">Have a project waiting to be built?</h3>
              <p className="text-xs sm:text-sm text-teal-800 max-w-xl">
                Post your brief in 3 minutes and receive proposals from capable student teams.
              </p>
            </div>
            <Button
              variant="teal"
              size="lg"
              onClick={() => navigate('/business/projects/new')}
              icon={Briefcase}
              iconRight={ArrowRight}
            >
              Post a Business Brief
            </Button>
          </div>
        </div>
      )}

      {/* Transparent Match Algorithm Explanation Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 space-y-6 shadow-sm">
        <div className="space-y-2">
          <Badge variant="indigo">Transparent Matching Engine</Badge>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How InternBridge Calculates Match Scores
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Our match engine does not use black-box artificial intelligence. Match percentages are calculated deterministically using client-side rule weights:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-700 text-sm">50% Skill Match</div>
            <p className="text-slate-600 leading-relaxed">
              Compares the project's required skills with the student's self-reported capabilities or a squad's combined skillset.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-700 text-sm">25% Portfolio Relevance</div>
            <p className="text-slate-600 leading-relaxed">
              Examines submitted showcase projects for domain alignment with the brief (e.g. past e-commerce experience for an online store).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-700 text-sm">15% Availability Fit</div>
            <p className="text-slate-600 leading-relaxed">
              Ensures the student or squad has sufficient declared weekly hours to meet the project's estimated duration and delivery timeline.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-indigo-700 text-sm">10% Experience Depth</div>
            <p className="text-slate-600 leading-relaxed">
              Considers self-declared experience levels and working arrangement preferences (Remote, Hybrid, or On-site).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
