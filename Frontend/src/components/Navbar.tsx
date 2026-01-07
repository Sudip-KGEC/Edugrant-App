import React, { useState } from 'react';
import { 
  GraduationCap, Moon, Sun, Globe, ChevronDown, CheckCircle, 
  UserCheck, LogOut, UserX, Menu, X, House, Search, LayoutDashboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from './NotificationCenter';


const Navbar = ({
  view, setView, currentUser, handleLogout, handleLoginStart,
  setShowAuthModal, theme, toggleTheme, currentLang, setCurrentLang, t
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const getLangCodeDisplay = (code: string) => code.toUpperCase();

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40 border-b border-transparent dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Navbar Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
            <GraduationCap className="h-8 w-8 text-teal-600 dark:text-teal-500 mr-2 animate-float" />
            <span className="font-bold text-xl text-teal-900 dark:text-teal-400 tracking-tight">{t.title}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-4">
              <button onClick={() => setView('home')} className={`${view === 'home' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.home}</button>
              <button onClick={() => setView('browse')} className={`${view === 'browse' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.browse}</button>
              {currentUser && (
                <button onClick={() => setView('dashboard')} className={`${view === 'dashboard' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.dashboard}</button>
              )}
              <button
                onClick={() => {
                  if (!currentUser) {
                    setShowAuthModal(true);
                  } else if (currentUser.role === 'admin') {
                    setView('admin');
                  } else {
                    alert(`Access Denied. Your role is: ${currentUser.role}`);
                  }
                }}
                className="text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs transition-colors"
              >
                Admin Panel
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center p-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              title="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Language Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium uppercase">{getLangCodeDisplay(currentLang)}</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl py-2 border border-slate-100 dark:border-slate-700 z-20 origin-top-right transition-colors"
                    >
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Language</div>
                      {[
                        { code: 'en', label: 'English', native: 'English' },
                        { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
                        { code: 'bn', label: 'Bengali', native: 'বাংলা' },
                        { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
                        { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ' },
                        { code: 'ml', label: 'Malayalam', native: 'മലയാളം' }
                      ].map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setCurrentLang(lang.code);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
                            ${currentLang === lang.code ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-300'}
                          `}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{lang.native}</span>
                            <span className="text-xs text-slate-500">{lang.label}</span>
                          </div>
                          {currentLang === lang.code && <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-500" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Center */}
            {currentUser && (
              <div className="flex items-center justify-center">
                <NotificationCenter />
              </div>
            )}

            {/* User Auth Desktop */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-1">
                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                  <UserCheck className="h-5 w-5" />
                </div>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500 transition-colors">
                  <LogOut className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <button onClick={handleLoginStart} className="bg-teal-600 hidden md:flex text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                Sign In
              </button>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 transition-colors shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {currentUser ? (
                <div className="flex items-center justify-between px-2 pb-2 border-b dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                      <UserCheck size={20} />
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{currentUser.name || 'Profile'}</span>
                  </div>
                  <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-red-500"><LogOut size={20} /></button>
                </div>
              ) : (
                <button onClick={handleLoginStart} className="w-full bg-teal-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                  <UserX size={18} /> Sign In
                </button>
              )}

              <div className="space-y-1">
                <MobileNavLink icon={<House size={18}/>} label={t.home} active={view === 'home'} onClick={() => { setView('home'); setIsMenuOpen(false); }} />
                <MobileNavLink icon={<Search size={18}/>} label={t.browse} active={view === 'browse'} onClick={() => { setView('browse'); setIsMenuOpen(false); }} />
                {currentUser && <MobileNavLink icon={<LayoutDashboard size={18}/>} label={t.dashboard} active={view === 'dashboard'} onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// Internal Helper Component for Mobile Links
const MobileNavLink = ({ icon, label, active, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      active ? 'bg-teal-50 text-teal-600 dark:bg-teal-900/20 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    {icon} {label}
  </button>
);

export default Navbar;