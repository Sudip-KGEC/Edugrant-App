
import React , {useEffect, useRef} from 'react'
import { X, ArrowLeft } from 'lucide-react'

const AuthModal = ({  authStep, setAuthStep, authEmail, setAuthEmail, authOtp, setAuthOtp, handleSendOtp, handleVerifyOtp, handleBack, setShowAuthModal, t, setProfileData, profileData, handleProfileSubmit }) => {

  const otpInputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (authStep === 'otp') {
    otpInputRef.current?.focus();
  }
}, [authStep]);


  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 scroballbar-hide">
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
                ref={otpInputRef}
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

              {/* Admin Path
              <button
                onClick={() => {
                  setProfileData({ ...profileData, role: 'admin' });
                  setAuthStep('profile');
                }}
                className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-teal-500 transition-all group text-left"
              >
                <div className="bg-teal-100 dark:bg-teal-500/10 p-3 rounded-lg mr-4 group-hover:bg-teal-500/20">
                  <span className="text-2xl">🏢</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">Admin</h4>
                  <p className="text-xs text-slate-500">Manage scholarships and users</p>
                </div>
              </button> */}
              
            </div>
          </div>
        )}

        {authStep === 'profile' && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto px-1 scrollbar-hide">
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
              <div className="space-y-4 animate-in fade-in slide-in-from-left duration-500 scrollbar-hide">
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
  )
}

export default AuthModal