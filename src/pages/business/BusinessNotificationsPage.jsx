import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { CheckCheck, ExternalLink, Inbox } from 'lucide-react';

export const BusinessNotificationsPage = () => {
  const { notifications, currentUser, markNotificationAsRead, markAllNotificationsAsRead } = useApp();

  const businessNotifs = notifications.filter(
    (n) => !currentUser || n.userId === currentUser.id || n.userId === currentUser._id
  );

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Business Notifications</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Incoming student applications, proposal updates, and candidate inquiries.
          </p>
        </div>

        {businessNotifs.some(n => !n.isRead) && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <CheckCheck className="w-4 h-4 text-slate-500" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      {businessNotifs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No new alerts</h3>
          <p className="text-xs text-slate-500">
            Whenever a student or squad applies to your project briefs, you will receive an alert here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {businessNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationAsRead(n.id)}
              className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                !n.isRead ? 'bg-teal-50/40 hover:bg-teal-50/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  {!n.isRead && (
                    <span className="w-2 h-2 rounded-full bg-teal-700 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                <div className="text-[11px] text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {n.link && (
                <Link
                  to={n.link}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-teal-800 font-semibold text-xs rounded-lg shrink-0 flex items-center gap-1 shadow-2xs"
                >
                  <span>Evaluate</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
