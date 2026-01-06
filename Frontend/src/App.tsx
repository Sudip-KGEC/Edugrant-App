import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  X,
  Globe,
  LogOut,
  User as UserIcon,
  CheckCircle,
  ChevronDown,
  Sun,
  Moon,
  UserX,
  UserCheck,
  Menu, House, Search, LayoutDashboard
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';


import { TRANSLATIONS } from './constants';
import { ScholarshipForm, Application, User, Language } from '../types';
import { api, fetchScholarships, getUserProfile, registerUser, verifyOtp, createScholarship, sendOtp, logoutUser } from './services/api';

import ChatBot from './components/ChatBot';
import LoadingOverlay from './components/Loading';
import Home from './components/Home';
import Browse from './components/Browse';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import MobileNavLink from './components/MobileNavLink';
import AddScholarshipModal from './components/AddScholarshipModal';
import AuthModal from './components/AuthModal';

const App = () => {

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [view, setView] = useState<'home' | 'browse' | 'dashboard' | 'admin'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scholarships, setScholarships] = useState([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auth Modal State
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState<'email' | 'otp' | 'roleSelection' | 'profile'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  const [profileData, setProfileData] = useState({
    name: '', college: '', cgpa: '', class12: '', highestDegree: '',
    currentDegree: '', fieldOfStudy: '', role: '', organization: '',
    department: '', designation: '', employeeId: ''
  });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newScholarship, setNewScholarship] = useState<ScholarshipForm>({
    name: '', provider: '', amount: '', deadline: '', category: '',
    gpaRequirement: '', degreeLevel: '', description: '', eligibility: [],
    officialUrl: '', adminId: ''
  });

  const t = TRANSLATIONS[currentLang];

  // --- 1. Initial Session Check (Fixed to use api.ts logic) ---
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const userData = await getUserProfile();
        if (userData) {
          setCurrentUser(userData);
          if (userData.appliedScholarships) {
            setApplications(userData.appliedScholarships);
          }
          setView(prev => ['home', 'login'].includes(prev) ?
            (userData.role === 'admin' ? 'admin' : 'dashboard') : prev);
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  // --- 2. Load Scholarships ---
  useEffect(() => {
    const loadData = async () => {
      if (view === 'admin' && !currentUser?.id) return;
      try {
        const adminId = view === 'admin' ? currentUser?.id : undefined;
        const data = await fetchScholarships(adminId);
        setScholarships(data);
      } catch (err) {
        console.error("Failed to load scholarships:", err);
      }
    };
    loadData();
  }, [view, currentUser]);

  // --- 3. Theme Effect ---
  useEffect(() => {
    const root = window.document.documentElement;
    theme === 'dark' ? root.classList.add('dark') : root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Handlers ---
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSendOtp = async () => {
    if (!authEmail) return alert("Please enter a valid email");
    setIsLoading(true);
    try {
      await sendOtp(authEmail);
      setAuthStep('otp');
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    try {
      const response = await verifyOtp(authEmail, authOtp);
      if (response.isRegistered) {
        setCurrentUser(response.user);
        setShowAuthModal(false);
        setView(response.user.role === 'admin' ? 'admin' : 'dashboard');
      } else {
        setAuthStep('roleSelection');
      }
    } catch (error) {
      alert('Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setCurrentUser(null);
      setView('home');
      setApplications([]);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (schId: string) => {
    if (!currentUser) return handleLoginStart();

    // Improved check: handles both string IDs and populated object IDs
    const alreadyApplied = (currentUser.appliedScholarships ?? []).some((id: any) => {
      const compareId = typeof id === 'string' ? id : id._id?.toString();
      return compareId === schId;
    });

    if (alreadyApplied) return alert("You have already applied for this scholarship.");

    setIsLoading(true);
    try {
      const response = await api.post('/api/scholarships/apply', { scholarshipId: schId });

      setCurrentUser(prev => prev ? ({
        ...prev,
        appliedScholarships: [...(prev.appliedScholarships || []), schId]
      }) : null);

      if (response.data.application) {
        setApplications(prev => [...prev, response.data.application]);
      }
      alert("Application submitted successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || 'Could not process application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginStart = () => {
    setAuthStep('email');
    setAuthEmail('');
    setAuthOtp('');
    setShowAuthModal(true);
  };

  const getLangCodeDisplay = (code: Language) => {
    const map: Record<Language, string> = { en: 'ENG', hi: 'HIN', bn: 'BEN', ta: 'TAM', or: 'ODI', ml: 'MAL' };
    return map[code];
  };
  const handleBack = () => {
    if (authStep === 'profile') {
      setAuthStep('roleSelection');
    } else if (authStep === 'roleSelection') {
      setProfileData({ ...profileData, role: '' }); // Reset role choice
      setAuthStep('otp');
    } else if (authStep === 'otp') {
      setAuthStep('email');
    }
  };

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    try {
      // 1. Create the base payload with common fields
      const newUser: any = {
        email: authEmail,
        name: profileData.name.trim(),
        role: profileData.role,
      };

      // 2. Add Conditional Fields based on Role
      if (profileData.role === 'admin') {
        newUser.organization = profileData.organization.trim();
        newUser.department = profileData.department.trim();
        newUser.designation = profileData.designation.trim();
        newUser.employeeId = profileData.employeeId.trim();
      } else {
        // Student specific fields
        newUser.college = profileData.college.trim();
        newUser.cgpa = Number(profileData.cgpa);
        newUser.class12Marks = Number(profileData.class12);
        newUser.highestDegree = profileData.highestDegree;
        newUser.currentDegree = profileData.currentDegree;
        newUser.fieldOfStudy = profileData.fieldOfStudy || 'Engineering';
      }

      // 3. Send to Backend via your Axios registerUser helper
      const userFromDB = await registerUser(newUser);

      // 4. Update Local State with the saved user (including the new _id from MongoDB)
      const finalUser = {
        ...newUser,
        ...userFromDB,
        isRegistered: true,
      };

      setCurrentUser(finalUser);
      setShowAuthModal(false);

      // 5. Redirect based on role
      setView(finalUser.role === 'admin' ? 'admin' : 'dashboard');

    } catch (error: any) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || 'Registration Failed. Please check your connection.';
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScholarship = async () => {
    // 1. Basic Validation
    if (!newScholarship.name.trim() || !newScholarship.provider.trim()) {
      alert("Scholarship Name and Provider are required.");
      return;
    }

    setIsLoading(true);
    try {
      // 2. Prepare Payload with correct types for MongoDB
      const scholarshipPayload = {
        ...newScholarship,
        name: newScholarship.name.trim(),
        provider: newScholarship.provider.trim(),
        amount: Number(newScholarship.amount) || 0, // Ensure it's a number
        gpaRequirement: Number(newScholarship.gpaRequirement) || 0,
        adminId: currentUser?.id || currentUser?.id, // Support both ID formats
        eligibility: Array.isArray(newScholarship.eligibility)
          ? newScholarship.eligibility
          : [newScholarship.eligibility]
      };

      const savedScholarship = await createScholarship(scholarshipPayload);

      // 3. Update State & UI
      setScholarships((prev) => [savedScholarship, ...prev]);
      setShowAdminModal(false);

      // Reset form
      setNewScholarship({
        name: '', provider: '', amount: '', deadline: '', category: '',
        gpaRequirement: '', degreeLevel: '', description: '', eligibility: [],
        officialUrl: '', adminId: ''
      });

      alert("Scholarship posted successfully!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save scholarship.");
    } finally {
      setIsLoading(false);
    }
  };
  // --- Views logic ---
  const renderContent = () => {

    if ((view === 'dashboard' || view === 'admin') && !currentUser) {
      setShowAuthModal(true);
      return <Home t={t} setView={setView} handleLoginStart={handleLoginStart} currentUser={currentUser} />;
    }
    switch (view) {

      case 'home':
        return <Home
          t={t}
          setView={setView}
          handleLoginStart={handleLoginStart}
          currentUser={currentUser} />;

      case 'browse':
        return <Browse
          t={t}
          scholarships={scholarships}
          currentUser={currentUser}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          applications={applications}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          handleApply={handleApply}
          isLoading={isLoading}
        />;

      case 'dashboard':
        return <Dashboard
          t={t}
          currentUser={currentUser}
          scholarships={scholarships}
          setView={setView}
        />;

      case 'admin':
        if (currentUser && currentUser.role === 'admin') {
          return (
            <Admin
              setShowAdminModal={setShowAdminModal}
              scholarships={scholarships}
              currentUser={currentUser}
            />
          );
        }
        setView('home');
        return null;

      default:
        return <Home t={t} setView={setView} handleLoginStart={handleLoginStart} currentUser={currentUser} />;
    }
  };




  return (
    <div className="min-h-screen scrollbar-hide  flex flex-col font-sans text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* 1. Global Loader */}
      {isLoading && <LoadingOverlay />}
      {/* Navbar */}
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
                {/* Secret Admin Link for Demo */}
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
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
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

                {isLangMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsLangMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl py-2 border border-slate-100 dark:border-slate-700 z-20 origin-top-right transition-colors">
                      <div className="px-4 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Select Language
                      </div>
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
                            setCurrentLang(lang.code as Language);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-3 text-sm flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
                             ${currentLang === lang.code ? 'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20' : 'text-slate-700 dark:text-slate-300'}
                           `}
                        >
                          <div className="flex flex-col">
                            <span className="font-medium">{lang.native}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-500">{lang.label}</span>
                          </div>
                          {currentLang === lang.code && <CheckCircle className="w-4 h-4 text-teal-600 dark:text-teal-500" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* User Auth */}
              {currentUser ? (
                <div className=" hidden md:flex items-center gap-1">
                  <div className=" h-4 w-6 md:h-10 md:w-10 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                    <UserCheck className="inline-block h-4 w-4 md:h-5 md:w-5 ml-1" />
                  </div>
                  <button onClick={handleLogout} className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLoginStart} className="bg-teal-600 hidden md:flex text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  <UserX className="w-4 h-4 inline-block mr-1" />
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-slate-600 dark:text-slate-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>

              {/* Mobile Menu */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}

                    className="absolute top-16 left-0 w-full z-50 overflow-y-auto scrollbar-hide border-b 
                 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md 
                 border-slate-200 dark:border-slate-800 transition-colors shadow-xl"
                  >
                    <div className="flex flex-col p-4 space-y-4">
                      {/* User Section */}
                      <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                        {currentUser ? (
                          <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                                <UserCheck size={20} />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                {currentUser.name || 'Profile'}
                              </span>
                            </div>
                            <button
                              onClick={handleLogout}
                              className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                            >
                              <LogOut size={20} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={handleLoginStart}
                            className="w-full bg-teal-600 text-white py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
                          >
                            <UserX size={18} /> Sign In
                          </button>
                        )}
                      </div>

                      {/* Navigation Links */}
                      <div className="space-y-1">
                        <MobileNavLink
                          icon={<House size={18} />}
                          label={t.home}
                          active={view === 'home'}
                          onClick={() => { setView('home'); setIsMenuOpen(false); }}
                        />
                        <MobileNavLink
                          icon={<Search size={18} />}
                          label={t.browse}
                          active={view === 'browse'}
                          onClick={() => { setView('browse'); setIsMenuOpen(false); }}
                        />
                        {currentUser && (
                          <MobileNavLink
                            icon={<LayoutDashboard size={18} />}
                            label={t.dashboard}
                            active={view === 'dashboard'}
                            onClick={() => { setView('dashboard'); setIsMenuOpen(false); }}
                          />
                        )}
                      </div>
                      {/* Admin Panel Link */}
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          if (!currentUser) setShowAuthModal(true);
                          else if (currentUser.role === 'admin') setView('admin');
                        }}
                        className="w-full text-left text-xs font-semibold uppercase tracking-widest p-3 text-slate-400 dark:text-slate-500 hover:text-teal-500 border-t border-slate-100 dark:border-slate-800 mt-2"
                      >
                        Admin Panel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow">
        {renderContent()}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal
          authStep={authStep}
          setAuthStep={setAuthStep}
          authEmail={authEmail}
          setAuthEmail={setAuthEmail}
          authOtp={authOtp}
          setAuthOtp={setAuthOtp}
          handleSendOtp={handleSendOtp}
          handleVerifyOtp={handleVerifyOtp}
          handleBack={handleBack}
          setShowAuthModal={setShowAuthModal}
          t={t}
          setProfileData={setProfileData}
          profileData={profileData}
          handleProfileSubmit={handleProfileSubmit}
        />
      )}

      {/* Admin Add Modal */}
      {showAdminModal && (
        <AddScholarshipModal newScholarship={newScholarship} setNewScholarship={setNewScholarship} handleAddScholarship={handleAddScholarship} setShowAdminModal={setShowAdminModal} />
      )}

      <ChatBot />
    </div>
  );
};


export default App;
