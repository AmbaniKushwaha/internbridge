import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USERS,
  INITIAL_STUDENTS,
  INITIAL_BUSINESSES,
  INITIAL_PROJECTS,
  INITIAL_TEAMS,
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';
import { calculateStudentMatchScore, calculateTeamMatchScore } from '../utils/matching';
import { api } from '../services/api';

const AppContext = createContext(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'internbridge_current_user_v1',
  STUDENTS: 'internbridge_students_v1',
  BUSINESSES: 'internbridge_businesses_v1',
  PROJECTS: 'internbridge_projects_v1',
  TEAMS: 'internbridge_teams_v1',
  APPLICATIONS: 'internbridge_applications_v1',
  NOTIFICATIONS: 'internbridge_notifications_v1',
  SAVED_PROJECTS: 'internbridge_saved_projects_v1',
  SAVED_APPLICANTS: 'internbridge_saved_applicants_v1',
};

// ============================================================================
// Normalization Helpers to bridge MongoDB _id schemas with UI expectations
// ============================================================================

export const normalizeProject = (p) => ({
  id: p._id || p.id,
  _id: p._id || p.id,
  title: p.title || 'Untitled Project Brief',
  category: p.category || 'Website / E-commerce',
  budgetAmount: Number(p.budgetAmount) || 0,
  durationWeeks: Number(p.durationWeeks) || 4,
  compensationType: p.compensationType || (Number(p.budgetAmount) > 0 ? 'Fixed Stamped Milestone' : 'Unpaid / Voluntary'),
  shortDescription: p.shortDescription || '',
  fullDescription: p.fullDescription || p.shortDescription || '',
  deliverables: Array.isArray(p.deliverables) ? p.deliverables : [],
  requiredSkills: Array.isArray(p.requiredSkills) ? p.requiredSkills : [],
  arrangement: p.arrangement || 'Remote',
  status: p.status || 'Open',
  applicantCount: Number(p.applicantCount) || 0,
  businessId: p.business?._id || p.businessId || 'biz-1',
  businessName: p.business?.companyName || p.business?.name || p.businessName || 'Business Client',
  businessLogo: p.business?.user?.avatar || p.businessLogo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
  businessLocation: p.business?.location || p.businessLocation || 'Remote / India',
  selectedApplicantId: p.selectedApplicantId,
  selectedApplicantType: p.selectedApplicantType,
  createdAt: p.createdAt || new Date().toISOString(),
});

export const normalizeStudent = (s) => ({
  id: s._id || s.id,
  _id: s._id || s.id,
  userId: s.user?._id || s.user || s.userId,
  name: s.user?.name || s.name || 'Student Freelancer',
  email: s.user?.email || s.email || '',
  avatar: s.user?.avatar || s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  college: s.college || '',
  course: s.course || '',
  graduationYear: s.graduationYear || 2026,
  bio: s.bio || '',
  selfReportedSkills: Array.isArray(s.selfReportedSkills) ? s.selfReportedSkills : [],
  interests: Array.isArray(s.interests) ? s.interests : [],
  availability: s.availability || '15-25 hrs/week',
  preferredArrangement: s.preferredArrangement || 'Remote',
  preferredProjectTypes: Array.isArray(s.preferredProjectTypes) ? s.preferredProjectTypes : ['Website / E-commerce'],
  experienceLevel: s.experienceLevel || 'Intermediate',
  githubUrl: s.githubUrl || '',
  linkedinUrl: s.linkedinUrl || '',
  websiteUrl: s.websiteUrl || '',
  completedProjectsCount: Number(s.completedProjectsCount) || 0,
  portfolioItems: (s.portfolioItems || []).map((item) => ({
    id: item._id || item.id,
    _id: item._id || item.id,
    title: item.title,
    description: item.description,
    projectType: item.projectType || 'Web Development',
    technologies: Array.isArray(item.technologies) ? item.technologies : [],
    skillsDemonstrated: Array.isArray(item.skillsDemonstrated) ? item.skillsDemonstrated : [],
    githubUrl: item.githubUrl || '',
    liveUrl: item.liveUrl || '',
    personalRole: item.personalRole || 'Contributor',
  })),
});

export const normalizeTeam = (t) => ({
  id: t._id || t.id,
  _id: t._id || t.id,
  name: t.name,
  description: t.description || '',
  avatar: t.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
  leaderId: t.leader?._id || t.leader || t.leaderId,
  leaderName: t.leader?.user?.name || t.leaderName || 'Team Leader',
  projectInterests: Array.isArray(t.projectInterests) ? t.projectInterests : [],
  combinedSkills: Array.isArray(t.combinedSkills) ? t.combinedSkills : [],
  openPositions: Array.isArray(t.openPositions) ? t.openPositions : [],
  visibility: t.visibility || 'Public (Discoverable by Businesses & Students)',
  completedProjectsCount: Number(t.completedProjectsCount) || 0,
  members: (t.members || []).map((m) => ({
    studentId: m.student?._id || m.student || m.studentId,
    name: m.student?.user?.name || m.name || 'Member',
    role: m.role || 'Team Contributor',
    avatar: m.student?.user?.avatar || m.avatar || '',
    skills: m.student?.selfReportedSkills || m.skills || [],
    isLeader: Boolean(m.isLeader),
  })),
  pendingJoinRequests: (t.pendingJoinRequests || []).map((r) => ({
    studentId: r.student?._id || r.student || r.studentId,
    studentName: r.student?.user?.name || r.studentName || 'Applicant',
    studentAvatar: r.student?.user?.avatar || r.studentAvatar || '',
    skills: r.student?.selfReportedSkills || r.skills || [],
    requestDate: r.requestedAt
      ? new Date(r.requestedAt).toISOString().split('T')[0]
      : r.requestDate || new Date().toISOString().split('T')[0],
  })),
});

