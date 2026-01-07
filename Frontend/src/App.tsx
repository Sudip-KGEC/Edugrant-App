import React, { useState, useEffect, useRef } from 'react';
import { TRANSLATIONS } from './constants';
import {Application, User, Language } from './types';
import { api, fetchScholarships, getUserProfile, registerUser, verifyOtp, sendOtp, logoutUser } from './services/api';

import ChatBot from './components/ChatBot';
import LoadingOverlay from './components/Loading';
import Home from './components/Home';
import Browse from './components/Browse';
import Dashboard from './components/Dashboard';
import Admin from './components/Admin';
import AddScholarshipModal from './components/AddScholarshipModal';
import AuthModal from './components/AuthModal';
import Navbar from './components/Navbar';

const App = () => {

  // Global App State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  });
  const [view, setView] = useState<'home' | 'browse' | 'dashboard' | 'admin'>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [scholarships, setScholarships] = useState([]);

  // // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const t = TRANSLATIONS[currentLang];


  // Browse State
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Auth Modal State
  const [authStep, setAuthStep] = useState<'email' | 'otp' | 'roleSelection' | 'profile'>('email');
  const [authEmail, setAuthEmail] = useState('');
  const [authOtp, setAuthOtp] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '', college: '', cgpa: '', class12: '', highestDegree: '',
    currentDegree: '', fieldOfStudy: '', role: '', organization: '',
    department: '', designation: '', employeeId: ''
  });

  const [showAdminModal, setShowAdminModal] = useState(false);

   


  // --- Auth Sync ---
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

  // ---Load Scholarships ---
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

  // --Theme Effect ---
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
  
 const handleLoginStart = () => {
    setAuthStep('email');
    setAuthEmail('');
    setAuthOtp('');
    setShowAuthModal(true);
  };

  const handleApply = async (schId: string) => {
    if (!currentUser) return handleLoginStart();

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
    
    } catch (error: any) {
      alert(error.response?.data?.message || 'Could not process application.');
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleBack = () => {
    if (authStep === 'profile') {
      setAuthStep('roleSelection');
    } else if (authStep === 'roleSelection') {
      setProfileData({ ...profileData, role: '' });
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
              setLoading={setIsLoading}
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
     <Navbar 
      view={view} 
      setView={setView} 
     currentUser={currentUser}
      handleLogout={handleLogout}
       handleLoginStart={handleLoginStart}
         setShowAuthModal={setShowAuthModal}
          theme={theme} 
          toggleTheme={toggleTheme} 
          currentLang={currentLang} 
          setCurrentLang={setCurrentLang} 
          t={t}
     />

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
        <AddScholarshipModal setIsLoading={setIsLoading} currentUser={currentUser} setScholarships={setScholarships} setShowAdminModal={setShowAdminModal} />
      )}

      <ChatBot />
    </div>
  );
};


export default App;
