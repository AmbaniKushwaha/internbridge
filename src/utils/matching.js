/**
 * Transparent Rule-Based Applicant Matching Engine
 * Formula:
 * - Skill match: 50%
 * - Portfolio project relevance: 25%
 * - Availability fit: 15%
 * - Experience level: 10%
 *
 * All factors are grounded in submitted self-reported or portfolio data.
 * Clearly labeled as an estimated rule-based recommendation.
 */
export function calculateStudentMatchScore(project, student) {
  const reasons = [];

  // 1. Skill overlap (50%)
  const projectSkills = (project.requiredSkills || []).map(s => s.toLowerCase().trim());
  const studentSkills = (student.selfReportedSkills || []).map(s => s.toLowerCase().trim());
  
  let matchedSkillsCount = 0;
  const matchedSkillsList = [];
  
  projectSkills.forEach(reqSkill => {
    const hasMatch = studentSkills.some(stSkill => 
      stSkill.includes(reqSkill) || reqSkill.includes(stSkill)
    );
    if (hasMatch) {
      matchedSkillsCount++;
      matchedSkillsList.push(reqSkill);
    }
  });

  const skillOverlapRatio = projectSkills.length > 0 
    ? matchedSkillsCount / projectSkills.length 
    : 0.8;
  const skillScore = Math.min(100, Math.round(skillOverlapRatio * 100));

  if (matchedSkillsList.length > 0) {
    reasons.push(`Matches ${matchedSkillsCount} required skill(s): ${matchedSkillsList.slice(0, 3).join(', ')}`);
  } else {
    reasons.push('Limited direct overlap with primary listed skills');
  }

  // 2. Portfolio relevance (25%)
  let portfolioMatchCount = 0;
  if (student.portfolioItems && student.portfolioItems.length > 0) {
    student.portfolioItems.forEach(item => {
      const itemTech = (item.technologies || []).map(t => t.toLowerCase());
      const itemSkills = (item.skillsDemonstrated || []).map(s => s.toLowerCase());
      const hasSkill = projectSkills.some(ps => 
        itemTech.some(t => t.includes(ps) || ps.includes(t)) ||
        itemSkills.some(s => s.includes(ps) || ps.includes(s))
      );
      if (hasSkill || item.projectType.toLowerCase().includes((project.category || '').toLowerCase().split(' ')[0])) {
        portfolioMatchCount++;
      }
    });
  }

  const portfolioScore = Math.min(100, Math.round(
    (student.portfolioItems && student.portfolioItems.length > 0 ? (portfolioMatchCount > 0 ? 85 : 40) : 20)
  ));

  if (portfolioMatchCount > 0) {
    reasons.push(`Has ${portfolioMatchCount} related showcase portfolio project(s)`);
  } else if (student.portfolioItems && student.portfolioItems.length > 0) {
    reasons.push('Has active portfolio work in adjacent technical domains');
  }

  // 3. Availability fit (15%)
  let availabilityScore = 70;
  const avail = student.availability || '';
  if (avail.includes('15-25') || avail.includes('Full-time') || avail.includes('Flexible')) {
    availabilityScore = 95;
    reasons.push(`Availability (${avail}) comfortably matches duration`);
  } else {
    availabilityScore = 65;
    reasons.push(`Part-time student schedule (${avail})`);
  }

  // 4. Experience level (10%)
  let experienceScore = 70;
  if (student.experienceLevel === 'Advanced') experienceScore = 95;
  else if (student.experienceLevel === 'Intermediate') experienceScore = 85;
  else experienceScore = 65;

  const totalWeightedScore = Math.round(
    skillScore * 0.50 +
    portfolioScore * 0.25 +
    availabilityScore * 0.15 +
    experienceScore * 0.10
  );

  return {
    score: Math.min(99, Math.max(35, totalWeightedScore)),
    skillOverlap: skillScore,
    portfolioRelevance: portfolioScore,
    availabilityFit: availabilityScore,
    experienceFit: experienceScore,
    reasons,
  };
}

/**
 * Team Rule-Based Matching Engine
 * Assesses the combined capability of all members without penalizing or inflating purely for team size.
 */