export const normalizeApplication = (a) => ({
  id: a._id || a.id,
  _id: a._id || a.id,
  projectId: a.project?._id || a.project || a.projectId,
  projectTitle: a.project?.title || a.projectTitle || 'Project Brief',
  businessId: a.business?._id || a.business || a.businessId,
  businessName: a.business?.companyName || a.businessName || 'Business Client',
  applicantType: a.applicantType,
  studentId: a.student?._id || a.student || a.studentId,
  studentName: a.student?.user?.name || a.studentName || '',
  studentAvatar: a.student?.user?.avatar || a.studentAvatar || '',
  teamId: a.team?._id || a.team || a.teamId,
  teamName: a.team?.name || a.teamName || '',
  teamAvatar: a.team?.avatar || a.teamAvatar || '',
  proposalText: a.proposalText || '',
  relevantSkills: Array.isArray(a.relevantSkills) ? a.relevantSkills : [],
  highlightedPortfolioProject: a.highlightedPortfolioProject || '',
  availability: a.availability || '',
  estimatedTimeline: a.estimatedTimeline || '',
  notes: a.notes || '',
  status: a.status || 'Pending',
  appliedDate: a.createdAt || a.appliedDate || new Date().toISOString(),
  matchScore: Number(a.matchScore) || 75,
  matchReasons: Array.isArray(a.matchReasons) ? a.matchReasons : [],
});

export const normalizeBusiness = (b) => ({
  id: b._id || b.id,
  _id: b._id || b.id,
  userId: b.user?._id || b.user || b.userId,
  name: b.companyName || b.name || 'Business Client',
  companyName: b.companyName || b.name || 'Business Client',
  logo: b.user?.avatar || b.logo || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
  businessType: b.businessType || 'Retail & D2C',
  description: b.description || '',
  location: b.location || 'India',
  contactPerson: b.contactPerson || b.name || 'Project Lead',
  contactEmail: b.user?.email || b.contactEmail || '',
  websiteUrl: b.websiteUrl || '',
  preferredArrangement: b.preferredArrangement || 'Remote',
  isVerified: Boolean(b.isVerified),
});

