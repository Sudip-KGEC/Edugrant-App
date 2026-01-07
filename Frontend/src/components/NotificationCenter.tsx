import React, { useState, useEffect } from 'react';
import { getNotifications, markAsRead, clearAllNotifications } from '../services/api'; 
import { Bell, Trash2, CheckCircle, BellOff } from 'lucide-react';
import { motion } from 'framer-motion';


const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setNotifications([]);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const unreadCount = Array.isArray(notifications)
        ? notifications.filter(n => !n.isRead).length
        : 0;

    // --- Action Handlers ---

    const handleMarkAllRead = async () => {
        try {
            await markAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleClearAll = async () => {
        if (window.confirm('Clear all notifications? This cannot be undone.')) {
            try {
                await clearAllNotifications();
                setNotifications([]);
            } catch (err) {
                console.error("Failed to clear notifications", err);
            }
        }
    };

    return (
        <div className="relative">
            {/* Bell Icon & Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative flex items-center p-2 text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                        <span className="relative inline-flex items-center justify-center rounded-full bg-teal-600 px-1 py-0.5 text-[9px] font-bold leading-none text-white ring-2 ring-white dark:ring-slate-900">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
           {isOpen && (
  <>
    {/* Backdrop: High z-index to ensure it covers everything under the menu */}
    <div className="fixed inset-0 z-40 bg-slate-900/5 backdrop-blur-[1px]" onClick={() => setIsOpen(false)} />
    
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className={`
        /* Mobile: Centered on screen */
        fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-100]
        
        /* Desktop: Aligned to the right of the button */
        sm:absolute sm:top-full sm:left-auto sm:right-0 sm:translate-x-0 
        sm:w-85 sm:mt-3 sm:min-w-[320px]
        
        bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 
        rounded-2xl shadow-2xl z-50 overflow-hidden transform origin-top
        transition-all
      `}
    >
      {/* --- Header --- */}
      <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-800 dark:text-white text-sm">Notifications</h4>
              {unreadCount > 0 && (
                  <span className="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {unreadCount} New
                  </span>
              )}
          </div>
          
          {notifications.length > 0 && (
              <div className="flex items-center gap-3">
                  <button 
                      onClick={handleMarkAllRead}
                      title="Mark all as read"
                      className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                  >
                      <CheckCircle size={16} />
                  </button>
                  <button 
                      onClick={handleClearAll}
                      title="Clear all"
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                  >
                      <Trash2 size={16} />
                  </button>
              </div>
          )}
      </div>

      {/* --- List Area --- */}
      <div className="max-h-112 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700">
          {notifications.length === 0 ? (
              <div className="p-12 text-center">
                  <div className="flex justify-center mb-3">
                      <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                          <BellOff size={24} />
                      </div>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">All caught up!</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">No new notifications to show.</p>
              </div>
          ) : (
              notifications.map((n) => (
                  <div 
                      key={n._id} 
                      className={`p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${!n.isRead ? 'bg-teal-50/30 dark:bg-teal-900/10' : ''}`}
                  >
                      <div className="flex justify-between items-start mb-1">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              n.type === 'MATCH' ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/40' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40'
                          }`}>
                              {n.type}
                          </span>
                          <span className="text-[10px] text-slate-400">
                              {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                      </div>
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                  </div>
              ))
          )}
      </div>
    </motion.div>
  </>
)}
        </div>
    );
};

export default NotificationCenter;