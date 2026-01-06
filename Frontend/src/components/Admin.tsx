import React from 'react'
import { Plus, Trash2, Users } from 'lucide-react'

const Admin = ({ setShowAdminModal, scholarships, currentUser }) => {
  // Filter scholarships 
  const myScholarships = scholarships.filter(s => s.adminId === currentUser?.id || s.adminId === currentUser?._id);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 scrollbar-hide">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Admin Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">Manage your posted scholarship programs</p>
        </div>

        <button
          onClick={() => setShowAdminModal(true)}
          className="bg-teal-600 text-white flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Post New Scholarship
        </button>
      </div>

      {/* Stats Overview (Optional but helpful) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Active Postings</p>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{myScholarships.length}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Scholarship Name</th>
                <th className="px-6 py-4 font-semibold">Category</th>
                <th className="px-6 py-4 font-semibold">Grant Amount</th>
                <th className="px-6 py-4 font-semibold">Deadline</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {myScholarships.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                    You haven't posted any scholarships yet. Click "Post New" to begin.
                  </td>
                </tr>
              ) : (
                myScholarships.map(s => (
                  <tr key={s._id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-200">{s.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1">{s._id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-1 rounded text-[10px] font-bold">
                        {s.category || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-teal-600 dark:text-teal-400">
                      ₹{Number(s.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                      {s.deadline}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors" title="View Applicants">
                          <Users className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Admin