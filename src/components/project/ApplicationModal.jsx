import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatINR } from '../../utils/matching';
import { User, Users, CheckCircle2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ApplicationModal = ({ project, isOpen, onClose }) => {
  const { currentStudent, teams, applyToProject, applications } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [applicantType, setApplicantType] = useState('individual');
  const [selectedTeamId, setSelectedTeamId] = useState(() => {
    // default to first team student leads or is part of
    const studentTeam = teams.find(t => t.members.some(m => m.studentId === currentStudent?.id));
    return studentTeam ? studentTeam.id : teams[0]?.id || '';
  });

  // Application Form State
  const [proposalText, setProposalText] = useState(
    'I have reviewed your project requirements and can deliver high quality results on time. I have direct experience with similar workflows as showcased in my portfolio.'
  );
  const [highlightedPortfolioProject, setHighlightedPortfolioProject] = useState(
    currentStudent?.portfolioItems?.[0]?.title || ''
  );
  const [availability, setAvailability] = useState(currentStudent?.availability || '15-25 hrs/week');
  const [estimatedTimeline, setEstimatedTimeline] = useState(`${project.durationWeeks} weeks`);
  const [notes, setNotes] = useState('Available for a weekly sync to provide progress updates.');
  const [errorMsg, setErrorMsg] = useState('');

  // Check if student already applied
  const alreadyAppliedIndividual = applications.some(
    a => a.projectId === project.id && a.applicantType === 'individual' && a.studentId === currentStudent?.id
  );

  const studentTeams = teams.filter(t => t.members.some(m => m.studentId === currentStudent?.id));
  const activeTeam = teams.find(t => t.id === selectedTeamId);

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      if (applicantType === 'team' && studentTeams.length === 0) {
        setErrorMsg('You do not belong to any teams yet. Create a team first or apply as an individual.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!proposalText.trim() || proposalText.length < 20) {
        setErrorMsg('Please write a brief proposal (at least 20 characters) explaining your approach.');
        return;
      }
      setStep(4);
    }
  };

  const handleSubmit = () => {
    const success = applyToProject({
      projectId: project.id,
      applicantType,
      teamId: applicantType === 'team' ? selectedTeamId : undefined,
      proposalText,
      relevantSkills: applicantType === 'team' && activeTeam
        ? activeTeam.combinedSkills.slice(0, 5)
        : (currentStudent?.selfReportedSkills || []).slice(0, 5),
      highlightedPortfolioProject,
      availability,
      estimatedTimeline,
      notes,
    });

    if (success) {
      onClose();
      navigate('/student/applications');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Apply to "${project.title}"`}
      description={`Submitted to ${project.businessName} · Budget: ${formatINR(project.budgetAmount)}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <span>Step {step} of 4:</span>
            <span className="text-indigo-600 font-bold">
              {step === 1 && 'Select Application Type'}
              {step === 2 && 'Review Profile & Team'}
              {step === 3 && 'Proposal & Milestones'}
              {step === 4 && 'Review & Confirm'}
            </span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`w-6 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Step 1: Select Individual vs Team */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-600">
              Decide whether you can complete this project on your own or prefer to apply as an assembled student team.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Option A: Individual */}
              <div
                onClick={() => setApplicantType('individual')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  applicantType === 'individual'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    applicantType === 'individual' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Apply Individually</div>
                    <div className="text-[11px] text-slate-500">As {currentStudent?.name}</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Submit your personal portfolio, college background, and individual availability.
                </p>
                {alreadyAppliedIndividual && (
                  <div className="text-[11px] text-amber-700 mt-2 font-medium">
                    ⚠️ You already submitted an individual application.
                  </div>
                )}
              </div>

              {/* Option B: Team */}
              <div
                onClick={() => setApplicantType('team')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  applicantType === 'team'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    applicantType === 'team' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Apply as a Team</div>
                    <div className="text-[11px] text-slate-500">{studentTeams.length} squad(s) available</div>
                  </div>
                </div>
                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  Pool members, combined skills, and collective bandwidth for larger deliverables.
                </p>
                {studentTeams.length === 0 && (
                  <div className="text-[11px] text-slate-400 mt-2">
                    (No teams joined yet. You can create one in Dashboard)
                  </div>
                )}
              </div>
            </div>

            {applicantType === 'team' && studentTeams.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-800">Select Squad to Represent:</label>
                <select
                  value={selectedTeamId}
                  onChange={e => setSelectedTeamId(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 bg-white"
                >
                  {studentTeams.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.members.length} members)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Preview Applicant Data */}
        {step === 2 && (
          <div className="space-y-4">
            {applicantType === 'individual' ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={currentStudent?.avatar}
                    alt={currentStudent?.name}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentStudent?.name}</div>
                    <div className="text-[11px] text-slate-500">{currentStudent?.college}</div>
                    <div className="text-[11px] text-slate-500">{currentStudent?.course}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Skills presented: </span>
                  {(currentStudent?.selfReportedSkills || []).join(' · ')}
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Standard availability: </span>
                  {currentStudent?.availability} ({currentStudent?.preferredArrangement})
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={activeTeam?.avatar}
                    alt={activeTeam?.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{activeTeam?.name}</div>
                    <div className="text-[11px] text-slate-500">{activeTeam?.members.length} Confirmed Members</div>
                    <div className="text-[11px] text-slate-500">Lead: {activeTeam?.leaderName}</div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-800">Proposed Team Members & Roles:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeTeam?.members.map(m => (
                      <div key={m.studentId} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 text-xs">
                        <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 truncate">{m.name}</div>
                          <div className="text-[10px] text-slate-500 truncate">{m.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-600 pt-1">
                  <span className="font-semibold text-slate-800">Combined Squad Skills: </span>
                  {(activeTeam?.combinedSkills || []).join(' · ')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Proposal and Highlights */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 mb-1">
                Project Approach & Proposal <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={proposalText}
                onChange={e => setProposalText(e.target.value)}
                placeholder="Explain how you will approach this project, milestones, and why you are qualified..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <span className="text-[11px] text-slate-400">
                Be specific about how you satisfy the business requirements.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Highlight Portfolio Project
                </label>
                <input
                  type="text"
                  value={highlightedPortfolioProject}
                  onChange={e => setHighlightedPortfolioProject(e.target.value)}
                  placeholder="e.g. Local Kirana Order System"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Estimated Completion Timeline
                </label>
                <input
                  type="text"
                  value={estimatedTimeline}
                  onChange={e => setEstimatedTimeline(e.target.value)}
                  placeholder="e.g. 3.5 weeks"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Weekly Availability
                </label>
                <input
                  type="text"
                  value={availability}
                  onChange={e => setAvailability(e.target.value)}
                  placeholder="e.g. 15-20 hrs/week"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Additional Notes (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Can start on Monday"
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Final Confirmation */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-900 text-sm">Application Summary</div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-800">
                  {applicantType === 'individual' ? currentStudent?.name : activeTeam?.name + ' (Squad)'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Target Project:</span>
                <span className="font-semibold text-slate-800">{project.title}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Timeline:</span>
                <span className="font-semibold text-slate-800">{estimatedTimeline}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Availability:</span>
                <span className="font-semibold text-slate-800">{availability}</span>
              </div>
              <div className="pt-2 text-slate-600">
                <span className="font-semibold text-slate-800 block mb-1">Proposal:</span>
                <p className="line-clamp-3 italic">"{proposalText}"</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              By submitting, your profile details, portfolio items, and proposed timeline will be delivered directly to the business console for review.
            </p>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};