export const AppProvider = ({ children }) => {
  // Connection state indicator
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Load initial from localStorage or mockData
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [businesses, setBusinesses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUSINESSES);
      return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
    } catch {
      return INITIAL_BUSINESSES;
    }
  });

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [teams, setTeams] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TEAMS);
      return saved ? JSON.parse(saved) : INITIAL_TEAMS;
    } catch {
      return INITIAL_TEAMS;
    }
  });

  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [savedProjectIds, setSavedProjectIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECTS);
      return saved ? JSON.parse(saved) : ['proj-2'];
    } catch {
      return ['proj-2'];
    }
  });

  const [savedApplicantIds, setSavedApplicantIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SAVED_APPLICANTS);
      return saved ? JSON.parse(saved) : ['app-1'];
    } catch {
      return ['app-1'];
    }
  });

  const [toasts, setToasts] = useState([]);

  // Toast Helpers
  const addToast = useCallback((title, message = '', type = 'success') => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      else localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) { console.error(e); }
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students)); } catch (e) { console.error(e); }
  }, [students]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(businesses)); } catch (e) { console.error(e); }
  }, [businesses]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)); } catch (e) { console.error(e); }
  }, [projects]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams)); } catch (e) { console.error(e); }
  }, [teams]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications)); } catch (e) { console.error(e); }
  }, [applications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications)); } catch (e) { console.error(e); }
  }, [notifications]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SAVED_PROJECTS, JSON.stringify(savedProjectIds)); } catch (e) { console.error(e); }
  }, [savedProjectIds]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SAVED_APPLICANTS, JSON.stringify(savedApplicantIds)); } catch (e) { console.error(e); }
  }, [savedApplicantIds]);

  // Derived current profiles - matching with robust fallback across IDs and emails
  const currentStudent = currentUser?.role === 'student'
    ? students.find((s) =>
        s.userId === currentUser.id ||
        s.userId === currentUser._id ||
        s.id === currentUser.id ||
        (currentUser.email && s.email && s.email.toLowerCase() === currentUser.email.toLowerCase())
      ) || students[0]
    : null;

  const currentBusiness = currentUser?.role === 'business'
    ? businesses.find((b) =>
        b.userId === currentUser.id ||
        b.userId === currentUser._id ||
        b.id === currentUser.id ||
        (currentUser.email && b.contactEmail && b.contactEmail.toLowerCase() === currentUser.email.toLowerCase())
      ) || businesses[0]
    : null;

  // ============================================================================
  // Live Backend Data Fetching & Hydration (Dynamic MongoDB sync)
  // ============================================================================
  const syncWithBackend = useCallback(async () => {
    try {
      // 1. Check live backend health
      const healthRes = await fetch('/api/health').catch(() => null);
      if (healthRes && healthRes.ok) {
        setIsBackendConnected(true);
      } else {
        setIsBackendConnected(false);
        return;
      }

      // 2. Load live MongoDB Projects
      const projectsRes = await api.projects.getAll({ limit: 100, status: 'all' }).catch(() => null);
      if (projectsRes?.data?.projects?.length > 0) {
        const liveProjects = projectsRes.data.projects.map(normalizeProject);
        setProjects(liveProjects);
      }

      // 3. Load live MongoDB Teams
      const teamsRes = await api.teams.getAll().catch(() => null);
      if (teamsRes?.data?.teams?.length > 0) {
        const liveTeams = teamsRes.data.teams.map(normalizeTeam);
        setTeams(liveTeams);
      }

      // 4. Load live MongoDB Students
      const studentsRes = await api.students.getAll({ limit: 100 }).catch(() => null);
      if (studentsRes?.data?.students?.length > 0) {
        const liveStudents = studentsRes.data.students.map(normalizeStudent);
        setStudents(liveStudents);
      }

      // 5. Load live MongoDB Businesses
      const bizRes = await api.businesses.getAll().catch(() => null);
      if (bizRes?.data?.businesses?.length > 0) {
        const liveBiz = bizRes.data.businesses.map(normalizeBusiness);
        setBusinesses(liveBiz);
      }

      // 6. If user has active JWT token, hydrate account and user collections
      const token = localStorage.getItem('internbridge_auth_token');
      if (token) {
        const meRes = await api.auth.getMe().catch(() => null);
        if (meRes?.data?.user) {
          const u = meRes.data.user;
          const hydrated = {
            id: u._id,
            _id: u._id,
            email: u.email,
            name: u.name,
            role: u.role,
            avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            createdAt: u.createdAt,
          };
          setCurrentUser(hydrated);

          // Fetch user-specific notifications & applications
          const [notifsRes, appsRes] = await Promise.all([
            api.notifications.getMy().catch(() => null),
            api.applications.getMy().catch(() => null),
          ]);

          if (notifsRes?.data?.notifications) {
            const liveNotifs = notifsRes.data.notifications.map((n) => ({
              id: n._id || n.id,
              _id: n._id || n.id,
              userId: n.recipient,
              title: n.title,
              message: n.message,
              type: n.type,
              link: n.link,
              createdAt: n.createdAt,
              isRead: n.isRead,
            }));
            setNotifications(liveNotifs);
          }

          if (appsRes?.data?.applications) {
            const liveApps = appsRes.data.applications.map(normalizeApplication);
            setApplications(liveApps);
          }
        }
      }
    } catch (err) {
      console.warn('Backend sync in hybrid mode:', err.message);
    }
  }, []);

  useEffect(() => {
    syncWithBackend();
  }, [syncWithBackend]);

  // ============================================================================
  // Auth Operations (Backend API + Seamless Local Fallback)
  // ============================================================================

  const login = async (email, role, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    const effectivePassword = password || 'password123';

    // 1. Try Backend Express /api/auth/login
    try {
      const authRes = await api.auth.login(trimmedEmail, effectivePassword);
      if (authRes?.token && authRes?.data?.user) {
        const u = authRes.data.user;
        const loggedInUser = {
          id: u._id,
          _id: u._id,
          email: u.email,
          name: u.name,
          role: u.role,
          avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          createdAt: u.createdAt,
        };

        setCurrentUser(loggedInUser);
        setIsBackendConnected(true);

        if (authRes.data.profile) {
          if (u.role === 'student') {
            const norm = normalizeStudent(authRes.data.profile);
            setStudents((prev) => [norm, ...prev.filter((s) => s.id !== norm.id && s.userId !== norm.userId)]);
          } else {
            const normBiz = {
              id: authRes.data.profile._id,
              _id: authRes.data.profile._id,
              userId: u._id,
              name: authRes.data.profile.companyName || u.name,
              logo: u.avatar,
              businessType: authRes.data.profile.businessType || 'Retail & D2C',
              description: authRes.data.profile.description || '',
              location: authRes.data.profile.location || 'India',
              contactEmail: u.email,
            };
            setBusinesses((prev) => [normBiz, ...prev.filter((b) => b.id !== normBiz.id && b.userId !== normBiz.userId)]);
          }
        }

        // Fetch live applications & notifications in background
        api.notifications.getMy().then((r) => {
          if (r?.data?.notifications) {
            const live = r.data.notifications.map((n) => ({
              id: n._id || n.id,
              userId: n.recipient,
              title: n.title,
              message: n.message,
              type: n.type,
              link: n.link,
              createdAt: n.createdAt,
              isRead: n.isRead,
            }));
            setNotifications((prev) => {
              const ids = new Set(live.map((l) => l.id));
              return [...live, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }).catch(() => {});

        api.applications.getMy().then((r) => {
          if (r?.data?.applications) {
            const live = r.data.applications.map(normalizeApplication);
            setApplications((prev) => {
              const ids = new Set(live.map((l) => l.id));
              return [...live, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }).catch(() => {});

        addToast('Welcome back', `Logged in as ${loggedInUser.name} (${loggedInUser.role.toUpperCase()})`);
        return loggedInUser;
      }
    } catch (err) {
      if (password) {
        throw err;
      }
      console.log('Backend auth unavailable or using custom demo account:', err.message);
    }

    // 2. Fallback to Initial Users for offline/demo reliability
    const foundUser = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === trimmedEmail
    );

    let loggedInUser;
    if (foundUser) {
      loggedInUser = foundUser;
    } else {
      const assignedRole = role || 'student';
      loggedInUser = {
        id: `user-${assignedRole}-${Date.now()}`,
        email: (email || '').trim(),
        name: ((email || '').split('@')[0] || 'User').replace('.', ' '),
        role: assignedRole,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString(),
      };
    }

    setCurrentUser(loggedInUser);
    addToast('Welcome back', `Logged in as ${loggedInUser.name} (${loggedInUser.role.toUpperCase()})`);
    return loggedInUser;
  };

  const logout = (navigateFn) => {
    api.auth.logout();
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (e) {
      console.error(e);
    }
    addToast('Signed out', 'You have been signed out successfully.', 'info');
    if (typeof navigateFn === 'function') {
      navigateFn('/', { replace: true });
    }
  };

  const switchUserRole = (role, targetId) => {
    let user;
    let demoEmail;

    if (role === 'student') {
      user = targetId
        ? INITIAL_USERS.find((u) => u.id === targetId) || INITIAL_USERS[0]
        : INITIAL_USERS[0]; // Rohan Verma
      demoEmail = user.email || 'rohan.verma@college.edu';
      setCurrentUser(user);
      addToast('Switched to Student Role', `Now previewing as ${user.name}`);
    } else if (role === 'business') {
      user = targetId
        ? INITIAL_USERS.find((u) => u.id === targetId) || INITIAL_USERS[2]
        : INITIAL_USERS[2]; // Bangalore TechRetail
      demoEmail = user.email || 'contact@techretail.in';
      setCurrentUser(user);
      addToast('Switched to Business Role', `Now previewing as ${user.name}`);
    } else {
      user = INITIAL_USERS[4]; // Demo Administrator
      demoEmail = 'admin@internbridge.in';
      setCurrentUser(user);
      addToast('Switched to Admin Role', 'Demo Administrator mode activated');
    }

    // Authenticate with live backend in background to keep JWT synchronized
    api.auth.login(demoEmail, 'password123').then((res) => {
      if (res?.token) {
        setIsBackendConnected(true);
        // Hydrate applications & notifications
        api.notifications.getMy().then((r) => {
          if (r?.data?.notifications) {
            const live = r.data.notifications.map((n) => ({
              id: n._id || n.id,
              userId: n.recipient,
              title: n.title,
              message: n.message,
              type: n.type,
              link: n.link,
              createdAt: n.createdAt,
              isRead: n.isRead,
            }));
            setNotifications((prev) => {
              const ids = new Set(live.map((l) => l.id));
              return [...live, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }).catch(() => {});

        api.applications.getMy().then((r) => {
          if (r?.data?.applications) {
            const live = r.data.applications.map(normalizeApplication);
            setApplications((prev) => {
              const ids = new Set(live.map((l) => l.id));
              return [...live, ...prev.filter((p) => !ids.has(p.id))];
            });
          }
        }).catch(() => {});
      }
    }).catch((err) => {
      console.warn('Backend quick-login sync bypassed:', err.message);
    });

    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    return user;
  };

  const registerStudent = async (data) => {
    // 1. Call Backend API to create user and profile in MongoDB
    const res = await api.auth.register({
      name: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      password: data.password || 'password123',
      role: 'student',
      college: data.college || 'Engineering College',
      course: data.course || 'B.Tech CSE',
      graduationYear: Number(data.graduationYear) || 2026,
      bio: data.bio || '',
      selfReportedSkills: data.selfReportedSkills || ['JavaScript', 'React'],
      interests: data.interests || ['Web Development'],
      availability: data.availability || '15-25 hrs/week',
      preferredArrangement: data.preferredArrangement || 'Remote',
    });

    if (res?.token && res?.data?.user) {
      const u = res.data.user;
      const newUser = {
        id: u._id,
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        createdAt: u.createdAt,
      };

      setCurrentUser(newUser);
      setIsBackendConnected(true);

      if (res.data.profile) {
        const norm = normalizeStudent(res.data.profile);
        setStudents((prev) => [norm, ...prev.filter((s) => s.id !== norm.id && s.userId !== norm.userId)]);
      }

      addToast('Account Created!', `Welcome to InternBridge, ${newUser.name}! Your account is stored in MongoDB.`);
      return newUser;
    }
    throw new Error('Registration failed. Please try again.');
  };

  const registerBusiness = async (data) => {
    // 1. Call Backend API to create enterprise business user and profile in MongoDB
    const res = await api.auth.register({
      name: (data.name || '').trim(),
      email: (data.email || '').trim().toLowerCase(),
      password: data.password || 'password123',
      role: 'business',
      companyName: (data.companyName || data.name || '').trim(),
      businessType: data.businessType || 'Retail & D2C',
      location: data.location || 'India',
      description: data.description || '',
      websiteUrl: data.websiteUrl || '',
      contactPerson: data.contactPerson || data.name,
      preferredArrangement: data.preferredArrangement || 'Remote',
    });

    if (res?.token && res?.data?.user) {
      const u = res.data.user;
      const newUser = {
        id: u._id,
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        avatar: u.avatar || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
        createdAt: u.createdAt,
      };

      setCurrentUser(newUser);
      setIsBackendConnected(true);

      const newBizProfile = {
        id: res.data.profile?._id || `biz-${Date.now()}`,
        _id: res.data.profile?._id,
        userId: u._id,
        name: data.companyName || data.name,
        logo: newUser.avatar,
        businessType: data.businessType || 'Retail & D2C',
        description: data.description || '',
        websiteUrl: data.websiteUrl || '',
        location: data.location || 'India',
        contactPerson: data.contactPerson || data.name,
        contactEmail: u.email,
        preferredArrangement: data.preferredArrangement || 'Remote',
        isVerified: true,
      };

      setBusinesses((prev) => [newBizProfile, ...prev.filter((b) => b.id !== newBizProfile.id && b.userId !== newBizProfile.userId)]);
      addToast('Business Registered!', `Welcome to InternBridge, ${newBizProfile.name}! Stored in MongoDB.`);
      return newUser;
    }
    throw new Error('Registration failed. Please try again.');
  };

  // ============================================================================
  // Student Profile & Portfolio
  // ============================================================================

  const updateStudentProfile = async (data) => {
    if (!currentStudent) return;

    // Persist to backend if token exists
    api.students.updateProfile(data).catch((err) => {
      console.warn('Backend profile update fallback:', err.message);
    });

    setStudents((prev) =>
      prev.map((s) => (s.id === currentStudent.id ? { ...s, ...data } : s))
    );
    if (data.name && currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, name: data.name } : null));
    }
    addToast('Profile Updated', 'Your student profile details have been saved.');
  };

  const addPortfolioItem = async (item) => {
    if (!currentStudent) return;

    let backendItem = null;
    try {
      const res = await api.students.addPortfolioItem(item);
      if (res?.data?.portfolioItem) {
        backendItem = res.data.portfolioItem;
      }
    } catch (err) {
      console.warn('Backend portfolio add fallback:', err.message);
    }

    const newItem = {
      ...item,
      id: backendItem?._id || `port-${Date.now()}`,
      studentId: currentStudent.id,
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id) {
          return {
            ...s,
            portfolioItems: [newItem, ...(s.portfolioItems || [])],
          };
        }
        return s;
      })
    );
    addToast('Portfolio Project Added', `"${item.title}" is now showcased on your profile.`);
  };

  const updatePortfolioItem = async (id, itemData) => {
    if (!currentStudent) return;

    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      api.students.updatePortfolioItem(id, itemData).catch((err) => {
        console.warn('Backend portfolio update fallback:', err.message);
      });
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id || s._id === currentStudent.id) {
          return {
            ...s,
            portfolioItems: (s.portfolioItems || []).map((p) =>
              p.id === id || p._id === id ? { ...p, ...itemData } : p
            ),
          };
        }
        return s;
      })
    );
    addToast('Portfolio Project Updated', 'Changes saved successfully to database.');
  };

  const updateBusinessProfile = async (data) => {
    if (!currentBusiness) return;

    try {
      await api.businesses.updateProfile(data);
    } catch (err) {
      console.warn('Backend business profile update fallback:', err.message);
    }

    setBusinesses((prev) =>
      prev.map((b) => (b.id === currentBusiness.id || b.userId === currentUser?.id ? { ...b, ...data } : b))
    );
    if ((data.name || data.companyName) && currentUser) {
      setCurrentUser((prev) => (prev ? { ...prev, name: data.companyName || data.name } : null));
    }
    addToast('Business Profile Updated', 'Your business profile details have been saved to the database.');
  };

  const deletePortfolioItem = async (id) => {
    if (!currentStudent) return;

    // If ID is a 24-char MongoDB ID, call backend delete
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      api.students.deletePortfolioItem(id).catch(() => {});
    }

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === currentStudent.id || s._id === currentStudent.id) {
          return {
            ...s,
            portfolioItems: (s.portfolioItems || []).filter((p) => p.id !== id && p._id !== id),
          };
        }
        return s;
      })
    );
    addToast('Project Removed', 'Portfolio item was deleted.', 'info');
  };

  // ============================================================================
  // Projects & Posting
  // ============================================================================

  const createProject = async (projectData) => {
    const biz = currentBusiness || businesses[0];
    let createdBackendProject = null;

    try {
      const res = await api.projects.create({
        title: projectData.title,
        category: projectData.category,
        budgetAmount: projectData.budgetAmount || 0,
        durationWeeks: projectData.durationWeeks || 4,
        shortDescription: projectData.shortDescription || '',
        fullDescription: projectData.problemGoal
          ? `${projectData.problemGoal} - ${projectData.expectedResult || ''}`
          : projectData.fullDescription || projectData.shortDescription,
        deliverables: projectData.deliverables || [],
        requiredSkills: projectData.requiredSkills || [],
        arrangement: projectData.arrangement || 'Remote',
      });
      if (res?.data?.project) {
        createdBackendProject = normalizeProject(res.data.project);
      }
    } catch (err) {
      console.warn('Backend project creation fallback:', err.message);
    }

    const newProject = createdBackendProject || {
      id: `proj-${Date.now()}`,
      businessId: biz.id,
      businessName: biz.name,
      businessLogo: biz.logo,
      businessLocation: biz.location,
      ...projectData,
      status: 'Open',
      createdAt: new Date().toISOString(),
      applicantCount: 0,
    };

    setProjects((prev) => [newProject, ...prev]);

    // Send notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      userId: 'user-student-1',
      title: 'New Project Matching Skills',
      message: `${biz.name} posted "${newProject.title}" in ${newProject.category}.`,
      type: 'project',
      link: `/projects/${newProject.id}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    addToast('Project Published!', `"${newProject.title}" is now open for student applications.`);
    return newProject;
  };

  const updateProjectStatus = async (projectId, status) => {
    if (/^[0-9a-fA-F]{24}$/.test(projectId)) {
      api.projects.updateStatus(projectId, status).catch(() => {});
    }

    setProjects((prev) =>
      prev.map((p) => (p.id === projectId || p._id === projectId ? { ...p, status } : p))
    );
    addToast('Project Status Updated', `Project status changed to ${status}.`);
  };

  const toggleSaveProject = (projectId) => {
    setSavedProjectIds((prev) => {
      const exists = prev.includes(projectId);
      if (exists) {
        addToast('Project Unsaved', 'Removed from your saved list.', 'info');
        return prev.filter((id) => id !== projectId);
      } else {
        addToast('Project Saved', 'Added to your bookmarked projects.');
        return [...prev, projectId];
      }
    });
  };

  // ============================================================================
  // Applications
  // ============================================================================

  const applyToProject = async (data) => {
    const project = projects.find((p) => p.id === data.projectId || p._id === data.projectId);
    if (!project) return false;

    const student = currentStudent || students[0];
    const isDuplicate = applications.some((a) => {
      if (a.projectId !== data.projectId && a.projectId !== project._id) return false;
      if (data.applicantType === 'individual' && a.applicantType === 'individual' && a.studentId === student.id) {
        return true;
      }
      if (data.applicantType === 'team' && a.applicantType === 'team' && a.teamId === data.teamId) {
        return true;
      }
      return false;
    });

    if (isDuplicate) {
      addToast('Already Applied', 'You have already submitted an application to this project.', 'warning');
      return false;
    }

    let team;
    let matchScore = 80;
    let matchReasons = [];

    if (data.applicantType === 'team' && data.teamId) {
      team = teams.find((t) => t.id === data.teamId || t._id === data.teamId);
      if (team) {
        const matchRes = calculateTeamMatchScore(project, team);
        matchScore = matchRes.score;
        matchReasons = matchRes.reasons;
      }
    } else {
      const matchRes = calculateStudentMatchScore(project, student);
      matchScore = matchRes.score;
      matchReasons = matchRes.reasons;
    }

    let createdBackendApp = null;
    const targetMongoId = project._id || (/^[0-9a-fA-F]{24}$/.test(project.id) ? project.id : null);
    if (targetMongoId) {
      try {
        const res = await api.applications.submit({
          projectId: targetMongoId,
          applicantType: data.applicantType,
          teamId: data.applicantType === 'team' ? (team?._id || team?.id) : undefined,
          proposalText: data.proposalText,
          relevantSkills: data.relevantSkills,
          highlightedPortfolioProject: data.highlightedPortfolioProject,
          availability: data.availability,
          estimatedTimeline: data.estimatedTimeline,
          notes: data.notes,
        });
        if (res?.data?.application) {
          createdBackendApp = normalizeApplication(res.data.application);
        }
      } catch (err) {
        console.warn('Backend application submit fallback:', err.message);
      }
    }

    const newApplication = createdBackendApp || {
      id: `app-${Date.now()}`,
      projectId: project.id,
      projectTitle: project.title,
      businessId: project.businessId,
      businessName: project.businessName,
      applicantType: data.applicantType,
      studentId: data.applicantType === 'individual' ? student.id : undefined,
      studentName: data.applicantType === 'individual' ? student.name : undefined,
      studentAvatar: data.applicantType === 'individual' ? student.avatar : undefined,
      teamId: data.applicantType === 'team' ? data.teamId : undefined,
      teamName: data.applicantType === 'team' ? team?.name : undefined,
      teamAvatar: data.applicantType === 'team' ? team?.avatar : undefined,
      teamMembers: data.applicantType === 'team' ? team?.members : undefined,
      proposalText: data.proposalText,
      relevantSkills: data.relevantSkills,
      highlightedPortfolioProject: data.highlightedPortfolioProject,
      availability: data.availability,
      estimatedTimeline: data.estimatedTimeline,
      notes: data.notes,
      status: 'Pending',
      appliedDate: new Date().toISOString(),
      matchScore,
      matchReasons,
    };

    setApplications((prev) => [newApplication, ...prev]);

    // Update project applicant count
    setProjects((prev) =>
      prev.map((p) =>
        p.id === project.id || p._id === project.id
          ? { ...p, applicantCount: (p.applicantCount || 0) + 1 }
          : p
      )
    );

    // Business notification
    const biz = businesses.find((b) => b.id === project.businessId);
    if (biz) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: biz.userId,
        title: 'New Applicant Received',
        message: `${data.applicantType === 'team' ? team?.name + ' (Team)' : student.name} applied for "${project.title}".`,
        type: 'application',
        link: `/business/projects/${project.id}/applicants`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addToast('Application Submitted!', `Applied to "${project.title}" as ${data.applicantType === 'team' ? team?.name : 'an individual'}.`);
    return true;
  };

  const updateApplicationStatus = async (applicationId, status) => {
    const app = applications.find((a) => a.id === applicationId || a._id === applicationId);
    if (!app) return;

    if (/^[0-9a-fA-F]{24}$/.test(applicationId)) {
      api.applications.updateStatus(applicationId, status).catch(() => {});
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === applicationId || a._id === applicationId ? { ...a, status } : a))
    );

    if (status === 'Selected') {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === app.projectId || p._id === app.projectId
            ? {
                ...p,
                status: 'Selected',
                selectedApplicantId: app.applicantType === 'team' ? app.teamId : app.studentId,
                selectedApplicantType: app.applicantType,
              }
            : p
        )
      );

      setApplications((prev) =>
        prev.map((a) =>
          (a.projectId === app.projectId || a.projectId === app._id) && a.id !== applicationId && a.status === 'Pending'
            ? { ...a, status: 'Rejected' }
            : a
        )
      );
    }

    const targetUserId = app.applicantType === 'individual'
      ? students.find((s) => s.id === app.studentId)?.userId
      : teams.find((t) => t.id === app.teamId)
      ? students.find((s) => s.id === teams.find((t) => t.id === app.teamId)?.leaderId)?.userId
      : undefined;

    if (targetUserId) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: targetUserId,
        title: status === 'Selected' ? 'Congratulations! Application Selected' : `Application ${status}`,
        message: `Your application for "${app.projectTitle}" by ${app.businessName} has been marked as ${status}.`,
        type: status === 'Selected' ? 'selection' : 'application',
        link: '/student/applications',
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addToast(
      `Applicant ${status}`,
      status === 'Selected'
        ? `Selected ${app.applicantType === 'team' ? app.teamName : app.studentName} for the project!`
        : `Applicant status set to ${status}.`
    );
  };

  const toggleSaveApplicant = (applicationId) => {
    setSavedApplicantIds((prev) => {
      const exists = prev.includes(applicationId);
      if (exists) {
        addToast('Applicant Unsaved', 'Removed from saved candidates.', 'info');
        return prev.filter((id) => id !== applicationId);
      } else {
        addToast('Applicant Saved', 'Added to your shortlisted candidates list.');
        return [...prev, applicationId];
      }
    });
  };

  // ============================================================================
  // Teams & Squads
  // ============================================================================

  const createTeam = async (data) => {
    const student = currentStudent || students[0];
    let createdBackendTeam = null;

    try {
      const res = await api.teams.create({
        name: data.name,
        description: data.description,
        avatar: data.avatar,
        projectInterests: data.projectInterests,
        combinedSkills: Array.from(new Set([...student.selfReportedSkills, ...(data.combinedSkills || [])])),
        openPositions: data.openPositions,
        visibility: data.visibility,
      });
      if (res?.data?.team) {
        createdBackendTeam = normalizeTeam(res.data.team);
      }
    } catch (err) {
      console.warn('Backend team creation fallback:', err.message);
    }

    const newTeam = createdBackendTeam || {
      id: `team-${Date.now()}`,
      name: data.name,
      description: data.description,
      leaderId: student.id,
      leaderName: student.name,
      avatar: data.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
      projectInterests: data.projectInterests,
      combinedSkills: Array.from(new Set([...student.selfReportedSkills, ...(data.combinedSkills || [])])),
      openPositions: data.openPositions,
      visibility: data.visibility,
      completedProjectsCount: 0,
      members: [
        {
          studentId: student.id,
          name: student.name,
          role: 'Team Leader',
          avatar: student.avatar,
          skills: student.selfReportedSkills.slice(0, 4),
          isLeader: true,
        },
      ],
      pendingJoinRequests: [],
    };

    setTeams((prev) => [newTeam, ...prev]);
    addToast('Team Created!', `"${newTeam.name}" is now ready. Start inviting teammates!`);
    return newTeam;
  };

  const updateTeam = (teamId, data) => {
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId || t._id === teamId ? { ...t, ...data } : t))
    );
    addToast('Team Details Updated', 'Changes saved successfully.');
  };

  const requestToJoinTeam = async (teamId) => {
    const student = currentStudent || students[0];
    const team = teams.find((t) => t.id === teamId || t._id === teamId);
    if (!team) return;

    if (team.members.some((m) => m.studentId === student.id)) {
      addToast('Already a Member', 'You are already in this team.', 'warning');
      return;
    }

    if (team.pendingJoinRequests.some((r) => r.studentId === student.id)) {
      addToast('Request Pending', 'Your request to join is already awaiting leader review.', 'warning');
      return;
    }

    // Call backend API if teamId is valid ObjectId
    const targetMongoId = team._id || (/^[0-9a-fA-F]{24}$/.test(team.id) ? team.id : null);
    if (targetMongoId) {
      api.teams.requestJoin(targetMongoId).catch((err) => {
        console.warn('Backend join request fallback:', err.message);
      });
    }

    const newRequest = {
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatar,
      skills: student.selfReportedSkills,
      requestDate: new Date().toISOString().split('T')[0],
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId || t._id === teamId
          ? { ...t, pendingJoinRequests: [...t.pendingJoinRequests, newRequest] }
          : t
      )
    );

    const leaderStudent = students.find((s) => s.id === team.leaderId);
    if (leaderStudent) {
      const notif = {
        id: `notif-${Date.now()}`,
        userId: leaderStudent.userId,
        title: 'New Join Request',
        message: `${student.name} requested to join "${team.name}".`,
        type: 'team',
        link: `/student/teams/${team.id}`,
        createdAt: new Date().toISOString(),
        isRead: false,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    addToast('Request Sent', `Your request to join "${team.name}" has been sent to the team leader.`);
  };

  const respondToJoinRequest = async (teamId, studentId, accept) => {
    const team = teams.find((t) => t.id === teamId || t._id === teamId);
    const applicantStudent = students.find((s) => s.id === studentId || s._id === studentId);
    if (!team || !applicantStudent) return;

    const targetMongoId = team._id || (/^[0-9a-fA-F]{24}$/.test(team.id) ? team.id : null);
    const targetStudentMongoId = applicantStudent._id || studentId;
    if (targetMongoId) {
      api.teams.respondJoin(targetMongoId, targetStudentMongoId, accept).catch((err) => {
        console.warn('Backend respond join fallback:', err.message);
      });
    }

    setTeams((prev) =>
      prev.map((t) => {
        if (t.id !== teamId && t._id !== teamId) return t;
        const filteredRequests = t.pendingJoinRequests.filter(
          (r) => r.studentId !== studentId && r.studentId !== applicantStudent.id
        );
        if (!accept) {
          return { ...t, pendingJoinRequests: filteredRequests };
        }
        const newMember = {
          studentId: applicantStudent.id,
          name: applicantStudent.name,
          role: 'Team Contributor',
          avatar: applicantStudent.avatar,
          skills: applicantStudent.selfReportedSkills.slice(0, 3),
          isLeader: false,
        };
        const updatedSkills = Array.from(new Set([...t.combinedSkills, ...applicantStudent.selfReportedSkills]));
        return {
          ...t,
          members: [...t.members, newMember],
          combinedSkills: updatedSkills,
          pendingJoinRequests: filteredRequests,
        };
      })
    );

    const notif = {
      id: `notif-${Date.now()}`,
      userId: applicantStudent.userId,
      title: accept ? 'Team Request Accepted!' : 'Team Request Declined',
      message: accept
        ? `You have been added to "${team.name}". Welcome to the team!`
        : `Your request to join "${team.name}" was declined by the leader.`,
      type: 'team',
      link: accept ? `/student/teams/${team.id}` : undefined,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast(
      accept ? 'Member Added' : 'Request Declined',
      accept ? `${applicantStudent.name} is now a member of "${team.name}".` : 'Join request was rejected.'
    );
  };

  const inviteStudentToTeam = (teamId, studentId, roleName = 'Team Contributor') => {
    const team = teams.find((t) => t.id === teamId || t._id === teamId);
    const targetStudent = students.find((s) => s.id === studentId || s._id === studentId);
    if (!team || !targetStudent) return;

    if (team.members.some((m) => m.studentId === studentId || m.studentId === targetStudent.id)) {
      addToast('Already in Team', `${targetStudent.name} is already a member.`, 'warning');
      return;
    }

    const newMember = {
      studentId: targetStudent.id,
      name: targetStudent.name,
      role: roleName,
      avatar: targetStudent.avatar,
      skills: targetStudent.selfReportedSkills.slice(0, 3),
      isLeader: false,
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId || t._id === teamId
          ? {
              ...t,
              members: [...t.members, newMember],
              combinedSkills: Array.from(new Set([...t.combinedSkills, ...targetStudent.selfReportedSkills])),
            }
          : t
      )
    );

    const notif = {
      id: `notif-${Date.now()}`,
      userId: targetStudent.userId,
      title: 'Joined New Team',
      message: `You were invited and added to "${team.name}" as ${roleName}.`,
      type: 'team',
      link: `/student/teams/${team.id}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast('Teammate Added!', `${targetStudent.name} was added to "${team.name}".`);
  };

  const leaveTeam = (teamId) => {
    const student = currentStudent || students[0];
    const team = teams.find((t) => t.id === teamId || t._id === teamId);
    if (!team) return;

    if (team.leaderId === student.id && team.members.length > 1) {
      addToast('Transfer Leadership First', 'Team leaders must promote another member before leaving.', 'warning');
      return;
    }

    setTeams((prev) =>
      prev
        .map((t) => {
          if (t.id !== teamId && t._id !== teamId) return t;
          return {
            ...t,
            members: t.members.filter((m) => m.studentId !== student.id),
          };
        })
        .filter((t) => t.members.length > 0)
    );

    addToast('Left Team', `You have stepped down from "${team.name}".`, 'info');
  };

  // ============================================================================
  // Notifications
  // ============================================================================

  const markNotificationAsRead = (id) => {
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      api.notifications.markRead(id).catch(() => {});
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    api.notifications.markAllRead().catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    addToast('Marked all as read', 'All notifications are now cleared.', 'info');
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setStudents(INITIAL_STUDENTS);
    setBusinesses(INITIAL_BUSINESSES);
    setProjects(INITIAL_PROJECTS);
    setTeams(INITIAL_TEAMS);
    setApplications(INITIAL_APPLICATIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSavedProjectIds(['proj-2']);
    setSavedApplicantIds(['app-1']);
    addToast('Demo Data Reset', 'Platform state has been reset to original sample dataset.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentStudent,
        currentBusiness,
        students,
        businesses,
        projects,
        teams,
        applications,
        notifications,
        savedProjectIds,
        savedApplicantIds,
        toasts,
        isBackendConnected,
        login,
        logout,
        switchUserRole,
        registerStudent,
        registerBusiness,
        updateStudentProfile,
        updateBusinessProfile,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        refreshData: syncWithBackend,
        createProject,
        updateProjectStatus,
        toggleSaveProject,
        applyToProject,
        updateApplicationStatus,
        toggleSaveApplicant,
        createTeam,
        updateTeam,
        requestToJoinTeam,
        respondToJoinRequest,
        inviteStudentToTeam,
        leaveTeam,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
