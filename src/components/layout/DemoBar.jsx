// import React, { useState } from 'react';
// import { useApp } from '../../context/AppContext';
// import { ShieldCheck, UserCheck, Briefcase, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

// export const DemoBar = () => {
//   const { currentUser, switchUserRole, resetDemoData, addToast } = useApp();
//   const [collapsed, setCollapsed] = useState(false);
//   const [showConfirmReset, setShowConfirmReset] = useState(false);
//   const navigate = useNavigate();

//   const handleRoleSwitch = (role) => {
//     switchUserRole(role);
//     if (role === 'student') navigate('/student/dashboard');
//     else if (role === 'business') navigate('/business/dashboard');
//     else navigate('/admin/dashboard');
//   };

//   const handleConfirmReset = () => {
//     resetDemoData();
//     setShowConfirmReset(false);
//     addToast('Demo data reset to initial state successfully', 'success');
//     navigate('/');
//   };

//   if (collapsed) {
//     return (
//       <aside aria-label="Role Switcher" className="bg-slate-900 text-slate-300 text-xs py-1 px-4 flex items-center justify-between border-b border-slate-800 z-50 relative select-none">
//         <div className="flex items-center gap-2">
//           <span className="font-semibold text-slate-400">Preview Persona:</span>
//           <span className="font-bold text-white">{currentUser?.name || 'Guest'}</span>
//           <span className="text-[10px] text-slate-400 uppercase tracking-wider">({currentUser?.role || 'visitor'})</span>
//         </div>
//         <button
//           onClick={() => setCollapsed(false)}
//           className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer font-medium text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
//         >
//           <span>Switch Persona</span>
//           <ChevronDown className="w-3.5 h-3.5" />
//         </button>
//       </aside>
//     );
//   }

//   return (
//     <aside aria-label="Role Switcher" className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800 z-50 relative shadow-xs select-none">
//       <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div className="flex items-center gap-1.5 font-bold text-slate-200">
//             <span className="text-indigo-400">InternBridge</span>
//             <span className="text-slate-400 font-normal">· Persona:</span>
//           </div>
//           <span className="font-semibold text-white bg-slate-800/90 px-2.5 py-0.5 rounded-md border border-slate-700/80 text-[11px] tabular-nums">
//             {currentUser?.name || 'Visitor / Guest'}{' '}
//             <span className="text-indigo-300 font-normal">
//               ({currentUser ? currentUser.role.toUpperCase() : 'NOT SIGNED IN'})
//             </span>
//           </span>
//         </div>

//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">Switch Role:</span>
//           <button
//             onClick={() => handleRoleSwitch('student')}
//             className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
//               currentUser?.role === 'student'
//                 ? 'bg-indigo-600 text-white shadow-2xs'
//                 : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
//             }`}
//           >
//             <UserCheck className="w-3.5 h-3.5" />
//             <span>Student (Rohan)</span>
//           </button>

//           <button
//             onClick={() => handleRoleSwitch('business')}
//             className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
//               currentUser?.role === 'business'
//                 ? 'bg-teal-600 text-white shadow-2xs'
//                 : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
//             }`}
//           >
//             <Briefcase className="w-3.5 h-3.5" />
//             <span>Business (TechRetail)</span>
//           </button>

//           <button
//             onClick={() => handleRoleSwitch('admin')}
//             className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 text-xs transition-all cursor-pointer ${
//               currentUser?.role === 'admin'
//                 ? 'bg-amber-600 text-white shadow-2xs'
//                 : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
//             }`}
//           >
//             <ShieldCheck className="w-3.5 h-3.5" />
//             <span>Admin</span>
//           </button>

//           <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

//           {showConfirmReset ? (
//             <div className="inline-flex items-center gap-1.5 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded-md">
//               <span className="text-[11px] text-rose-200">Reset data?</span>
//               <button
//                 onClick={handleConfirmReset}
//                 className="bg-rose-600 hover:bg-rose-500 text-white px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer"
//               >
//                 Yes
//               </button>
//               <button
//                 onClick={() => setShowConfirmReset(false)}
//                 className="text-slate-400 hover:text-white px-1 text-[11px] cursor-pointer"
//               >
//                 No
//               </button>
//             </div>
//           ) : (
//             <button
//               onClick={() => setShowConfirmReset(true)}
//               title="Reset sample data back to initial seed state"
//               className="px-2.5 py-1 rounded-md font-medium flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer text-xs"
//             >
//               <RotateCcw className="w-3.5 h-3.5" />
//               <span className="hidden sm:inline">Reset Seed</span>
//             </button>
//           )}

//           <button
//             onClick={() => setCollapsed(true)}
//             title="Minimize preview bar"
//             className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer ml-1"
//           >
//             <ChevronUp className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// };
