'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Job } from '@/lib/db';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  LogOut,
  FolderOpen,
  Building,
  GraduationCap,
  Calendar,
  IndianRupee,
  MapPin,
  X,
  Sparkles,
  Loader2
} from 'lucide-react';

interface AdminDashboardProps {
  initialJobs: Job[];
}

export default function AdminDashboard({ initialJobs }: AdminDashboardProps) {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal overlays states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Form Field States
  const [form, setForm] = useState({
    title: '',
    company: '',
    category: 'Pharma Job Updates',
    type: 'Full-time',
    qualification: 'B.Pharm',
    location: '',
    salary: '',
    experience: '',
    description: '',
    responsibilitiesRaw: '',
    requirementsRaw: '',
    benefitsRaw: '',
    applyUrl: ''
  });

  const categories = [
    'Pharma Job Updates',
    'Government Pharma Jobs',
    'Private Pharma Jobs',
    'Staff Nurse Jobs',
    'Paramedical Jobs',
    'JRF & SRF Jobs',
    'Other Jobs'
  ];

  const qualifications = [
    'B.Pharm', 'D.Pharm', 'M.Pharm', 'BSc', 'MSc', 'Diploma', 'PhD', 'JRF', 'SRF', 'Staff Nurse'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  // Handle opening Create Form
  const handleOpenAdd = () => {
    setForm({
      title: '',
      company: '',
      category: 'Pharma Job Updates',
      type: 'Full-time',
      qualification: 'B.Pharm',
      location: '',
      salary: '',
      experience: '',
      description: '',
      responsibilitiesRaw: '',
      requirementsRaw: '',
      benefitsRaw: '',
      applyUrl: ''
    });
    setShowAddModal(true);
  };

  // Handle opening Edit Form
  const handleOpenEdit = (job: Job) => {
    setSelectedJob(job);
    setForm({
      title: job.title,
      company: job.company,
      category: job.category,
      type: job.type,
      qualification: job.qualification,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      description: job.description,
      responsibilitiesRaw: job.responsibilities ? job.responsibilities.join('\n') : '',
      requirementsRaw: job.requirements ? job.requirements.join('\n') : '',
      benefitsRaw: job.benefits ? job.benefits.join('\n') : '',
      applyUrl: job.applyUrl
    });
    setShowEditModal(true);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/adminlogin');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Process Creating Job
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Parse raw multi-line strings into arrays
    const responsibilities = form.responsibilitiesRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const requirements = form.requirementsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const benefits = form.benefitsRaw.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          responsibilities,
          requirements,
          benefits
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobs([data.job, ...jobs]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error('Create job error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Process Updating Job
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;
    setSubmitting(true);

    const responsibilities = form.responsibilitiesRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const requirements = form.requirementsRaw.split('\n').map(s => s.trim()).filter(Boolean);
    const benefits = form.benefitsRaw.split('\n').map(s => s.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          responsibilities,
          requirements,
          benefits
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(jobs.map(j => (j.id === selectedJob.id ? data.job : j)));
        setShowEditModal(false);
      }
    } catch (err) {
      console.error('Update job error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Process Deleting Job
  const handleDelete = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to remove this job posting? This action is permanent!')) return;
    
    try {
      const res = await fetch(`/api/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error('Delete job error:', err);
    }
  };

  // Calculate Metrics
  const totalOpen = jobs.length;
  const govOpen = jobs.filter(j => j.category === 'Government Pharma Jobs').length;
  const pvtOpen = jobs.filter(j => j.category === 'Private Pharma Jobs').length;
  const nurseOpen = jobs.filter(j => j.category === 'Staff Nurse Jobs').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2.5">
            <ShieldCheck className="w-8 h-8 text-[#16A34A] shrink-0" />
            Administrative Portal
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            Authorized admin credentials confirmed. Create, edit, and audit daily healthcare vacancies.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleOpenAdd}
            className="flex-grow sm:flex-grow-0 px-5 py-3 bg-gradient-to-r from-[#16A34A] to-[#10B981] text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" /> Publish New Vacancy
          </button>
          <button
            onClick={handleLogout}
            className="p-3 border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-500 hover:text-green-500 rounded-xl cursor-pointer"
            title="Log Out Session"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Jobs', value: totalOpen, icon: FolderOpen, color: 'text-green-600 bg-green-50' },
          { label: 'Government Positions', value: govOpen, icon: ShieldCheck, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Private Industries', value: pvtOpen, icon: Building, color: 'text-teal-600 bg-teal-50' },
          { label: 'Nursing Vacancies', value: nurseOpen, icon: Sparkles, color: 'text-green-600 bg-green-50' }
        ].map((met, i) => {
          const Icon = met.icon;
          return (
            <div key={i} className="bg-white border border-slate-100 shadow-md p-6 rounded-2xl flex items-center justify-between">
              <div>
                <span className="block text-2xl font-extrabold text-slate-800">{met.value}</span>
                <span className="block text-[11px] font-bold text-slate-450 uppercase mt-1">{met.label}</span>
              </div>
              <div className={`p-3 rounded-xl ${met.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Vacancies List Table */}
      <div className="bg-white border border-slate-100 shadow-md rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center gap-4 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-800 text-sm">Active Job Publications Database</h3>
          <span className="text-xs font-bold text-[#16A34A] bg-green-50 border border-green-100 rounded-full px-3 py-1">
            {jobs.length} Positions Active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase bg-slate-50/30">
                <th className="p-5">Job Details</th>
                <th className="p-5">Eligibility / Category</th>
                <th className="p-5">Location / Date</th>
                <th className="p-5 text-right">Administrative Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-655">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                    {/* Title & Company */}
                    <td className="p-5">
                      <div className="font-extrabold text-slate-800 leading-tight text-sm line-clamp-1">{job.title}</div>
                      <div className="text-slate-450 text-[11px] font-semibold mt-0.5">{job.company}</div>
                    </td>
                    {/* Qualification & Category */}
                    <td className="p-5 space-y-1">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded">
                        {job.qualification}
                      </span>
                      <div className="text-[10px] font-bold text-[#16A34A]">{job.category}</div>
                    </td>
                    {/* Location & Posted date */}
                    <td className="p-5 space-y-0.5">
                      <div className="text-slate-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</div>
                      <div className="text-slate-400 text-[10px] flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-350" /> {job.postedDate}</div>
                    </td>
                    {/* CRUD buttons */}
                    <td className="p-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(job)}
                          className="p-2 border border-slate-200 hover:border-[#16A34A] hover:bg-green-50 text-slate-500 hover:text-[#16A34A] rounded-lg cursor-pointer"
                          title="Edit Posting"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 border border-slate-200 hover:border-green-300 hover:bg-green-50 text-slate-500 hover:text-green-650 rounded-lg cursor-pointer"
                          title="Remove Posting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-10 text-center text-slate-400">
                    No active positions found in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL (ADD JOB) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#16A34A]" />
                Publish Daily Vacancy
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-450 hover:text-slate-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Wrapper */}
            <form onSubmit={handleAddSubmit} className="overflow-y-auto p-6 space-y-4 flex-grow">
              {/* Row 1: Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vacancy Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Drug Inspector, Pharmacist"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employer Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cipla, Apollo Hospitals"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Row 2: Category, Type & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree Qualification</label>
                  <select
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {qualifications.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Location, Salary & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Package</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹28,000 - ₹35,000 / month"
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Needed</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freshers, 1-3 years"
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Description Overview</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide deep description of the vacancy role..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                />
              </div>

              {/* Arrays parsing blocks (multi-line textarea helper) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-green-600 block">Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Perform shop-floor checks&#10;Verify line clearances"
                    value={form.responsibilitiesRaw}
                    onChange={(e) => setForm({ ...form, responsibilitiesRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="GPAT Qualified&#10;Consistent academic marks"
                    value={form.requirementsRaw}
                    onChange={(e) => setForm({ ...form, requirementsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-teal-650 block">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="PF & ESI statutory bonus&#10;Rotational shifts incentives"
                    value={form.benefitsRaw}
                    onChange={(e) => setForm({ ...form, benefitsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
              </div>

              {/* Apply Direct URL/Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Email / Apply Link</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. mailto:ifactstelugu@gmail.com"
                  value={form.applyUrl}
                  onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                />
              </div>

            </form>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-[#16A34A] to-[#10B981] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Publish Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {showEditModal && selectedJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#16A34A]" />
                Modify Published Vacancy
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-450 hover:text-slate-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Scrollable Wrapper */}
            <form onSubmit={handleEditSubmit} className="overflow-y-auto p-6 space-y-4 flex-grow">
              {/* Row 1: Title & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vacancy Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employer Name</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Row 2: Category, Type & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {jobTypes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree Qualification</label>
                  <select
                    value={form.qualification}
                    onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-[#16A34A]"
                  >
                    {qualifications.map((q) => (
                      <option key={q} value={q}>{q}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Location, Salary & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Salary Package</label>
                  <input
                    type="text"
                    required
                    value={form.salary}
                    onChange={(e) => setForm({ ...form, salary: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Needed</label>
                  <input
                    type="text"
                    required
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                  />
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Description Overview</label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                />
              </div>

              {/* Arrays parsing blocks (multi-line textarea helper) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-green-600 block">Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.responsibilitiesRaw}
                    onChange={(e) => setForm({ ...form, responsibilitiesRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 block">Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.requirementsRaw}
                    onChange={(e) => setForm({ ...form, requirementsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-teal-655 block">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.benefitsRaw}
                    onChange={(e) => setForm({ ...form, benefitsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-[#16A34A] resize-none"
                  />
                </div>
              </div>

              {/* Apply Direct URL/Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Recruiter Email / Apply Link</label>
                <input
                  type="text"
                  required
                  value={form.applyUrl}
                  onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-[#16A34A]"
                />
              </div>

            </form>

            {/* Modal Footer Controls */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleEditSubmit}
                disabled={submitting}
                className="px-5 py-2.5 bg-gradient-to-r from-[#16A34A] to-[#10B981] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Modifications
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
