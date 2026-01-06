import React, { useState } from 'react';

const AdminDashboard = ({ myScholarships = [], studentApplications = [], updateStatus }) => {
  const [activeTab, setActiveTab] = useState('applications');


  const renderSafe = (val) => {
    if (val === null || val === undefined) return "";
    if (typeof val === 'object') {
      return val.name || val.label || JSON.stringify(val);
    }
    return val;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 scrollbar-hide">
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Admin Management</h3>

      <div className="flex gap-4 mb-8 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('scholarships')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'scholarships' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          My Scholarships
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-3 px-4 font-medium transition-colors ${activeTab === 'applications' ? 'border-b-2 border-teal-500 text-teal-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Student Applications
        </button>
      </div>

      {activeTab === 'scholarships' ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Scholarship Name</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Total Applicants</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myScholarships.map(s => (
                  <tr key={s._id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-4 px-6 font-medium">{renderSafe(s.name)}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${s.applicantCount > 0 ? 'text-teal-500' : 'text-slate-500'}`}>
                          {s.applicantCount || 0}
                        </span>
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Applicants</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button className="text-teal-600 hover:underline">Edit Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden scrollbar-hide">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Student Info</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Education</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Applied Scholarship</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {studentApplications.length === 0 ? (
                  <tr><td colSpan={4} className="py-10 text-center text-slate-400">No applications found.</td></tr>
                ) : (
                  studentApplications.map(app => {

                    const appId = app._id || app.id;

                    return (
                      <tr key={appId} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                        <td className="py-4 px-6">
                          {/* Detailed Student Info */}
                          <div className="font-bold text-slate-800 dark:text-white">
                            {app.studentName}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            UID: {appId.slice(-6).toUpperCase()}
                          </div>
                        </td>

                        <td className="py-4 px-6 text-sm">
                          {/* Education & Academic Merit */}
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="text-teal-500 font-bold text-[10px] uppercase block">College</span>
                            {app.college || 'N/A'}
                          </div>

                          <div className="flex gap-3 mt-2">
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold">CGPA</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{app.cgpa || '0.0'}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] text-slate-400 uppercase font-bold">12th %</span>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{app.class12Marks || '0'}%</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {/* Program Details */}
                          <div className="font-semibold text-teal-600">
                            {app.scholarshipName}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1 uppercase">
                            {app.currentDegree}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          {/* Status Select - Real-time color updates */}
                          <select
                            value={app.status}
                            onChange={(e) => updateStatus(appId, e.target.value)}
                            className={`text-xs font-black px-3 py-2 rounded-lg border-2 transition-all outline-none cursor-pointer
              ${app.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                                app.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                                  'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800'}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;