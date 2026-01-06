import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Clock, RefreshCw } from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import { Application, ApplicationStatus, ScholarshipForm } from '../types';
import ProfileHeader from './ProfileHeader';
import { getAdminScholarships, getAdminApplications, updateApplicationStatus } from '../services/adminApi';
import { getStudentApplications } from '../services/api';

const Dashboard = ({ t, currentUser, scholarships, setView }) => {
  // Admin State
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [allScholarships, setAllScholarships] = useState<ScholarshipForm[]>([]);
  
  // Student State
  const [myApplications, setMyApplications] = useState<any[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // --- DATA FETCHING ---

  const fetchAdminData = useCallback(async () => {
    try {
      const [scholRes, appRes] = await Promise.all([
        getAdminScholarships(currentUser.id || currentUser._id),
        getAdminApplications()
      ]);

      // Process Admin Data
      const cleanedApps = appRes.map((app: any) => ({
        ...app,
        studentName: app.studentId?.name || 'Unknown',
        displayUID: (app.studentId?._id || "").toString().slice(-6).toUpperCase(),
        scholarshipName: app.scholarshipId?.name || 'Deleted Scholarship',
        rawScholarshipId: app.scholarshipId?._id || app.scholarshipId,
        status: app.status,
      }));

      const scholWithCounts = scholRes.map((schol: any) => ({
        ...schol,
        applicantCount: cleanedApps.filter((a: any) => a.rawScholarshipId === (schol._id || schol.id)).length || 0
      }));

      setAllScholarships(scholWithCounts);
      setAllApplications(cleanedApps);
    } catch (error) {
      console.error("Admin Fetch Error:", error);
    }
  }, [currentUser]);

  const fetchStudentData = useCallback(async () => {
    try {
      const apps = await getStudentApplications();
      console.log("FROM API (Student Apps):", apps);
      setMyApplications(apps);
    } catch (error) {
      console.error("Student Fetch Error:", error);
    }
  }, []);

  // --- EFFECT: INITIAL LOAD & POLLING ---

  useEffect(() => {
    if (!currentUser) return;

    const loadInitialData = async () => {
      setIsLoading(true);
      if (currentUser.role === 'admin') {
        await fetchAdminData();
      } else {
        await fetchStudentData();
      }
      setIsLoading(false);
    };

    loadInitialData();

    // AUTOMATIC POLLING: 
    let intervalId: NodeJS.Timeout;

    if (currentUser.role !== 'admin') {
      intervalId = setInterval(() => {
        setIsRefreshing(true);
        fetchStudentData().finally(() => setIsRefreshing(false));
      }, 10000); 
    }

    return () => clearInterval(intervalId);
  }, [currentUser, fetchAdminData, fetchStudentData]);


  // --- ADMIN ACTIONS ---

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
    const previous = [...allApplications];
   
    setAllApplications(prev => prev.map(app => 
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));

    try {
      await updateApplicationStatus(applicationId, newStatus);
    } catch (error: any) {
      alert("Update failed. Reverting...");
      setAllApplications(previous);
    }
  };

  // --- MEMOIZED STUDENT DATA (The Fix) ---

  const userApplications = useMemo(() => {
    if (!myApplications || myApplications.length === 0) return [];
    
    return myApplications.map(app => {
      // Handle both _id and id, and ensure strings
      const appIdString = app.scholarshipId?._id 
        ? app.scholarshipId._id.toString() 
        : app.scholarshipId?.toString();

      // Find details from the 'scholarships' prop passed to Dashboard
      const details = scholarships?.find((s: any) => {
        const sId = s._id || s.id;
        return sId?.toString() === appIdString;
      });

      return {
        id: app.id || app._id,
        scholarshipName: details?.name || app.scholarshipId?.name || 'Loading Name...',
        provider: details?.provider || 'Organization',
        status: app.status || 'Applied',
        
      };
    });
  }, [myApplications, scholarships]);


  if (!currentUser) return <div className="text-center mt-20">{t.applyPrompt}</div>;
  if (isLoading) return <div className="text-center py-20">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 scrollbar-hide">
      <ProfileHeader user={currentUser} />

      {/* ADMIN VIEW */}
      {currentUser.role === 'admin' ? (
        <AdminDashboard
          myScholarships={allScholarships}
          studentApplications={allApplications}
          updateStatus={handleUpdateStatus}
        />
      ) : (
        
        /* STUDENT VIEW */
        <>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Clock className="text-teal-500" /> {t.dashboard}
            </h3>
            {isRefreshing && <span className="text-xs text-slate-400 flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Syncing...</span>}
          </div>

          {userApplications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Search className="mx-auto text-slate-400 mb-4" size={40} />
              <p className="text-slate-500 dark:text-slate-400 mb-4">No active applications found.</p>
              <button
                onClick={() => setView('browse')}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-all"
              >
                Browse Scholarships
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm">Scholarship</th>
                    <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {userApplications.map(app => (
                    <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 dark:text-slate-200">{app.scholarshipName}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{app.provider}</div>
                      </td>
                      
                      {/* Dynamic Status Badge */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-500 ${
                          app.status === 'Approved' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400' 
                            : app.status === 'Rejected'
                            ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400'
                            : 'bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-400'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            app.status === 'Approved' ? 'bg-emerald-500' : app.status === 'Rejected' ? 'bg-rose-500' : 'bg-sky-500'
                          }`} />
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;