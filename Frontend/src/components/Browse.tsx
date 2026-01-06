import React from 'react'
import { Search, Calendar, ChevronDown, CheckCircle, ExternalLink, Award } from 'lucide-react'

const Browse = ({ t, scholarships, currentUser, searchQuery, setSearchQuery, applications, expandedId, setExpandedId, handleApply, isLoading }) => {

  const filtered = scholarships.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase());


    const matchesGPA = currentUser?.cgpa ? currentUser.cgpa >= s.gpaRequirement : true;

    return matchesSearch && matchesGPA;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 scrollbar-hide">
      {/* Search Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-teal-900 dark:text-teal-400">{t.browse}</h2>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-teal-500 transition-all outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400 text-lg">No scholarships found matching your criteria.</p>
          </div>
        ) : (
          filtered.map(s => {
            const appliedData = applications.find(a => a.scholarshipId === s._id);
            // FIXED: Optional chaining for appliedScholarships
            const isAlreadyInUserList = currentUser?.appliedScholarships?.includes(s._id);
            const hasApplied = !!appliedData || isAlreadyInUserList;
            const isExpanded = expandedId === s._id;

            return (
              <div key={s._id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col hover:shadow-md transition-all">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 leading-tight">{s.name}</h3>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                        {s.degreeLevel}
                      </span>
                      {/* FIXED: Optional chaining for eligibility check */}
                      {currentUser?.cgpa >= s.gpaRequirement && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <Award className="w-3 h-3" /> ELIGIBLE
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-teal-600 dark:text-teal-400 font-semibold text-sm mb-4">{s.provider}</p>

                  {/* Main Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div className="flex items-center text-slate-600 dark:text-slate-400 font-medium">
                      <span className="text-slate-900 dark:text-white font-bold mr-1">₹</span> {s.amount.toLocaleString('en-IN')}
                    </div>
                    <div className="flex items-center text-slate-600 dark:text-slate-400">
                      <Calendar className="w-3 h-3 mr-2 text-slate-400" /> {s.deadline ? new Date(s.deadline).toLocaleDateString('en-GB') : 'N/A'}
                    </div>
                  </div>

                  {/* Toggle Details Button */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : s._id)}
                    className="text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center hover:text-teal-700 transition-colors mb-2"
                  >
                    {isExpanded ? 'Hide Details' : 'View Full Details'}
                    <ChevronDown className={`ml-1 w-3 h-3 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {isExpanded && (
                    <div className="mt-3 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-xs text-slate-600 dark:text-slate-400 animate-in fade-in zoom-in-95 duration-200">
                      <p className="mb-3 leading-relaxed">{s.description}</p>
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1">
                        <p><strong>Category:</strong> {s.category}</p>
                        <p><strong>Eligibility:</strong> Minimum {s.gpaRequirement} GPA Required</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action */}
                <div className="mt-auto border-t border-slate-100 dark:border-slate-800 p-4 flex justify-between items-center bg-slate-50/30 dark:bg-slate-900/30">
                  {s.officialUrl ? (
                    <a
                      href={s.officialUrl.startsWith('http') ? s.officialUrl : `https://${s.officialUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:underline font-bold"
                    >
                      Website <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : <div />}

                  {/* FIXED LINE 110: Added optional chaining currentUser?.role */}
                  {currentUser?.role === 'admin' ? (
                    <div className="  px-3 py-2 md:mt-4 md:p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                      <p className="text-sm text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-2">
                        <span>Apply here:</span>
                        <a
                          href={s.officialUrl?.startsWith('http') ? s.officialUrl : `https://${s.officialUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline break-all"
                        >
                          {s.officialUrl}
                        </a>
                      </p>
                    </div>
                  ) : (
                    <>
                      {hasApplied ? (
                        <button
                          disabled
                          className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 px-5 py-2 rounded-lg text-sm font-bold border border-slate-200 dark:border-slate-700"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          {appliedData?.status || "Applied"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleApply(s._id)}
                          disabled={isLoading || !currentUser}
                          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${isLoading || !currentUser
                            ? 'bg-slate-400 cursor-not-allowed text-white'
                            : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-teal-200 dark:hover:shadow-none'
                            }`}
                        >
                          {!currentUser ? 'Login to Apply' : (isLoading ? 'Processing...' : t.apply)}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  )
}

export default Browse;