import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { suggestProjectCategory, formatINR } from '../../utils/matching';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Globe,
  Smartphone,
  Palette,
  Video,
  FileSpreadsheet,
  Cog,
  PenTool,
} from 'lucide-react';

const WORK_TYPES = [
  { id: 'website', label: 'Website or Online Store', icon: Globe, desc: 'E-commerce catalogs, business landing pages, client portals' },
  { id: 'mobile', label: 'Mobile Application', icon: Smartphone, desc: 'Android or iOS prototypes, utility apps, field workflows' },
  { id: 'design', label: 'Graphic Design & Branding', icon: Palette, desc: 'Logos, packaging labels, marketing brochures, brand books' },
  { id: 'video', label: 'Video Editing & Social Media', icon: Video, desc: 'Reels, YouTube product explainers, motion graphics' },
  { id: 'dashboard', label: 'Data Analysis & Dashboard', icon: FileSpreadsheet, desc: 'Inventory models, operations dashboards, sales trackers' },
  { id: 'automation', label: 'Automation & Internal Tools', icon: Cog, desc: 'Spreadsheet synchronization, scraping, invoice parsing' },
  { id: 'content', label: 'Content Strategy & Copy', icon: PenTool, desc: 'SEO articles, product copy, social media calendars' },
];

export const PostProjectWizard = () => {
  const { createProject } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // Step 1: Plain Language Description
  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [problemGoal, setProblemGoal] = useState('');
  const [expectedResult, setExpectedResult] = useState('');

  // Step 2: Work Type
  const [selectedWorkType, setSelectedWorkType] = useState('website');

  // Step 3: Conditional Details
  // For Website
  const [webNeedAuth, setWebNeedAuth] = useState(false);
  const [webNeedForms, setWebNeedForms] = useState(true);
  const [webNeedPayment, setWebNeedPayment] = useState(false);
  const [webHasDesign, setWebHasDesign] = useState(false);
  // For Mobile
  const [mobilePlatform, setMobilePlatform] = useState('Android & iOS (Flutter / React Native)');
  const [mobileNeedOffline, setMobileNeedOffline] = useState(true);
  // For Video
  const [videoCount, setVideoCount] = useState('5 to 10 short clips');
  const [videoHasFootage, setVideoHasFootage] = useState(true);
  // For Design
  const [designItems, setDesignItems] = useState('Logo, packaging labels, and digital brand guide');
  // For Dashboard
  const [dashboardDataSource, setDashboardDataSource] = useState('Excel / Google Sheets and CSV logs');

  // Step 4: Timeline & Budget
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [budgetAmount, setBudgetAmount] = useState(20000);
  const [compensationType, setCompensationType] = useState('Fixed Budget');
  const [arrangement, setArrangement] = useState('Remote');
  const [deadline, setDeadline] = useState('2026-11-30');

  // Step 5: Category Review (Auto-suggested via Rule Engine)
  const [suggestedCategory, setSuggestedCategory] = useState('Website / E-commerce');
  const [validationError, setValidationError] = useState('');

  const handleNext = () => {
    setValidationError('');

    if (step === 1) {
      if (!title.trim() || !shortDescription.trim() || !problemGoal.trim()) {
        setValidationError('Please complete the project title, plain-language description, and goal.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      setStep(4);
    } else if (step === 4) {
      // Auto-compute rule-based category recommendation for Step 5
      const computedCategory = suggestProjectCategory(
        title + ' ' + shortDescription + ' ' + problemGoal,
        selectedWorkType
      );
      setSuggestedCategory(computedCategory);
      setStep(5);
    }
  };

  const handlePublish = async () => {
    // Generate synthesized deliverables based on wizard inputs
    const deliverables = [];
    if (selectedWorkType === 'website') {
      deliverables.push('Responsive web interface for desktop and mobile browsers');
      if (webNeedForms) deliverables.push('Customer contact or inquiry form submission handling');
      if (webNeedAuth) deliverables.push('User account registration and login authentication');
      if (webNeedPayment) deliverables.push('Online payment gateway checkout integration');
      deliverables.push('Final source code repository and deployment guidance');
    } else if (selectedWorkType === 'mobile') {
      deliverables.push(`Cross-platform mobile application build for ${mobilePlatform}`);
      if (mobileNeedOffline) deliverables.push('Local offline database caching and queue synchronization');
      deliverables.push('Interactive mobile prototype and APK/TestFlight testing build');
    } else if (selectedWorkType === 'video') {
      deliverables.push(`${videoCount} finalized vertical and horizontal video exports`);
      deliverables.push('Sound design, kinetic subtitles, and synchronized audio track');
      deliverables.push('Master video project files in Premiere Pro / DaVinci Resolve format');
    } else if (selectedWorkType === 'design') {
      deliverables.push(designItems);
      deliverables.push('Print-ready vector PDF files and editable Figma component kit');
      deliverables.push('Cohesive typography and color palette brand guide');
    } else {
      deliverables.push(`Interactive dashboard integrating ${dashboardDataSource}`);
      deliverables.push('Executive KPI summary view with filterable charts');
      deliverables.push('Automated data sync pipeline and user guide');
    }

    // Auto-infer required skills from work type
    let requiredSkills = [];
    if (selectedWorkType === 'website') requiredSkills = ['React', 'JavaScript', 'Tailwind CSS', 'Responsive Design', 'REST APIs'];
    else if (selectedWorkType === 'mobile') requiredSkills = ['Flutter', 'React Native', 'Mobile UI', 'Offline Storage', 'Firebase'];
    else if (selectedWorkType === 'video') requiredSkills = ['Adobe Premiere Pro', 'After Effects', 'Video Editing', 'Motion Graphics', 'Sound Design'];
    else if (selectedWorkType === 'design') requiredSkills = ['Figma', 'Graphic Design', 'Brand Identity', 'Adobe Illustrator', 'Typography'];
    else if (selectedWorkType === 'dashboard') requiredSkills = ['Python', 'SQL', 'Data Visualization', 'Pandas', 'Excel / CSV Processing'];
    else requiredSkills = ['JavaScript', 'Python', 'Automation', 'Problem Solving'];

    await createProject({
      title,
      category: suggestedCategory,
      shortDescription,
      problemGoal,
      expectedResult: expectedResult || 'Production-ready milestone deliverables as agreed with business.',
      requiredSkills,
      deliverables,
      compensationType,
      budgetAmount: compensationType === 'Unpaid / Voluntary' ? 0 : Number(budgetAmount),
      durationWeeks: Number(durationWeeks),
      arrangement,
      applicationDeadline: deadline,
    });

    navigate('/business/projects');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/business/dashboard"
          className="text-xs font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Business Dashboard</span>
        </Link>

        <span className="text-xs text-slate-500 font-medium">
          Step <strong>{step}</strong> of 5
        </span>
      </div>

      {/* Header & Progress Indicator */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Post a Business Project</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Describe what you need in plain, simple language. No technical jargon required.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all ${
                s <= step ? 'bg-teal-700' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
          {validationError}
        </div>
      )}

      {/* Step 1: Plain Language */}
      {step === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Step 1: What do you want to build?</h2>
            <p className="text-xs text-slate-500">
              Explain the problem you want to solve in everyday business words.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Online Product Catalog for Local Handicrafts"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              One-Sentence Summary <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={shortDescription}
              onChange={e => setShortDescription(e.target.value)}
              placeholder="e.g. Build a clean web catalog where buyers can view brass decor items and submit orders via WhatsApp."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              What business problem or goal are you tackling? <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={problemGoal}
              onChange={e => setProblemGoal(e.target.value)}
              placeholder="Describe what is currently happening and why you need help. (e.g. We currently share pictures manually on phone chats, which leads to confusion and lost customer inquiries...)"
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">
              What should the final outcome be?
            </label>
            <textarea
              rows={2}
              value={expectedResult}
              onChange={e => setExpectedResult(e.target.value)}
              placeholder="e.g. A fast mobile-friendly website where buyers can see prices, filter categories, and submit a quote form."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>
      )}

      {/* Step 2: Work Type Selection */}
      {step === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Step 2: What kind of work is needed?</h2>
            <p className="text-xs text-slate-500">
              Select the primary deliverable category that best represents this project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {WORK_TYPES.map(wt => {
              const Icon = wt.icon;
              const isSelected = selectedWorkType === wt.id;

              return (
                <div
                  key={wt.id}
                  onClick={() => setSelectedWorkType(wt.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{wt.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{wt.desc}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3: Conditional Follow-up Questions */}
      {step === 3 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Step 3: What should the final result include?</h2>
            <p className="text-xs text-slate-500">
              Answer simple follow-up questions tailored to your selected work type.
            </p>
          </div>

          {selectedWorkType === 'website' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Should customers submit forms or orders?</span>
                  <span className="text-slate-500 text-[11px]">Allow buyers to send inquiries or build item carts.</span>
                </div>
                <input
                  type="checkbox"
                  checked={webNeedForms}
                  onChange={e => setWebNeedForms(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Should users be able to log in or create accounts?</span>
                  <span className="text-slate-500 text-[11px]">Customer profile and login authentication.</span>
                </div>
                <input
                  type="checkbox"
                  checked={webNeedAuth}
                  onChange={e => setWebNeedAuth(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Is online payment gateway needed?</span>
                  <span className="text-slate-500 text-[11px]">Direct UPI / NetBanking transaction handling.</span>
                </div>
                <input
                  type="checkbox"
                  checked={webNeedPayment}
                  onChange={e => setWebNeedPayment(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Do you already have visual designs or brand colors?</span>
                  <span className="text-slate-500 text-[11px]">Whether student designers need to craft mockups from scratch.</span>
                </div>
                <input
                  type="checkbox"
                  checked={webHasDesign}
                  onChange={e => setWebHasDesign(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>
            </div>
          )}

          {selectedWorkType === 'mobile' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Target Operating Systems:</label>
                <select
                  value={mobilePlatform}
                  onChange={e => setMobilePlatform(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Android & iOS (Flutter / React Native)">Both Android & iOS</option>
                  <option value="Android Only">Android Only</option>
                  <option value="iOS Only">iOS Only</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Does the app need to work offline?</span>
                  <span className="text-slate-500 text-[11px]">Save data locally when network is unavailable.</span>
                </div>
                <input
                  type="checkbox"
                  checked={mobileNeedOffline}
                  onChange={e => setMobileNeedOffline(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>
            </div>
          )}

          {selectedWorkType === 'video' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">How many videos do you need?</label>
                <input
                  type="text"
                  value={videoCount}
                  onChange={e => setVideoCount(e.target.value)}
                  placeholder="e.g. 10 vertical reels (45-60 seconds each)"
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="font-semibold text-slate-900 block">Do you already have raw footage recorded?</span>
                  <span className="text-slate-500 text-[11px]">Video clips and audio ready for the editor.</span>
                </div>
                <input
                  type="checkbox"
                  checked={videoHasFootage}
                  onChange={e => setVideoHasFootage(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
              </div>
            </div>
          )}

          {selectedWorkType === 'design' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Deliverables Needed:</label>
                <input
                  type="text"
                  value={designItems}
                  onChange={e => setDesignItems(e.target.value)}
                  placeholder="e.g. Brand logo, packaging labels, and thank-you cards"
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          )}

          {selectedWorkType === 'dashboard' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Primary Data Source:</label>
                <input
                  type="text"
                  value={dashboardDataSource}
                  onChange={e => setDashboardDataSource(e.target.value)}
                  placeholder="e.g. Daily Excel sheets and Google Sheets"
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Timeline and Budget */}
      {step === 4 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Step 4: Timeline & Budget</h2>
            <p className="text-xs text-slate-500">
              Specify your schedule and compensation expectations in INR.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Estimated Duration (Weeks)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={durationWeeks}
                onChange={e => setDurationWeeks(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Target Completion Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Compensation Model
              </label>
              <select
                value={compensationType}
                onChange={e => setCompensationType(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
              >
                <option value="Fixed Budget">Fixed Budget (Milestone Payout)</option>
                <option value="Negotiable">Negotiable Budget</option>
                <option value="Unpaid / Voluntary">Unpaid / Voluntary Project</option>
              </select>
            </div>

            {compensationType !== 'Unpaid / Voluntary' && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Budget Amount (₹ INR)
                </label>
                <input
                  type="number"
                  step={1000}
                  value={budgetAmount}
                  onChange={e => setBudgetAmount(Number(e.target.value))}
                  placeholder="20000"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1">Collaboration Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {['Remote', 'Hybrid', 'On-site'].map(arr => (
                <button
                  type="button"
                  key={arr}
                  onClick={() => setArrangement(arr)}
                  className={`py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    arrangement === arr
                      ? 'border-teal-700 bg-teal-50 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {arr}
                </button>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-slate-400 border-t border-slate-100 pt-3">
            Note: InternBridge operates as a matching engine. Project terms and payouts are agreed directly between your business and the selected student or squad.
          </p>
        </div>
      )}

      {/* Step 5: Review & Publish */}
      {step === 5 && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">Step 5: Review & Publish Brief</h2>
            <p className="text-xs text-slate-500">
              Verify your project details. Our rule engine suggested the best category below based on your description.
            </p>
          </div>

          {/* Rule-Based Category Suggester Block */}
          <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-teal-900">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Suggested Project Category (Rule-Based Analysis)</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-teal-800 font-semibold">{suggestedCategory}</span>
              <select
                value={suggestedCategory}
                onChange={e => setSuggestedCategory(e.target.value)}
                className="p-1.5 rounded-lg border border-teal-300 bg-white text-xs font-medium text-slate-800"
              >
                <option value="Website / E-commerce">Website / E-commerce</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Graphic Design & Branding">Graphic Design & Branding</option>
                <option value="Video Editing & Media">Video Editing & Media</option>
                <option value="Data & Dashboards">Data & Dashboards</option>
                <option value="Automation & Tools">Automation & Tools</option>
                <option value="Content & Marketing">Content & Marketing</option>
              </select>
            </div>
            <p className="text-[11px] text-teal-700">
              You can override this category if another classification is more appropriate.
            </p>
          </div>

          {/* Summary Details */}
          <div className="space-y-3 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Project Title:</span>
              <span className="font-bold text-slate-900">{title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Duration:</span>
              <span className="font-semibold text-slate-800">{durationWeeks} weeks</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Target Deadline:</span>
              <span className="font-semibold text-slate-800">{deadline}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Compensation:</span>
              <span className="font-bold text-slate-900 tabular-nums">
                {formatINR(compensationType === 'Unpaid / Voluntary' ? 0 : budgetAmount)} ({compensationType})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200">
              <span className="text-slate-500">Arrangement:</span>
              <span className="font-semibold text-slate-800">{arrangement}</span>
            </div>
            <div className="pt-2 text-slate-600">
              <span className="font-semibold text-slate-800 block mb-0.5">Problem / Goal:</span>
              <p className="italic leading-relaxed">"{problemGoal}"</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {step > 1 ? (
          <button
            onClick={() => setStep(step - 1)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous Step</span>
          </button>
        ) : (
          <Link
            to="/business/dashboard"
            className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </Link>
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <button
            onClick={handlePublish}
            className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Publish Project Brief</span>
          </button>
        )}
      </div>
    </div>
  );
};
