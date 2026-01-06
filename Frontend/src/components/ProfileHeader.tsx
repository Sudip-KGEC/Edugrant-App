import React from 'react'
import { User, Mail, Building2, Briefcase, IdCard, Milestone, School, Star, Award, BookOpen, GraduationCap } from 'lucide-react'
import DetailBox from './DetailBox';


const ProfileHeader = ({ user }) => {

  const isAdmin = user?.role === 'admin';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: Basic Info */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
              Welcome, {user?.name || 'User'}!
            </h2>
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Mail size={14} />
              <span className="text-sm">{user?.email}</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Role-Specific Details */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-4 lg:gap-8 border-t md:border-t-0 pt-4 md:pt-0">
          {isAdmin ? (
            <>
              <DetailBox icon={<Building2 size={16} />} label="Organization" value={user?.organization || 'TCS'} />
              <DetailBox icon={<Briefcase size={16} />} label="Department" value={user?.department || 'SDE'} />
              <DetailBox icon={<IdCard size={16} />} label="Designation" value={user?.designation || 'Senior Manager'} />
              <DetailBox icon={<Milestone size={14} />} label="Employee ID" value={user?.employeeId} />
            </>
          ) : (
            <>

              <DetailBox icon={<School size={14} />} label="College" value={user?.college} />
              <DetailBox icon={<Star size={14} />} label="CGPA" value={user?.cgpa} />
              <DetailBox icon={<Award size={14} />} label="Class 12%" value={`${user?.class12Marks}%`} />
              <DetailBox icon={<BookOpen size={14} />} label="Highest Degree" value={user?.highestDegree} />
              <DetailBox icon={<GraduationCap size={14} />} label="Current Degree" value={user?.currentDegree} />
              <DetailBox icon={<Briefcase size={14} />} label="Field" value={user?.fieldOfStudy} />

            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileHeader