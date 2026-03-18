import React, { useState, useEffect } from 'react'
import {
  User, Mail, Building2, Briefcase, IdCard, Milestone,
  School, Star, Award, BookOpen, GraduationCap, Pencil, Loader2
} from 'lucide-react'
import DetailBox from './DetailBox'
import { updateProfile } from '../services/api'
import toast from 'react-hot-toast'

//  TYPES
interface UserType {
  _id: string
  name: string
  email: string
  role: 'admin' | 'student'
  college?: string
  cgpa?: number
  class12Marks?: number
  highestDegree?: string
  currentDegree?: string
  fieldOfStudy?: string
  organization?: string
  department?: string
  designation?: string
  employeeId?: string
}

interface Props {
  user: UserType
}

interface FormDataType {
  college: string
  cgpa: string
  class12Marks: string
  highestDegree: string
  currentDegree: string
  fieldOfStudy: string
  organization: string
  department: string
  designation: string
  employeeId: string
}

interface FieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  type?: string
}

interface SelectFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  options?: string[]
}

const FIELD_OPTIONS = ["General", "Engineering", "Medical"]

const ProfileHeader: React.FC<Props> = ({ user }) => {
  const isAdmin = user?.role === 'admin'

  const [showEdit, setShowEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [localUser, setLocalUser] = useState<UserType>(user)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<FormDataType>({
    college: "",
    cgpa: "",
    class12Marks: "",
    highestDegree: "",
    currentDegree: "",
    fieldOfStudy: "",
    organization: "",
    department: "",
    designation: "",
    employeeId: "",
  })

  //  Sync user → form
  useEffect(() => {
    setLocalUser(user)

    setFormData({
      college: user?.college || "",
      cgpa: user?.cgpa?.toString() || "",
      class12Marks: user?.class12Marks?.toString() || "",
      highestDegree: user?.highestDegree || "",
      currentDegree: user?.currentDegree || "",
      fieldOfStudy: user?.fieldOfStudy || "",
      organization: user?.organization || "",
      department: user?.department || "",
      designation: user?.designation || "",
      employeeId: user?.employeeId || "",
    })
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  // Validation
  const validate = () => {
    if (isAdmin) return true

    const newErrors: Record<string, string> = {}

    if (!formData.college) newErrors.college = "College is required"

    if (!formData.cgpa) newErrors.cgpa = "CGPA required"
    else if (+formData.cgpa > 10) newErrors.cgpa = "Max CGPA is 10"

    if (!formData.class12Marks) newErrors.class12Marks = "Marks required"
    else if (+formData.class12Marks > 100) newErrors.class12Marks = "Max is 100%"

    if (!formData.highestDegree) newErrors.highestDegree = "Required"
    if (!formData.currentDegree) newErrors.currentDegree = "Required"
    if (!formData.fieldOfStudy) newErrors.fieldOfStudy = "Required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleUpdate = async () => {
    if (!validate()) {
      toast.error("Please fix errors ")
      return
    }

    try {
      setLoading(true)

      const payload = isAdmin
        ? {
            organization: formData.organization,
            department: formData.department,
            designation: formData.designation,
            employeeId: formData.employeeId,
          }
        : {
            college: formData.college,
            cgpa: Number(formData.cgpa),
            class12Marks: Number(formData.class12Marks),
            highestDegree: formData.highestDegree,
            currentDegree: formData.currentDegree,
            fieldOfStudy: formData.fieldOfStudy,
          }

      const res = await updateProfile(payload)

      setLocalUser(res.user)
      setShowEdit(false)

      toast.success("Profile updated 🎉")
    } catch (err) {
      console.error(err)
      toast.error("Update failed ❌")
    } finally {
      setLoading(false)
    }
  }

  const u = localUser

  return (
    <>
      {/* PROFILE CARD */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-800 shadow-sm relative">

        <button
          onClick={() => setShowEdit(true)}
          className="absolute top-1 right-1 p-2 rounded-full bg-slate-200 dark:bg-slate-800 hover:scale-110 transition"
        >
          <Pencil size={12} />
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <User size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
                Welcome, {u?.name || 'User'}!
              </h2>

              <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Mail size={14} />
                <span className="text-sm">{u?.email}</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase">
                  {u?.role}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-4 border-t md:border-0 pt-4 md:pt-0">
            {isAdmin ? (
              <>
                <DetailBox icon={<Building2 size={16} />} label="Organization" value={u?.organization} />
                <DetailBox icon={<Briefcase size={16} />} label="Department" value={u?.department} />
                <DetailBox icon={<IdCard size={16} />} label="Designation" value={u?.designation} />
                <DetailBox icon={<Milestone size={14} />} label="Employee ID" value={u?.employeeId} />
              </>
            ) : (
              <>
                <DetailBox icon={<School size={14} />} label="College" value={u?.college} />
                <DetailBox icon={<Star size={14} />} label="CGPA" value={u?.cgpa} />
                <DetailBox icon={<Award size={14} />} label="Class 12%" value={`${u?.class12Marks || ""}%`} />
                <DetailBox icon={<BookOpen size={14} />} label="Highest Degree" value={u?.highestDegree} />
                <DetailBox icon={<GraduationCap size={14} />} label="Current Degree" value={u?.currentDegree} />
                <DetailBox icon={<Briefcase size={14} />} label="Field" value={u?.fieldOfStudy} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-xl shadow-xl">

            <h2 className="text-xl font-bold mb-6">
              {isAdmin ? "Edit Admin Profile" : "Edit Academic Details"}
            </h2>

            <div className="space-y-5">

              {isAdmin ? (
                <>
                  <Field label="Organization" name="organization" value={formData.organization} onChange={handleChange} />
                  <Field label="Department" name="department" value={formData.department} onChange={handleChange} />
                  <Field label="Designation" name="designation" value={formData.designation} onChange={handleChange} />
                  <Field label="Employee ID" name="employeeId" value={formData.employeeId} onChange={handleChange} />
                </>
              ) : (
                <>
                  <Field label="Educational Institution" name="college" value={formData.college} onChange={handleChange} error={errors.college} />

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="CGPA" name="cgpa" type="number" value={formData.cgpa} onChange={handleChange} error={errors.cgpa} />
                    <Field label="Class 12 Marks (%)" name="class12Marks" type="number" value={formData.class12Marks} onChange={handleChange} error={errors.class12Marks} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <SelectField label="Highest Qualification" name="highestDegree" value={formData.highestDegree} onChange={handleChange} error={errors.highestDegree} />
                    <SelectField label="Current Degree" name="currentDegree" value={formData.currentDegree} onChange={handleChange} error={errors.currentDegree} />
                  </div>

                  <SelectField
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    error={errors.fieldOfStudy}
                    options={FIELD_OPTIONS}
                  />
                </>
              )}

            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowEdit(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
                Cancel
              </button>

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Update
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

export default ProfileHeader

// FIELD COMPONENT
const Field: React.FC<FieldProps> = ({ label, name, value, onChange, error, type = "text" }) => (
  <div>
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border outline-none border-slate-700 ${error ? "border-red-400" : "border-slate-200"} bg-white dark:bg-slate-900`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

//  SELECT COMPONENT
const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, onChange, error, options }) => (
  <div>
    <label className="text-xs font-semibold text-slate-500">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-lg border ${error ? "border-red-400" : "border-slate-200"} bg-white dark:bg-slate-900`}
    >
      <option value="">Select</option>

      {options
        ? options.map(opt => <option key={opt} value={opt}>{opt}</option>)
        : (
          <>
            <option value="Class 12">Class 12</option>
            <option value="Diploma">Diploma</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Postgraduate">Postgraduate</option>
            <option value="PhD">PhD</option>
          </>
        )}
    </select>

    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)