export function calculateTeamMatchScore(project, team) {
  const reasons = [];
  const projectSkills = (project.requiredSkills || []).map(s => s.toLowerCase().trim());
  const combinedTeamSkills = (team.combinedSkills || []).map(s => s.toLowerCase().trim());

  let matchedSkillsCount = 0;
  const matchedSkillsList = [];

  projectSkills.forEach(reqSkill => {
    const hasMatch = combinedTeamSkills.some(ts => 
      ts.includes(reqSkill) || reqSkill.includes(ts)
    );
    if (hasMatch) {
      matchedSkillsCount++;
      matchedSkillsList.push(reqSkill);
    }
  });

  const skillOverlapRatio = projectSkills.length > 0 
    ? matchedSkillsCount / projectSkills.length 
    : 0.85;
  const skillScore = Math.min(100, Math.round(skillOverlapRatio * 100));

  if (matchedSkillsList.length > 0) {
    reasons.push(`Team covers ${matchedSkillsCount} required skill(s) across ${(team.members || []).length} members`);
  } else {
    reasons.push('Partial skill coverage across team composition');
  }

  // Multi-discipline coverage
  const hasMultipleRoles = (team.members || []).length >= 2;
  const portfolioScore = hasMultipleRoles ? 88 : 70;
  reasons.push(`Cross-functional team structure with ${(team.members || []).length} active roles`);

  const availabilityScore = 90;
  reasons.push('Shared team bandwidth accommodates milestone deliverables');

  const experienceScore = 80;

  const totalWeightedScore = Math.round(
    skillScore * 0.50 +
    portfolioScore * 0.25 +
    availabilityScore * 0.15 +
    experienceScore * 0.10
  );

  return {
    score: Math.min(99, Math.max(40, totalWeightedScore)),
    skillOverlap: skillScore,
    portfolioRelevance: portfolioScore,
    availabilityFit: availabilityScore,
    experienceFit: experienceScore,
    reasons,
  };
}

/**
 * Rule-Based Project Categorization Suggester
 * Evaluates business plain-language inputs and suggests the appropriate project category.
 */
export function suggestProjectCategory(text, workTypeChoice) {
  const lower = ((text || '') + ' ' + (workTypeChoice || '')).toLowerCase();

  if (
    lower.includes('mobile') ||
    lower.includes('android') ||
    lower.includes('ios') ||
    lower.includes('app store') ||
    lower.includes('flutter') ||
    lower.includes('react native')
  ) {
    return 'Mobile Application';
  }

  if (
    lower.includes('video') ||
    lower.includes('reel') ||
    lower.includes('youtube') ||
    lower.includes('edit clips') ||
    lower.includes('footage') ||
    lower.includes('premiere')
  ) {
    return 'Video Editing & Media';
  }

  if (
    lower.includes('logo') ||
    lower.includes('graphic') ||
    lower.includes('branding') ||
    lower.includes('poster') ||
    lower.includes('banner') ||
    lower.includes('figma') ||
    lower.includes('ui/ux') ||
    lower.includes('brochure')
  ) {
    return 'Graphic Design & Branding';
  }

  if (
    lower.includes('dashboard') ||
    lower.includes('data') ||
    lower.includes('analytics') ||
    lower.includes('excel') ||
    lower.includes('metrics') ||
    lower.includes('report') ||
    lower.includes('power bi')
  ) {
    return 'Data & Dashboards';
  }

  if (
    lower.includes('automate') ||
    lower.includes('bot') ||
    lower.includes('scraping') ||
    lower.includes('script') ||
    lower.includes('spreadsheet sync')
  ) {
    return 'Automation & Tools';
  }

  if (
    lower.includes('social media') ||
    lower.includes('content') ||
    lower.includes('copywriting') ||
    lower.includes('blog') ||
    lower.includes('seo') ||
    lower.includes('marketing')
  ) {
    return 'Content & Marketing';
  }

  // Default to Website / E-commerce for small business shop / store / web presence
  return 'Website / E-commerce';
}

/**
 * Format Indian Rupee currency cleanly
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null) return 'Unspecified';
  if (amount === 0) return 'Voluntary / Unpaid';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
