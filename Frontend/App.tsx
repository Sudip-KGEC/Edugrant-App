import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  X,
  ArrowLeft,
  Globe,
  LogOut,
  User as UserIcon,
  CheckCircle,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';

import { TRANSLATIONS } from './constants';
import { ScholarshipForm, Application, User, Language } from './types';
import { fetchScholarships, registerUser, verifyOtp, createScholarship, sendOtp } from './services/api';

import ChatBot from './components/ChatBot';
import LoadingOverlay from './components/Loading';
import Home from './components/Home';
import Browse from './components/Browse';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';

const App = () => {

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });
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
  const [profileData, setProfileData] = useState({ name: '', college: '', cgpa: '', class12: '', highestDegree: '', currentDegree: '', fieldOfStudy: '', role: '', organization: '', department: '', designation: '', employeeId: '' });

  // Admin Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [newScholarship, setNewScholarship] = useState<ScholarshipForm>({
    name: '',
    provider: '',
    amount: '',
    deadline: '',
    category: '',
    gpaRequirement: '',
    degreeLevel: '',
    description: '',
    eligibility: [],
    officialUrl: '',
    adminId: ''
  });

  const t = TRANSLATIONS[currentLang];

  // --- Effects ---
  useEffect(() => {
    if (currentUser?.id) {
      setNewScholarship(prev => ({
        ...prev,
        adminId: currentUser.id
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    const loadData = async () => {
      // Prevent calling the API with "undefined"
      if (view === 'admin' && !currentUser?.id) return;

      try {
        // If in admin view, pass the ID; otherwise, fetch all
        const adminId = view === 'admin' ? currentUser?.id : undefined;
        const data = await fetchScholarships(adminId);
        setScholarships(data);
      } catch (err) {
        console.error("Failed to load scholarships:", err);
      }
    };

    loadData();
  }, [view, currentUser]);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      try {
        const response = await fetch('/api/users/profile', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          setCurrentUser(userData);

          if (userData.appliedScholarships) {
            setApplications(userData.appliedScholarships);
          }
          setView(prev => {
            if (['home', 'login', 'signup'].includes(prev)) {
              return userData.role === 'admin' ? 'admin' : 'dashboard';
            }
            return prev;
          });

        } else {

          setCurrentUser(null);
          setView(prev => {
            const isPrivateRoute = ['dashboard', 'admin', 'profile'].includes(prev);
            return isPrivateRoute ? 'home' : prev;
          });
        }
      } catch (err) {
        console.error("Session sync failed:", err);
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- Helpers ---
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLoginStart = () => {
    setAuthStep('email');
    setAuthEmail('');
    setAuthOtp('');
    setShowAuthModal(true);
  };

  const handleSendOtp = async () => {
    if (!authEmail) {
      alert("Please enter a valid email");
      return;
    }
    setIsLoading(true)

    try {
      const response = await sendOtp(authEmail);

      if (response) {
        setAuthStep('otp');
      }
    } catch (error: any) {
      console.error("Auth Error:", error);
      alert(error.response?.data?.message || "Failed to send OTP. Is the server running?");
    }
    finally {
      setIsLoading(false)
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
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async () => {
    setIsLoading(true);
    try {
      const newUser: any = {
        email: authEmail,
        name: profileData.name,
        role: profileData.role,
      };

      // Conditional field mapping
      if (profileData.role === 'admin') {
        newUser.organization = profileData.organization;
        newUser.department = profileData.department;
        newUser.designation = profileData.designation;
        newUser.employeeId = profileData.employeeId;
      } else {
        newUser.college = profileData.college;
        newUser.cgpa = Number(profileData.cgpa);
        newUser.class12Marks = Number(profileData.class12);
        newUser.highestDegree = profileData.highestDegree;
        newUser.currentDegree = profileData.currentDegree;
        newUser.fieldOfStudy = profileData.fieldOfStudy || 'Engineering';
      }

      const userFromDB = await registerUser(newUser);

      // Merge newUser and userFromDB so no fields are "undefined"
      const finalUser = {
        ...newUser,
        ...userFromDB,
        isRegistered: true,
      };

      setCurrentUser(finalUser);
      setShowAuthModal(false);
      setView(finalUser.role === 'admin' ? 'admin' : 'dashboard');

    } catch (error) {
      console.error("Registration error:", error);
      alert('Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (authStep === 'profile') {
      setAuthStep('roleSelection');
    } else if (authStep === 'roleSelection') {
      setAuthStep('otp');
    } else if (authStep === 'otp') {
      setAuthStep('email');
    }
  };

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setCurrentUser(null);
      setView('home');
      setApplications([]);

    } catch (error) {
      console.error("Logout failed:", error);
      setCurrentUser(null);
      setView('home');
    }
    finally {
      setIsLoading(false)
    }
  };

  const handleApply = async (schId: string) => {
    if (!currentUser) {
      handleLoginStart();
      return;
    }
    const alreadyApplied = (currentUser.appliedScholarships ?? []).includes(schId);
    if (alreadyApplied) {
      alert("You have already applied for this scholarship.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/scholarships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ scholarshipId: schId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to apply');
      }

      // 1. Update Current User: Add ID to appliedScholarships array
      // This ensures the "Applied" badge appears on the Browse page immediately
      setCurrentUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          appliedScholarships: [...(prev.appliedScholarships || []), schId]
        };
      });

      // 2. Update Applications State: Use the REAL object from the server
      // 'data.application' should be the newly created doc from your Mongoose backend
      if (data.application) {
        setApplications(prev => [...prev, data.application]);
      }

      alert("Application submitted successfully!");

    } catch (error: any) {
      console.error("Apply Error:", error);
      alert(error.message || 'Could not process application.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddScholarship = async () => {

    const scholarshipPayload = {
      name: newScholarship.name.trim(),
      provider: newScholarship.provider.trim(),
      description: newScholarship.description || 'No description provided.',
      officialUrl: newScholarship.officialUrl || '',
      amount: Number(newScholarship.amount) || 0,
      gpaRequirement: newScholarship.gpaRequirement || 0.0,
      category: newScholarship.category || 'General',
      degreeLevel: newScholarship.degreeLevel || 'Undergraduate',
      deadline: newScholarship.deadline,
      eligibility: Array.isArray(newScholarship.eligibility)
        ? newScholarship.eligibility
        : newScholarship.eligibility ? [newScholarship.eligibility] : ['Standard Criteria'],
      adminId: currentUser?.id
    };
    setIsLoading(true);

    try {
      const savedScholarship = await createScholarship(scholarshipPayload);
      const scholarshipWithId = {
        ...savedScholarship,
        adminId: savedScholarship.adminId?.toString() || currentUser?.id || currentUser?.id
      };

      setScholarships(prev => [scholarshipWithId, ...prev]);
      setShowAdminModal(false);

    } catch (error) {
      console.error("Failed to add:", error);
      alert("Could not save scholarship.");
    } finally {
      setIsLoading(false);
    }
  };

  const getLangCodeDisplay = (code: Language) => {
    const map: Record<Language, string> = {
      en: 'ENG',
      hi: 'HIN',
      bn: 'BEN',
      ta: 'TAM',
      or: 'ODI',
      ml: 'MAL'
    };
    return map[code];
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
          return <Admin setShowAdminModal={setShowAdminModal} scholarships={scholarships} currentUser={currentUser} />;
        }
        return <Home t={t} setView={setView} handleLoginStart={handleLoginStart} currentUser={currentUser} />;

      default:
        return <Home t={t} setView={setView} handleLoginStart={handleLoginStart} currentUser={currentUser} />;
    }
  };


  

  return (
    <div className="min-h-screen scrollbar-hide flex flex-col font-sans text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-950 transition-colors duration-200">

      {/* 1. Global Loader */}
      {isLoading && <LoadingOverlay />}
      {/* Navbar */}
      <nav className="bg-white dark:bg-slate-900 shadow-sm sticky top-0 z-40 border-b border-transparent dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <GraduationCap className="h-8 w-8 text-teal-600 dark:text-teal-500 mr-2 animate-float" />
              <span className="font-bold text-xl text-teal-900 dark:text-teal-400 tracking-tight">{t.title}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-4">
                <button onClick={() => setView('home')} className={`${view === 'home' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.home}</button>
                <button onClick={() => setView('browse')} className={`${view === 'browse' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.browse}</button>
                {currentUser && (
                  <button onClick={() => setView('dashboard')} className={`${view === 'dashboard' ? 'text-teal-600 dark:text-teal-400' : 'text-slate-600 dark:text-slate-400'} hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-colors`}>{t.dashboard}</button>
                )}
                {/* Secret Admin Link for Demo */}
                <button onClick={() => !currentUser ? setShowAuthModal(true) : currentUser.role?.trim() === "admin" ? setView('admin') : alert(`Access Denied. Your role is: ${currentUser.role}`)} className="text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 text-xs">Admin</button>
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

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold">
                    {currentUser?.name?.charAt(0) || '?'}
                  </div>
                  <button onClick={handleLogout} className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={handleLoginStart} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
                  {t.login}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        {renderContent()}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex justify-between items-center mb-6">


              {authStep !== 'email' && (
                <button
                  onClick={handleBack}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                {authStep === 'profile' ? t.profileSetup : t.login}
              </h2>
              <button onClick={() => setShowAuthModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-6 h-6" />
              </button>
            </div>

            {authStep === 'email' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={handleSendOtp}
                  disabled={!authEmail}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
                >
                  {t.getOtp}
                </button>
              </div>
            )}

            {authStep === 'otp' && (
              <div className="space-y-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">OTP sent to {authEmail}</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Enter OTP</label>
                  <input
                    type="text"
                    value={authOtp}
                    onChange={(e) => setAuthOtp(e.target.value)}
                    placeholder={t.otpPlaceholder}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  disabled={authOtp.length < 4}
                  className="w-full bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
                >
                  {t.verify}
                </button>
                <button onClick={() => setAuthStep('email')} className="w-full text-sm text-slate-500 dark:text-slate-400 mt-2 hover:underline">Change Email</button>
              </div>
            )}


            {authStep === 'roleSelection' && (
              <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Select Account Type</h3>
                  <p className="text-slate-500 text-sm">How will you be using the platform?</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Student Path */}
                  <button
                    onClick={() => {
                      setProfileData({ ...profileData, role: 'student' });
                      setAuthStep('profile');
                    }}
                    className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-500 transition-all group text-left"
                  >
                    <div className="bg-teal-100 dark:bg-teal-500/10 p-3 rounded-lg mr-4 group-hover:bg-teal-500/20">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">Student</h4>
                      <p className="text-xs text-slate-500">Find and apply for scholarships</p>
                    </div>
                  </button>

                  {/* Admin Path */}
                  <button
                    onClick={() => {
                      setProfileData({ ...profileData, role: 'admin' });
                      setAuthStep('profile');
                    }}
                    className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-500 transition-all group text-left"
                  >
                    <div className="bg-purple-100 dark:bg-purple-500/10 p-3 rounded-lg mr-4 group-hover:bg-purple-500/20">
                      <span className="text-2xl">💼</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">Administrator</h4>
                      <p className="text-xs text-slate-500">Post and manage scholarship programs</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {authStep === 'profile' && (
              <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
                <div className="text-center border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">Professional Profile</h3>
                  <p className="text-xs text-teal-600 font-bold uppercase tracking-widest mt-1">
                    Account Type: {profileData.role}
                  </p>
                </div>

                {/* Common Name Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Full Identity</label>
                  <input
                    placeholder="Legal Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {profileData.role === 'admin' ? (
                  /* --- ADMIN PROFESSIONAL PATH --- */
                  <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Official Organization</label>
                      <input
                        placeholder="University or Institute Name"
                        onChange={(e) => setProfileData({ ...profileData, organization: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Department</label>
                        <input
                          placeholder="e.g. Administration"
                          onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Designation</label>
                        <input
                          placeholder="e.g. Coordinator"
                          onChange={(e) => setProfileData({ ...profileData, designation: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Official Employee ID</label>
                      <input
                        placeholder="Work ID Number"
                        onChange={(e) => setProfileData({ ...profileData, employeeId: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                      />
                    </div>
                  </div>
                ) : (
                  /* --- STUDENT ACADEMIC PATH --- */
                  <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Educational Institution</label>
                      <input
                        placeholder="College/School Name"
                        onChange={(e) => setProfileData({ ...profileData, college: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current CGPA</label>
                        <input
                          type="number" step="0.01"
                          onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Class 12 Marks (%)</label>
                        <input
                          type="number"
                          onChange={(e) => setProfileData({ ...profileData, class12: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Highest Qualification</label>
                        <select
                          onChange={(e) => setProfileData({ ...profileData, highestDegree: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        >
                          <option value="Class 12">Class 12</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Undergraduate">Postgraduate</option>
                          <option value="Undergraduate">PhD</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Current Degree</label>
                        <select
                          onChange={(e) => setProfileData({ ...profileData, currentDegree: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        >
                          <option value="Class 12">Class 12</option>
                          <option value="Diploma">Diploma</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Undergraduate">Postgraduate</option>
                          <option value="Undergraduate">PhD</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Field of Study</label>
                        <select
                          onChange={(e) => setProfileData({ ...profileData, fieldOfStudy: e.target.value })}
                          className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg text-sm"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Medical">Medical</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleProfileSubmit}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-bold shadow-lg transition-transform active:scale-95 mt-2"
                >
                  Finalize Professional Account
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Add Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 transition-colors">
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-white">Add New Scholarship</h3>
            <div className="space-y-6 max-w-2xl mx-auto p-8">
              <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                  <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Scholarship</h2>
                  </div>

                  {/* Scrollable Body */}
                  <div className="p-6 overflow-y-auto space-y-4 custom-scrollbar scrollbar-hide">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                      {/* Name & Provider */}
                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-slate-600">Name</label>
                        <input className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, name: e.target.value })} />
                      </div>
                      <div className="md:col-span-1">
                        <label className="text-sm font-semibold text-slate-600">Provider</label>
                        <input className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, provider: e.target.value })} />
                      </div>

                      {/* Amount & Deadline */}
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Amount (INR)</label>
                        <input type="number" className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, amount: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Deadline</label>
                        <input type="date" className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, deadline: e.target.value })} />
                      </div>

                      {/* Degree Level & Category */}
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Degree Level</label>
                        <select className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, degreeLevel: e.target.value })}>
                          <option value="">Select Level</option>
                          <option value="Undergraduate">Undergraduate</option>
                          <option value="Postgraduate">Postgraduate</option>
                          <option value="PhD">PhD</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Category</label>
                        <input className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          placeholder="e.g. Merit" onChange={e => setNewScholarship({ ...newScholarship, category: e.target.value })} />
                      </div>
                      {/* LINK */}
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-600">Official Website URL</label>
                        <input
                          type="url"
                          className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          placeholder="https://example.com/scholarship"
                          onChange={e => setNewScholarship({ ...newScholarship, officialUrl: e.target.value })} />
                      </div>

                      {/* GPA & Eligibility (Array Input) */}
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Min GPA</label>
                        <input type="number" step="0.1" className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          onChange={e => setNewScholarship({ ...newScholarship, gpaRequirement: Number(e.target.value) })} />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-slate-600">Eligibility (comma separated)</label>
                        <input className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg"
                          placeholder="Income < 2L, Indian Citizen"
                          onChange={e => setNewScholarship({ ...newScholarship, eligibility: e.target.value.split(',').map(item => item.trim()) })} />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-slate-600">Description</label>
                        <textarea className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg h-20 resize-none"
                          onChange={e => setNewScholarship({ ...newScholarship, description: e.target.value })} />
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                    <button onClick={() => setShowAdminModal(false)} className="flex-1 py-2 rounded-lg text-slate-500">Cancel</button>
                    <button onClick={handleAddScholarship} className="flex-[2] bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700">Save</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatBot />
    </div>
  );
};


export default App;