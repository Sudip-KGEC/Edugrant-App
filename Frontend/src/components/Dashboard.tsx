import React, { useState, useEffect } from 'react';
import { Search, Clock} from 'lucide-react';
import axios from 'axios';
import AdminDashboard from './AdminDashboard';
import { Application, ApplicationStatus, ScholarshipForm } from '../../types';
import ProfileHeader from './ProfileHeader';

const Dashboard = ({ t, currentUser, scholarships, setView }) => {
  const [allApplications, setAllApplications] = useState<Application[]>([]);
  const [allScholarships, setAllScholarships] = useState<ScholarshipForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!currentUser || currentUser?.role !== 'admin') {
        setIsLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Fetch both datasets simultaneously for better performance
        const [scholRes, appRes] = await Promise.all([
          axios.get(`/api/scholarships?adminId=${currentUser.id || currentUser._id}`, config),
          axios.get('/api/scholarships/admin/applications', config)
        ]);
        //  Clean and map application data
        const cleanedApplications = appRes.data.map((app: any) => ({
          ...app,
          id: app._id || app.id,
          studentName: app.studentId?.name || 'Unknown Student',
          displayUID: (app.studentId?._id || "").toString().slice(-6).toUpperCase(),
          scholarshipName: app.scholarshipId?.name || 'Scholarship Deleted',
          rawScholarshipId: app.scholarshipId?._id || app.scholarshipId,
          status: app.status as ApplicationStatus,
          college: app.studentId?.college || 'N/A',
          cgpa: app.studentId?.cgpa || '0.0',
          class12Marks: app.studentId?.class12Marks || '0'
        }));

        const scholarshipsWithCounts = scholRes.data.map((schol: any) => {
          const sId = schol._id || schol.id;
          const count = cleanedApplications.filter(a => a.rawScholarshipId === sId).length;
          return {
            ...schol,
            applicantCount: count || 0
          };
        });

        // Update state
        setAllScholarships(scholarshipsWithCounts);
        setAllApplications(cleanedApplications);

      } catch (error) {
        console.error("Critical Dashboard Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [currentUser]);


  if (!currentUser) {
    return <div className="text-center mt-20 text-slate-500 dark:text-slate-400">{t.applyPrompt}</div>;
  }

  const handleUpdateStatus = async (applicationId: string, newStatus: ApplicationStatus) => {
  
    const previousApplications = [...allApplications];

    setAllApplications(prev =>
      prev.map(app => (app.id === applicationId || (app as any)._id === applicationId) ? { ...app, status: newStatus } : app)
    );

    try {
      const token = localStorage.getItem('token');
      await axios.patch('/api/scholarships/admin/update-status',
        { applicationId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      alert("Failed to update status on server. Reverting...");
      setAllApplications(previousApplications);
    }
  };

  const userApplications = (currentUser.appliedScholarships || []).map(id => {
    const details = scholarships.find(s => (s._id === id || s.id === id));
    return {
      id: id,
      scholarshipName: details?.name || 'Unknown Scholarship',
      provider: details?.provider || 'Details pending...',
      status: 'Applied' as ApplicationStatus
    };
  });

  if (isLoading) return <div className="text-center py-20">Loading Dashboard...</div>;




  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <ProfileHeader user={currentUser} />

      {/* Content Logic */}
      {currentUser.role === 'admin' ? (
        <AdminDashboard
          myScholarships={allScholarships}
          studentApplications={allApplications}
          updateStatus={handleUpdateStatus}
        />
      ) : (
        <>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="text-teal-500" /> {t.dashboard}
          </h3>
          {userApplications.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <Search className="mx-auto text-slate-400 mb-4" size={40} />
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-lg">No active applications found.</p>
              <button
                onClick={() => setView('browse')}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition-all shadow-md hover:shadow-teal-500/20"
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
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800">
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