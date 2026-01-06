import React from 'react'
import { useState } from 'react';
import { ScholarshipForm } from '../types';
import { createScholarship } from '../services/api';

const AddScholarshipModal = ({ setShowAdminModal, setIsLoading, currentUser, setScholarships }) => {

  const [newScholarship, setNewScholarship] = useState<ScholarshipForm>({
    name: '', provider: '', amount: '', deadline: '', category: '',
    gpaRequirement: '', degreeLevel: '', description: '', eligibility: [],
    officialUrl: '', adminId: ''
  });

  const handleAddScholarship = async () => {
    if (!newScholarship.name.trim() || !newScholarship.provider.trim()) {
      alert("Scholarship Name and Provider are required.");
      return;
    }

    setIsLoading(true);
    try {
      const scholarshipPayload = {
        ...newScholarship,
        name: newScholarship.name.trim(),
        provider: newScholarship.provider.trim(),
        amount: Number(newScholarship.amount) || 0,
        gpaRequirement: Number(newScholarship.gpaRequirement) || 0,
        adminId: currentUser?.id || currentUser?.id,
        eligibility: Array.isArray(newScholarship.eligibility)
          ? newScholarship.eligibility
          : [newScholarship.eligibility]
      };

      const savedScholarship = await createScholarship(scholarshipPayload);

      // 3. Update State & UI
      setScholarships((prev) => [savedScholarship, ...prev]);
      setShowAdminModal(false);

      // Reset form
      setNewScholarship({
        name: '', provider: '', amount: '', deadline: '', category: '',
        gpaRequirement: '', degreeLevel: '', description: '', eligibility: [],
        officialUrl: '', adminId: ''
      });

    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save scholarship.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800">

        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Add New Scholarship</h2>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 scrollbar-hide" style={{ maxHeight: '70vh' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Name */}
            <div className="md:col-span-1">
              <label htmlFor="name" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Name</label>
              <input
                id="name"
                name="name"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, name: e.target.value })}
              />
            </div>

            {/* Provider */}
            <div className="md:col-span-1">
              <label htmlFor="provider" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Provider</label>
              <input
                id="provider"
                name="provider"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, provider: e.target.value })}
              />
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Amount (INR)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, amount: Number(e.target.value) })}
              />
            </div>

            {/* Deadline */}
            <div>
              <label htmlFor="deadline" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="date"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, deadline: e.target.value })}
              />
            </div>

            {/* Degree Level */}
            <div>
              <label htmlFor="degreeLevel" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Degree Level</label>
              <select
                id="degreeLevel"
                name="degreeLevel"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, degreeLevel: e.target.value })}
              >
                <option value="">Select Level</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Category</label>
              <input
                id="category"
                name="category"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                placeholder="e.g. Merit"
                onChange={e => setNewScholarship({ ...newScholarship, category: e.target.value })}
              />
            </div>

            {/* URL */}
            <div className="md:col-span-2">
              <label htmlFor="officialUrl" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Official Website URL</label>
              <input
                id="officialUrl"
                name="officialUrl"
                type="url"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                placeholder="https://example.com/scholarship"
                onChange={e => setNewScholarship({ ...newScholarship, officialUrl: e.target.value })}
              />
            </div>

            {/* GPA */}
            <div>
              <label htmlFor="gpaRequirement" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Min GPA</label>
              <input
                id="gpaRequirement"
                name="gpaRequirement"
                type="number"
                step="0.1"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, gpaRequirement: Number(e.target.value) })}
              />
            </div>

            {/* Eligibility */}
            <div>
              <label htmlFor="eligibility" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Eligibility (comma separated)</label>
              <input
                id="eligibility"
                name="eligibility"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg text-slate-800 dark:text-white"
                placeholder="Income < 2L, Indian Citizen"
                onChange={e => setNewScholarship({ ...newScholarship, eligibility: e.target.value.split(',').map(item => item.trim()) })}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="text-sm font-semibold text-slate-600 dark:text-slate-400">Description</label>
              <textarea
                id="description"
                name="description"
                className="w-full mt-1 border border-slate-300 dark:border-slate-700 bg-transparent p-2.5 rounded-lg h-20 resize-none text-slate-800 dark:text-white"
                onChange={e => setNewScholarship({ ...newScholarship, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-4 bg-slate-50 dark:bg-slate-900/50">
          <button
            type="button"
            onClick={() => setShowAdminModal(false)}
            className="flex-1 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddScholarship}
            className="flex-2 bg-teal-600 text-white py-2 rounded-lg font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20"
          >
            Save Scholarship
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddScholarshipModal