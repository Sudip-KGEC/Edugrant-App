import React from 'react'

const AddScholarshipModal = ({ newScholarship, setNewScholarship, handleAddScholarship, setShowAdminModal }) => {
  return (
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
                <button onClick={handleAddScholarship} className="flex-2 bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddScholarshipModal