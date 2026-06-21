'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Job, JobApplyPart, ApplyLink } from '@/lib/db';
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
  Loader2,
  Search,
  Menu,
  Briefcase,
  Wrench,
  Share2,
  Layers,
  Users,
  Key,
  ChevronDown
} from 'lucide-react';

const getCategoryIcon = (catName: string) => {
  const name = catName.toLowerCase();
  if (name.includes('government') || name.includes('govt')) return ShieldCheck;
  if (name.includes('private')) return Building;
  if (name.includes('nurse') || name.includes('paramedical')) return GraduationCap;
  if (name.includes('engineering')) return Wrench;
  return Briefcase;
};

interface DateTimePicker12hProps {
  value: string;
  onChange: (val: string) => void;
}

function DateTimePicker12h({ value, onChange }: DateTimePicker12hProps) {
  // value is expected to be "YYYY-MM-DDTHH:MM" local format
  let dateVal = '';
  let hourVal = '12';
  let minuteVal = '00';
  let ampmVal = 'AM';

  if (value) {
    const parts = value.split('T');
    if (parts.length === 2) {
      dateVal = parts[0];
      const timeParts = parts[1].split(':');
      if (timeParts.length >= 2) {
        let h = parseInt(timeParts[0], 10);
        const m = parseInt(timeParts[1], 10);
        if (!isNaN(h)) {
          if (h >= 12) {
            ampmVal = 'PM';
            h = h > 12 ? h - 12 : 12;
          } else {
            ampmVal = 'AM';
            h = h === 0 ? 12 : h;
          }
          hourVal = String(h);
        }
        if (!isNaN(m)) {
          minuteVal = String(m).padStart(2, '0');
        }
      }
    }
  }

  const handleUpdate = (newDate: string, newHour: string, newMinute: string, newAmpm: string) => {
    if (!newDate) {
      onChange('');
      return;
    }
    let h = parseInt(newHour, 10);
    if (isNaN(h)) h = 12;
    if (newAmpm === 'PM') {
      if (h < 12) h += 12;
    } else {
      if (h === 12) h = 0;
    }
    const formattedHour = String(h).padStart(2, '0');
    const formattedMinute = String(newMinute).padStart(2, '0');
    onChange(`${newDate}T${formattedHour}:${formattedMinute}`);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Date Pick Input */}
      <div className="flex-1 relative">
        <input
          type="date"
          value={dateVal}
          onChange={(e) => handleUpdate(e.target.value, hourVal, minuteVal, ampmVal)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-primary"
        />
      </div>

      {/* 12-Hour Time Selector Container */}
      <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-700">
        <div className="flex items-center gap-1">
          {/* Hour Dropdown */}
          <select
            value={hourVal}
            onChange={(e) => handleUpdate(dateVal, e.target.value, minuteVal, ampmVal)}
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none border-none cursor-pointer pr-1"
          >
            {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((h) => (
              <option key={h} value={h}>
                {h.padStart(2, '0')}
              </option>
            ))}
          </select>

          <span className="text-slate-400 font-bold text-xs">:</span>

          {/* Minute Dropdown */}
          <select
            value={minuteVal}
            onChange={(e) => handleUpdate(dateVal, hourVal, e.target.value, ampmVal)}
            className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none border-none cursor-pointer pr-1"
          >
            {Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0')).map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* AM/PM Button Group */}
        <div className="flex gap-0.5 bg-slate-200/50 p-0.5 rounded-lg ml-1 shrink-0">
          <button
            type="button"
            onClick={() => handleUpdate(dateVal, hourVal, minuteVal, 'AM')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
              ampmVal === 'AM'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            AM
          </button>
          <button
            type="button"
            onClick={() => handleUpdate(dateVal, hourVal, minuteVal, 'PM')}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
              ampmVal === 'PM'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            PM
          </button>
        </div>
      </div>
    </div>
  );
}

interface AdminDashboardProps {
  initialJobs: Job[];
  adminRole?: 'SUPER ADMIN' | 'ADMIN';
  adminUsername?: string;
  initialCategories?: string[];
}

export default function AdminDashboard({ initialJobs, adminRole = 'ADMIN', adminUsername, initialCategories }: AdminDashboardProps) {
  const router = useRouter();
  const isSuperAdmin = adminRole === 'SUPER ADMIN' || adminUsername === 'admin@pharmagmail.com' || adminUsername?.includes('superadmin');
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal overlays states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [showAddSlideModal, setShowAddSlideModal] = useState(false);
  const [showEditSlideModal, setShowEditSlideModal] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any | null>(null);

  // Tab & search layout state
  const [activeTab, setActiveTab] = useState<string>(
    initialCategories && initialCategories.length > 0 ? initialCategories[0] : 'Government Jobs'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);

  // Slide management states
  const [slides, setSlides] = useState<any[]>([]);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const [submittingSlide, setSubmittingSlide] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingJobImage, setUploadingJobImage] = useState(false);
  const [slideForm, setSlideForm] = useState({
    title: '',
    image: '',
    path: ''
  });

  // Social configuration states
  const [socialLinks, setSocialLinks] = useState({
    whatsapp: '',
    telegram: '',
    instagram: '',
    linkedin: '',
    youtube: ''
  });
  const [loadingLinks, setLoadingLinks] = useState(false);
  const [savingLinks, setSavingLinks] = useState(false);
  const [linksSuccessMessage, setLinksSuccessMessage] = useState('');
  const [linksErrorMessage, setLinksErrorMessage] = useState('');

  // Dynamic Categories Management States
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [newCategoryNameInput, setNewCategoryNameInput] = useState('');
  const [categories, setCategories] = useState<string[]>(
    initialCategories && initialCategories.length > 0
      ? initialCategories
      : [
          'Government Jobs',
          'Private Jobs',
          'Engineering Jobs',
          'Other Jobs'
        ]
  );
  const [newCategoryName, setNewCategoryName] = useState('');
  const [savingCategories, setSavingCategories] = useState(false);
  const [categoriesSuccessMessage, setCategoriesSuccessMessage] = useState('');
  const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('');
  const [categoryRenames, setCategoryRenames] = useState<Record<string, string>>({});
  const [categoryDeletions, setCategoryDeletions] = useState<string[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');

  const handleCreateCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategoryNameInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      alert('Category already exists.');
      return;
    }
    
    const updatedCategories = [...categories, trimmed];
    setSavingCategories(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCategories })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(updatedCategories);
        setShowAddCategoryModal(false);
        setNewCategoryNameInput('');
      } else {
        alert(data.error || 'Failed to add category.');
      }
    } catch (err) {
      console.error('Failed to add category:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSavingCategories(false);
    }
  };

  const handleDeleteCategoryDirect = async (nameToRemove: string) => {
    if (categories.length <= 1) {
      alert('You must keep at least one category.');
      return;
    }
    if (!confirm(`Are you absolutely sure you want to delete the category "${nameToRemove}"? All jobs under this category will be moved to the default fallback category.`)) {
      return;
    }

    const updatedCategories = categories.filter((c) => c !== nameToRemove);
    setSavingCategories(true);

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories: updatedCategories,
          deletions: [nameToRemove]
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategories(updatedCategories);
        if (activeTab === nameToRemove) {
          setActiveTab(updatedCategories[0] || 'Government Jobs');
        }
        alert(`Category "${nameToRemove}" successfully deleted!`);
      } else {
        alert(data.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error('Failed to delete category:', err);
      alert('An unexpected error occurred.');
    } finally {
      setSavingCategories(false);
    }
  };

  const handleSaveCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCategories(true);
    setCategoriesSuccessMessage('');
    setCategoriesErrorMessage('');

    try {
      const res = await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categories,
          renames: categoryRenames,
          deletions: categoryDeletions
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCategoriesSuccessMessage('Categories list successfully updated!');
        setCategoryRenames({});
        setCategoryDeletions([]);
        setTimeout(() => setCategoriesSuccessMessage(''), 4000);
      } else {
        setCategoriesErrorMessage(data.error || 'Failed to update categories.');
      }
    } catch (err) {
      console.error('Failed to save categories:', err);
      setCategoriesErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSavingCategories(false);
    }
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      setCategoriesErrorMessage('Category already exists.');
      return;
    }
    setCategories([...categories, trimmed]);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (nameToRemove: string) => {
    if (categories.length <= 1) {
      setCategoriesErrorMessage('You must keep at least one category.');
      return;
    }
    setCategories(categories.filter((c) => c !== nameToRemove));
    setCategoryDeletions((prev) => [...prev, nameToRemove]);
  };

  const handleStartEditCategory = (cat: string) => {
    setEditingCategory(cat);
    setEditingCategoryValue(cat);
  };

  const handleCancelEditCategory = () => {
    setEditingCategory(null);
    setEditingCategoryValue('');
  };

  const handleSaveInlineCategory = (oldName: string) => {
    const trimmed = editingCategoryValue.trim();
    if (!trimmed || trimmed === oldName) {
      setEditingCategory(null);
      return;
    }
    if (categories.includes(trimmed)) {
      setCategoriesErrorMessage('Category already exists.');
      return;
    }
    setCategories(categories.map((c) => (c === oldName ? trimmed : c)));
    
    setCategoryRenames((prev) => {
      const updated = { ...prev };
      let foundOriginalKey = oldName;
      for (const [key, value] of Object.entries(prev)) {
        if (value === oldName) {
          foundOriginalKey = key;
          break;
        }
      }
      updated[foundOriginalKey] = trimmed;
      return updated;
    });

    setEditingCategory(null);
    setEditingCategoryValue('');
  };

  // Assistant credentials states
  const [adminsList, setAdminsList] = useState<any[]>([]);
  const [loadingAdmins, setLoadingAdmins] = useState(false);
  const [savingAdmins, setSavingAdmins] = useState(false);
  const [adminsSuccessMessage, setAdminsSuccessMessage] = useState('');
  const [adminsErrorMessage, setAdminsErrorMessage] = useState('');

  // Fetch social configurations on mount
  useEffect(() => {
    async function fetchLinks() {
      setLoadingLinks(true);
      try {
        const res = await fetch('/api/social-links');
        const data = await res.json();
        if (res.ok && data.success && data.links) {
          setSocialLinks(data.links);
        }
      } catch (err) {
        console.error('Failed to fetch social links:', err);
      } finally {
        setLoadingLinks(false);
      }
    }
    async function fetchSlides() {
      setLoadingSlides(true);
      try {
        const res = await fetch('/api/hero-slides');
        const data = await res.json();
        if (res.ok && data.success && data.slides) {
          setSlides(data.slides);
        }
      } catch (err) {
        console.error('Failed to fetch hero slides:', err);
      } finally {
        setLoadingSlides(false);
      }
    }
    async function fetchAdmins() {
      if (!isSuperAdmin) return;
      setLoadingAdmins(true);
      try {
        const res = await fetch('/api/admin-credentials');
        const data = await res.json();
        if (res.ok && data.success && data.admins) {
          setAdminsList(data.admins);
        }
      } catch (err) {
        console.error('Failed to fetch admins list:', err);
      } finally {
        setLoadingAdmins(false);
      }
    }
    fetchLinks();
    fetchSlides();
    fetchAdmins();
  }, [isSuperAdmin, adminUsername, adminRole]);

  const handleSaveAdmins = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAdmins(true);
    setAdminsSuccessMessage('');
    setAdminsErrorMessage('');

    try {
      const res = await fetch('/api/admin-credentials', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admins: adminsList })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdminsSuccessMessage('Assistant credentials successfully updated!');
        setTimeout(() => setAdminsSuccessMessage(''), 4000);
      } else {
        setAdminsErrorMessage(data.error || 'Failed to update credentials.');
      }
    } catch (err) {
      console.error('Failed to save credentials:', err);
      setAdminsErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSavingAdmins(false);
    }
  };

  const handleAddAdminRow = () => {
    setAdminsList((prev) => [...prev, { username: '', password: '' }]);
  };

  const handleRemoveAdminRow = (idx: number) => {
    setAdminsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateAdminRow = (idx: number, field: 'username' | 'password', value: string) => {
    setAdminsList((prev) =>
      prev.map((admin, i) => (i === idx ? { ...admin, [field]: value } : admin))
    );
  };

  const handleSaveSocialLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingLinks(true);
    setLinksSuccessMessage('');
    setLinksErrorMessage('');

    try {
      const res = await fetch('/api/social-links', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(socialLinks)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLinksSuccessMessage('Social links successfully updated!');
        setTimeout(() => setLinksSuccessMessage(''), 4000);
      } else {
        setLinksErrorMessage(data.error || 'Failed to update social links.');
      }
    } catch (err) {
      console.error('Failed to save social links:', err);
      setLinksErrorMessage('An unexpected error occurred while saving.');
    } finally {
      setSavingLinks(false);
    }
  };



  // Form Field States
  const [form, setForm] = useState({
    title: '',
    company: '',
    category: (initialCategories && initialCategories.length > 0) ? initialCategories[0] : 'Government Jobs',
    type: 'Full-time',
    qualification: 'B.Pharm',
    location: '',
    salary: '',
    experience: '',
    description: '',
    responsibilitiesRaw: '',
    requirementsRaw: '',
    benefitsRaw: '',
    applyUrl: '',
    recruiterEmail: '',
    imageUrl: '',
    imageUrls: [] as string[],
    applyParts: [] as JobApplyPart[],
    scheduledTime: ''
  });



  const qualifications = [
    'B.Pharm', 'D.Pharm', 'M.Pharm', 'BSc', 'MSc', 'Diploma', 'PhD', 'JRF', 'SRF', 'Staff Nurse', 'B.Tech'
  ];

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship'];

  // Handle opening Create Form
  const handleOpenAdd = () => {
    setForm({
      title: '',
      company: '',
      category: categories[0] || 'Government Jobs',
      type: 'Full-time',
      qualification: 'B.Pharm',
      location: '',
      salary: 'N/A',
      experience: '',
      description: '',
      responsibilitiesRaw: '',
      requirementsRaw: '',
      benefitsRaw: '',
      applyUrl: '',
      recruiterEmail: '',
      imageUrl: '',
      imageUrls: [] as string[],
      applyParts: [] as JobApplyPart[],
      scheduledTime: ''
    });
    setShowAddModal(true);
  };

  // Handle opening Edit Form
  const handleOpenEdit = (job: Job) => {
    setSelectedJob(job);
    const isEmail = job.applyUrl ? job.applyUrl.startsWith('mailto:') : false;
    const emailVal = isEmail ? job.applyUrl.replace('mailto:', '') : '';
    const linkVal = isEmail ? '' : (job.applyUrl || '');

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
      applyUrl: linkVal,
      recruiterEmail: emailVal,
      imageUrl: job.imageUrl || '',
      imageUrls: job.imageUrls || (job.imageUrl ? [job.imageUrl] : []),
      applyParts: job.applyParts || [],
      scheduledTime: job.scheduledTime ? new Date(new Date(job.scheduledTime).getTime() - new Date(job.scheduledTime).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : ''
    });
    setShowEditModal(true);
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      if (isSuperAdmin) {
        router.push('/superadminlogin');
      } else {
        router.push('/assistantlogin');
      }
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
    const calculatedApplyUrl = form.recruiterEmail
      ? `mailto:${form.recruiterEmail.trim()}`
      : (form.applyUrl || form.applyParts?.[0]?.applyLinks?.[0]?.url || 'mailto:pharmajobsdaily@gmail.com');

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          applyUrl: calculatedApplyUrl,
          scheduledTime: form.scheduledTime ? new Date(form.scheduledTime).toISOString() : undefined,
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
    const calculatedApplyUrl = form.recruiterEmail
      ? `mailto:${form.recruiterEmail.trim()}`
      : (form.applyUrl || form.applyParts?.[0]?.applyLinks?.[0]?.url || 'mailto:pharmajobsdaily@gmail.com');

    try {
      const res = await fetch(`/api/jobs/${selectedJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          applyUrl: calculatedApplyUrl,
          scheduledTime: form.scheduledTime ? new Date(form.scheduledTime).toISOString() : null,
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

  // Slide CRUD handlers
  const handleOpenAddSlide = () => {
    setSlideForm({ title: '', image: '', path: '' });
    setShowAddSlideModal(true);
  };

  const handleOpenEditSlide = (slide: any) => {
    setSelectedSlide(slide);
    setSlideForm({ title: slide.title, image: slide.image, path: slide.path });
    setShowEditSlideModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setSlideForm((prev) => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('An error occurred during upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleJobImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingJobImage(true);
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (res.ok && data.success && data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.error(data.error || 'Failed to upload image');
        }
      }

      if (uploadedUrls.length > 0) {
        setForm((prev) => {
          const newUrls = [...(prev.imageUrls || []), ...uploadedUrls];
          return {
            ...prev,
            imageUrl: newUrls[0] || prev.imageUrl,
            imageUrls: newUrls
          };
        });
      }
    } catch (err) {
      console.error('Failed to upload images:', err);
      alert('An error occurred during upload.');
    } finally {
      setUploadingJobImage(false);
    }
  };

  const handleRemoveJobImage = (indexToRemove: number) => {
    setForm((prev) => {
      const newUrls = (prev.imageUrls || []).filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        imageUrl: newUrls[0] || '',
        imageUrls: newUrls
      };
    });
  };

  const handleAddApplyPart = () => {
    setForm((prev) => ({
      ...prev,
      applyParts: [
        ...(prev.applyParts || []),
        {
          id: `part-${Date.now()}`,
          title: '',
          imageUrl: '',
          applyLinks: [{ label: 'Apply Now', url: '' }]
        }
      ]
    }));
  };

  const handleRemoveApplyPart = (partId: string) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).filter((p) => p.id !== partId)
    }));
  };

  const handleUpdatePartTitle = (partId: string, title: string) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).map((p) =>
        p.id === partId ? { ...p, title } : p
      )
    }));
  };

  const handleAddPartLink = (partId: string) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).map((p) =>
        p.id === partId
          ? { ...p, applyLinks: [...p.applyLinks, { label: 'Apply Now', url: '' }] }
          : p
      )
    }));
  };

  const handleRemovePartLink = (partId: string, linkIndex: number) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).map((p) =>
        p.id === partId
          ? {
              ...p,
              applyLinks: p.applyLinks.filter((_, idx) => idx !== linkIndex)
            }
          : p
      )
    }));
  };

  const handleUpdatePartLink = (
    partId: string,
    linkIndex: number,
    field: 'label' | 'url',
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).map((p) =>
        p.id === partId
          ? {
              ...p,
              applyLinks: p.applyLinks.map((l, idx) =>
                idx === linkIndex ? { ...l, [field]: value } : l
              )
            }
          : p
      )
    }));
  };

  const handlePartImageUpload = async (partId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingJobImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success && data.url) {
        setForm((prev) => ({
          ...prev,
          applyParts: (prev.applyParts || []).map((p) =>
            p.id === partId ? { ...p, imageUrl: data.url } : p
          )
        }));
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('An error occurred during upload.');
    } finally {
      setUploadingJobImage(false);
    }
  };

  const handleRemovePartImage = (partId: string) => {
    setForm((prev) => ({
      ...prev,
      applyParts: (prev.applyParts || []).map((p) =>
        p.id === partId ? { ...p, imageUrl: '' } : p
      )
    }));
  };

  const handleAddSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingSlide(true);
    try {
      const res = await fetch('/api/hero-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSlides([...slides, data.slide]);
        setShowAddSlideModal(false);
      }
    } catch (err) {
      console.error('Failed to create slide:', err);
    } finally {
      setSubmittingSlide(false);
    }
  };

  const handleEditSlideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlide) return;
    setSubmittingSlide(true);
    try {
      const res = await fetch(`/api/hero-slides/${selectedSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideForm)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSlides(slides.map((s) => (s.id === selectedSlide.id ? data.slide : s)));
        setShowEditSlideModal(false);
      }
    } catch (err) {
      console.error('Failed to update slide:', err);
    } finally {
      setSubmittingSlide(false);
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to remove this slide banner?')) return;
    try {
      const res = await fetch(`/api/hero-slides/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSlides(slides.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete slide:', err);
    }
  };

  // Filter jobs by active tab & search keyword
  const filteredJobs = jobs.filter((job) => {
    let matchesTab = false;
    if (activeTab === 'scheduled') {
      matchesTab = !!job.scheduledTime;
    } else if (activeTab === 'all') {
      matchesTab = true;
    } else {
      matchesTab = job.category.toLowerCase() === activeTab.toLowerCase();
    }
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate Metrics for sidebar / widgets
  const countScheduled = jobs.filter(j => !!j.scheduledTime).length;

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-[#F8FAFC]">
      
      {/* LEFT SIDEBAR - Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-[#00469b] to-[#002b66] text-white h-full shrink-0 shadow-xl border-r border-white/10">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-accent" />
          </div>
          <div>
            <span className="block font-extrabold tracking-tight text-lg leading-none">Pharma Jobs</span>
            <span className="block text-[10px] font-bold tracking-widest text-accent uppercase mt-1">
              {adminRole === 'SUPER ADMIN' ? 'Super Admin Portal' : 'Assistant Admin Portal'}
            </span>
          </div>
        </div>

        {/* Sidebar Navigation Tabs */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <span className="block px-3 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3">
            Navigation
          </span>
          
          {/* Collapsible Categories Section */}
          <div className="space-y-1">
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer text-white/80 hover:bg-white/5 hover:text-white"
            >
              <div className="flex items-center gap-3">
                <FolderOpen className="w-4.5 h-4.5 text-white/60" />
                <span>Categories</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-200 ${categoriesExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {categoriesExpanded && (
              <div className="pl-4 space-y-1 border-l border-white/10 ml-6">
                {categories.map((cat) => {
                  const active = activeTab === cat;
                  const Icon = getCategoryIcon(cat);
                  const count = jobs.filter(j => j.category.toLowerCase() === cat.toLowerCase()).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveTab(cat);
                        setSearchTerm('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-white text-primary shadow-lg shadow-black/5'
                          : 'text-white/80 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4.5 h-4.5 ${active ? 'text-primary' : 'text-white/60'}`} />
                        <span className="truncate max-w-[120px] text-left">{cat}</span>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full border ${
                        active 
                          ? 'bg-primary-light text-primary border-primary/20' 
                          : 'bg-white/10 text-white/70 border-white/10'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Standard Navigation Tabs */}
          {[
            { id: 'scheduled', label: 'Scheduled Posts', icon: Calendar, count: countScheduled },
            { id: 'slides', label: 'Hero Slides', icon: Layers, count: null },
            { id: 'settings', label: 'Social Links & Categories', icon: Share2, count: null },
            ...(isSuperAdmin
              ? [{ id: 'credentials', label: 'Manage Assistants', icon: Users, count: null }]
              : [])
          ].map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearchTerm('');
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-white text-primary shadow-lg shadow-black/5 transform translate-x-1'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-primary' : 'text-white/60'}`} />
                  <span className="truncate max-w-[140px] text-left">{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                    active 
                      ? 'bg-primary-light text-primary border-primary/20' 
                      : 'bg-white/10 text-white/70 border-white/10'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-black/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-red-500/10 hover:text-red-300 border border-white/10 hover:border-red-500/20 text-white/80 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <div className="md:hidden flex flex-col w-full bg-[#00469b] text-white border-b border-white/10 shrink-0">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-accent" />
            <span className="font-extrabold tracking-tight text-sm">
              {adminRole === 'SUPER ADMIN' ? 'PJD Super Admin' : 'PJD Assistant Admin'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="p-2 bg-emerald-500 hover:bg-emerald-650 text-white rounded-lg shadow-md flex items-center justify-center cursor-pointer"
              title="New Category"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setShowDeleteCategoryModal(true)}
              className="p-2 bg-rose-500 hover:bg-rose-650 text-white rounded-lg shadow-md flex items-center justify-center cursor-pointer"
              title="Delete Category"
            >
              <Trash2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleOpenAdd}
              className="p-2 bg-gradient-to-r from-accent to-accent-hover text-slate-900 rounded-lg shadow-md flex items-center justify-center cursor-pointer"
              title="Publish New"
            >
              <Plus className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-white/20 bg-white/10 rounded-lg hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer"
            >
              <Menu className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Menu */}
        {mobileMenuOpen && (
          <div className="px-4 pb-4 space-y-1.5 border-t border-white/10 pt-3 bg-[#00367a] animate-fade-in max-h-[80vh] overflow-y-auto">
            {/* Collapsible Categories Section */}
            <div className="space-y-1">
              <button
                onClick={() => setCategoriesExpanded(!categoriesExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-white/80 hover:bg-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-4 h-4 text-white/60" />
                  <span>Categories</span>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-white/60 transition-transform ${categoriesExpanded ? 'rotate-180' : ''}`} />
              </button>
              
              {categoriesExpanded && (
                <div className="pl-3 space-y-1 border-l border-white/10 ml-5">
                  {categories.map((cat) => {
                    const active = activeTab === cat;
                    const Icon = getCategoryIcon(cat);
                    const count = jobs.filter(j => j.category.toLowerCase() === cat.toLowerCase()).length;
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveTab(cat);
                          setSearchTerm('');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          active
                            ? 'bg-white text-primary'
                            : 'text-white/80 hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[160px] text-left">{cat}</span>
                        </div>
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-primary-light text-primary' : 'bg-white/10 text-white/70'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Standard Navigation Tabs */}
            {[
              { id: 'scheduled', label: 'Scheduled Posts', icon: Calendar, count: countScheduled },
              { id: 'slides', label: 'Hero Slides', icon: Layers, count: null },
              { id: 'settings', label: 'Social Links & Categories', icon: Share2, count: null },
              ...(isSuperAdmin
                ? [{ id: 'credentials', label: 'Manage Assistants', icon: Users, count: null }]
                : [])
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSearchTerm('');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? 'bg-white text-primary'
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span className="truncate max-w-[200px] text-left">{tab.label}</span>
                  </div>
                  {tab.count !== null && (
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                      active ? 'bg-primary-light text-primary' : 'bg-white/10 text-white/70'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
            <div className="pt-2 border-t border-white/10 mt-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-300 text-xs font-bold rounded-xl border border-red-500/20 cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Logout Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:h-full overflow-y-auto min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-100 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-sm">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2 capitalize">
              {activeTab === 'settings' 
                ? 'Configure Social Links & Categories' 
                : activeTab === 'slides' 
                ? 'Hero Slides Manager' 
                : activeTab === 'scheduled' 
                ? 'Scheduled Postings' 
                : activeTab === 'credentials' 
                ? 'Manage Assistant Credentials' 
                : activeTab === 'all' 
                ? 'All Active Openings' 
                : `${activeTab} Portal`}
            </h1>
            <p className="text-slate-450 text-[11px] sm:text-xs font-medium mt-1">
              {activeTab === 'settings' && 'Update social links and configure/edit categories for the active jobs board.'}
              {activeTab === 'slides' && 'Add, edit, or delete slide banners displayed on the landing page hero carousel.'}
              {activeTab === 'scheduled' && 'Monitor scheduling queue status, upcoming publish timings, and activation states.'}
              {activeTab === 'credentials' && 'Create, edit, or delete login credentials for your assistant admins.'}
              {activeTab === 'all' && 'Review and audit all pharmaceutical and healthcare vacancies.'}
              {!['settings', 'slides', 'scheduled', 'credentials', 'all'].includes(activeTab) && `Manage and publish vacancies under the ${activeTab} category.`}
            </p>
          </div>

          {activeTab !== 'settings' && activeTab !== 'credentials' && (
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeTab !== 'slides' && (
                <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search this sector..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-inner"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 text-[10px] font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}

              {activeTab === 'slides' ? (
                <button
                  onClick={handleOpenAddSlide}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> 
                  <span>New Banner Slide</span>
                </button>
              ) : (
                <div className="hidden md:flex gap-2.5">
                  <button
                    onClick={() => setShowAddCategoryModal(true)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" /> 
                    <span className="hidden sm:inline">New Category</span>
                    <span className="sm:hidden">Category</span>
                  </button>
                  <button
                    onClick={() => setShowDeleteCategoryModal(true)}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-750 text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg transition-all shrink-0 cursor-pointer"
                  >
                    <Trash2 className="w-4.5 h-4.5" /> 
                    <span className="hidden sm:inline">Delete Category</span>
                    <span className="sm:hidden">Delete</span>
                  </button>
                  <button
                    onClick={handleOpenAdd}
                    className="px-4 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-xs font-bold text-white rounded-xl shadow-md flex items-center justify-center gap-1.5 hover:shadow-lg transition-all shrink-0 cursor-pointer"
                  >
                    <Plus className="w-4.5 h-4.5" /> 
                    <span className="hidden sm:inline">New Vacancy</span>
                    <span className="sm:hidden">Add</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main workstation area */}
        {activeTab === 'settings' ? (
          <main className="flex-grow p-6 md:p-8 max-w-3xl w-full mx-auto overflow-y-auto space-y-8">
            {/* Social Links Card */}
            <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">Social Communities Links</h2>
                <p className="text-xs text-slate-450">Configure the destination URLs for the header, popup, and banner community buttons.</p>
              </div>

              {linksSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-255 text-emerald-700 rounded-2xl text-xs font-bold animate-fade-in flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  {linksSuccessMessage}
                </div>
              )}

              {linksErrorMessage && (
                <div className="p-4 bg-red-50 border border-red-150 text-red-650 rounded-2xl text-xs font-bold animate-fade-in">
                  {linksErrorMessage}
                </div>
              )}

              {loadingLinks ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-xs font-bold">Retrieving channel configurations...</span>
                </div>
              ) : (
                <form onSubmit={handleSaveSocialLinks} className="space-y-6">
                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                      WhatsApp Channel Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://whatsapp.com/channel/..."
                      value={socialLinks.whatsapp}
                      onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  {/* Telegram */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0088cc]" />
                      Telegram Channel Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://t.me/..."
                      value={socialLinks.telegram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, telegram: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  {/* Instagram */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-[#833ab4] to-[#fcb045]" />
                      Instagram Page Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://instagram.com/..."
                      value={socialLinks.instagram}
                      onChange={(e) => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#0077b5]" />
                      LinkedIn Page Link
                    </label>
                    <input
                      type="url"
                      required
                      placeholder="https://linkedin.com/company/..."
                      value={socialLinks.linkedin}
                      onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  {/* YouTube */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FF0000]" />
                      YouTube Channel Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://youtube.com/@yourchannel"
                      value={socialLinks.youtube || ''}
                      onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm"
                    />
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingLinks}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                      {savingLinks && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Save Social Configurations
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Category Management Card */}
            <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">Job Categories Manager</h2>
                <p className="text-xs text-slate-450">Add or remove categories used to organize and filter job vacancies.</p>
              </div>

              {categoriesSuccessMessage && (
                <div className="p-4 bg-emerald-50 border border-emerald-255 text-emerald-700 rounded-2xl text-xs font-bold animate-fade-in flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  {categoriesSuccessMessage}
                </div>
              )}

              {categoriesErrorMessage && (
                <div className="p-4 bg-red-50 border border-red-150 text-red-650 rounded-2xl text-xs font-bold animate-fade-in">
                  {categoriesErrorMessage}
                </div>
              )}

              {/* Add New Category Form */}
              <div className="flex gap-2 items-center pb-4 border-b border-slate-100">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Enter new category name e.g., Biotech Jobs"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary focus:bg-white transition-all shadow-sm font-semibold"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className="px-5 py-3.5 bg-primary text-white text-xs font-bold rounded-xl shadow-md cursor-pointer hover:bg-primary-hover hover:shadow-lg transition-all whitespace-nowrap"
                >
                  Add Category
                </button>
              </div>

              {/* List of active categories */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Categories List ({categories.length})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {categories.map((cat) => (
                    <div 
                      key={cat}
                      className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-semibold text-slate-700"
                    >
                      {editingCategory === cat ? (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            value={editingCategoryValue}
                            onChange={(e) => setEditingCategoryValue(e.target.value)}
                            className="flex-grow px-2 py-1 bg-white border border-slate-250 rounded-lg text-xs font-bold focus:outline-none focus:border-primary"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveInlineCategory(cat)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                            title="Save"
                          >
                            <ShieldCheck className="w-4.5 h-4.5" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEditCategory}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="truncate pr-2">{cat}</span>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleStartEditCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-light rounded-lg transition-colors cursor-pointer"
                              title="Edit name"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(cat)}
                              className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="Remove category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Save categories button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveCategories}
                  disabled={savingCategories}
                  className="px-6 py-3 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  {savingCategories && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Categories List
                </button>
              </div>
            </div>
          </main>
        ) : activeTab === 'credentials' ? (
          <main className="flex-grow p-6 md:p-8 max-w-3xl w-full mx-auto overflow-y-auto">
            <div className="bg-white border border-slate-100 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 animate-fade-in">
              <div className="space-y-1">
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary" /> Assistant Login Credentials
                </h2>
                <p className="text-xs text-slate-450">Create and manage accounts for your assistants to manage the site details.</p>
              </div>

              {loadingAdmins ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-450">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-xs font-bold">Fetching admin registry...</span>
                </div>
              ) : (
                <form onSubmit={handleSaveAdmins} className="space-y-6">
                  {adminsSuccessMessage && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                      {adminsSuccessMessage}
                    </div>
                  )}

                  {adminsErrorMessage && (
                    <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 shrink-0" />
                      {adminsErrorMessage}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Assistant Accounts</span>
                      <button
                        type="button"
                        onClick={handleAddAdminRow}
                        className="px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Assistant
                      </button>
                    </div>

                    {adminsList.length === 0 ? (
                      <div className="py-6 text-center text-xs font-semibold text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        No assistant accounts created. Click "+ Add Assistant" to create one.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {adminsList.map((admin, idx) => (
                          <div key={idx} className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-slate-50/50 p-4 border border-slate-150 rounded-2xl relative group">
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider font-semibold">Username / Email</label>
                              <input
                                type="text"
                                required
                                placeholder="assistant@gmail.com"
                                value={admin.username}
                                onChange={(e) => handleUpdateAdminRow(idx, 'username', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-bold shadow-sm"
                              />
                            </div>
                            <div className="flex-1 w-full space-y-1">
                              <label className="text-[10px] font-extrabold text-slate-450 uppercase tracking-wider font-semibold">Password</label>
                              <input
                                type="text"
                                required
                                placeholder="Enter secure password"
                                value={admin.password || ''}
                                onChange={(e) => handleUpdateAdminRow(idx, 'password', e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary font-mono shadow-sm"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdminRow(idx)}
                              className="p-2 text-slate-400 hover:text-red-600 transition-colors border border-slate-200 hover:border-red-200 bg-white hover:bg-red-50 rounded-xl cursor-pointer shrink-0"
                              title="Delete Account"
                            >
                              <Trash2 className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingAdmins}
                      className="px-6 py-3 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-2 hover:shadow-lg transition-all"
                    >
                      {savingAdmins && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      Save Credentials Registry
                    </button>
                  </div>
                </form>
              )}
            </div>
          </main>
        ) : activeTab === 'slides' ? (
          <main className="flex-grow p-6 md:p-8 max-w-5xl w-full mx-auto overflow-y-auto">
            <div className="bg-white border border-slate-100 shadow-md rounded-3xl overflow-hidden transition-all duration-300">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight flex items-center gap-2">
                  Hero Slides Registry
                  <span className="text-[10px] font-extrabold text-slate-400 tracking-normal font-normal">
                    (Showing {slides.length} slide banners)
                  </span>
                </h3>
              </div>

              {/* Desktop view */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase bg-slate-50/30">
                      <th className="p-4 sm:p-5">Banner Preview</th>
                      <th className="p-4 sm:p-5">Slide Details</th>
                      <th className="p-4 sm:p-5">Click Destination Link</th>
                      <th className="p-4 sm:p-5 text-right">Administrative Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-655">
                    {loadingSlides ? (
                      <tr>
                        <td colSpan={4} className="p-16 text-center text-slate-450">
                          <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                          <div className="font-bold">Retrieving banner slides...</div>
                        </td>
                      </tr>
                    ) : slides.length > 0 ? (
                      slides.map((slide) => (
                        <tr key={slide.id} className="hover:bg-slate-50/30 transition-colors">
                          {/* Banner Image Preview */}
                          <td className="p-4 sm:p-5 w-40 shrink-0">
                            <div className="relative w-32 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                              <img
                                src={slide.image}
                                alt={slide.title}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </td>
                          {/* Slide Title */}
                          <td className="p-4 sm:p-5">
                            <div className="font-extrabold text-slate-800 leading-tight text-sm line-clamp-1">{slide.title}</div>
                            <div className="text-slate-455 text-[10px] font-semibold mt-0.5">ID: {slide.id}</div>
                          </td>
                          {/* Slide Path */}
                          <td className="p-4 sm:p-5 font-mono text-slate-500 text-[11px] max-w-xs truncate">
                            {slide.path}
                          </td>
                          {/* CRUD buttons */}
                          <td className="p-4 sm:p-5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                onClick={() => handleOpenEditSlide(slide)}
                                className="p-2 border border-slate-200 hover:border-primary hover:bg-primary-light text-slate-500 hover:text-primary rounded-lg cursor-pointer transition-colors"
                                title="Edit Slide"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteSlide(slide.id)}
                                className="p-2 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                                title="Delete Slide"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-16 text-center text-slate-450 space-y-3">
                          <FolderOpen className="w-10 h-10 text-slate-350 mx-auto" />
                          <div className="font-extrabold text-sm text-slate-700">No active slide banners published</div>
                          <p className="text-xs text-slate-400 max-w-sm mx-auto">
                            Click "New Banner Slide" at the top to publish your first banner slide.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="block md:hidden divide-y divide-slate-100">
                {loadingSlides ? (
                  <div className="p-12 text-center text-slate-450">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto mb-2" />
                    <div className="font-bold">Retrieving banner slides...</div>
                  </div>
                ) : slides.length > 0 ? (
                  slides.map((slide) => (
                    <div key={slide.id} className="p-4 space-y-4 hover:bg-slate-50/20 transition-colors">
                      <div className="flex gap-4 items-start">
                        {/* Slide image left */}
                        <div className="relative w-24 h-16 shrink-0 rounded-xl border border-slate-100 overflow-hidden bg-slate-50">
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Slide info right */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="font-extrabold text-slate-800 text-xs line-clamp-2 leading-tight">{slide.title}</div>
                          <div className="text-slate-450 text-[9px] font-semibold">ID: {slide.id}</div>
                          <div className="font-mono text-slate-500 text-[10px] truncate" title={slide.path}>
                            {slide.path}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100/60">
                        <button
                          onClick={() => handleOpenEditSlide(slide)}
                          className="px-3 py-1.5 border border-slate-200 hover:border-primary hover:bg-primary-light text-slate-500 hover:text-primary rounded-lg cursor-pointer transition-colors text-xs font-bold flex items-center gap-1"
                          title="Edit Slide"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide.id)}
                          className="px-3 py-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-lg cursor-pointer transition-colors text-xs font-bold flex items-center gap-1"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center text-slate-450 space-y-3">
                    <FolderOpen className="w-8 h-8 text-slate-355 mx-auto" />
                    <div className="font-extrabold text-sm text-slate-700">No active slide banners published</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Click "New Banner Slide" at the top to publish your first banner slide.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        ) : (
          <main className="flex-grow p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {[
              { label: 'Active Openings', value: jobs.filter(j => !j.scheduledTime).length, icon: Briefcase, color: 'text-secondary bg-secondary/10 border-secondary/15' },
              { label: 'Scheduled Posts', value: countScheduled, icon: Calendar, color: 'text-accent-sky bg-accent-sky/10 border-accent-sky/15' },
              { label: 'Total Postings', value: jobs.length, icon: Sparkles, color: 'text-amber-600 bg-amber-50 border-amber-100' }
            ].map((met, i) => {
              const Icon = met.icon;
              return (
                <div key={i} className="bg-white border border-slate-100 shadow-md p-4 sm:p-5 rounded-2xl flex items-center justify-between relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">{met.label}</span>
                    <span className="block text-2xl font-extrabold text-slate-800 leading-tight">{met.value}</span>
                  </div>
                  <div className={`p-2.5 rounded-xl border ${met.color} shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Vacancies List Table */}
          <div className="bg-white border border-slate-100 shadow-md rounded-3xl overflow-hidden transition-all duration-300">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-850 text-xs sm:text-sm tracking-tight flex items-center gap-2">
                Active Registry
                <span className="text-[10px] font-extrabold text-slate-400 tracking-normal font-normal">
                  (Showing {filteredJobs.length} of {jobs.length})
                </span>
              </h3>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-450 uppercase bg-slate-50/30">
                    <th className="p-4 sm:p-5">Job Details</th>
                    <th className="p-4 sm:p-5">Eligibility / Category</th>
                    <th className="p-4 sm:p-5">
                      {activeTab === 'scheduled' ? 'Scheduling Status & Time' : 'Location / Date'}
                    </th>
                    <th className="p-4 sm:p-5 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-655">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50/30 transition-colors">
                        {/* Title & Company */}
                        <td className="p-4 sm:p-5">
                          <div className="flex flex-col">
                            <div className="flex flex-wrap items-center gap-1.5 font-bold">
                              <span className="font-extrabold text-slate-800 leading-tight text-sm line-clamp-1">{job.title}</span>
                              {job.scheduledTime && new Date(job.scheduledTime) > new Date() && (
                                <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded">
                                  Scheduled: {new Date(job.scheduledTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-455 text-[11px] font-semibold mt-0.5">{job.company}</div>
                          </div>
                        </td>
                        {/* Qualification & Category */}
                        <td className="p-4 sm:p-5 space-y-1">
                          <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded">
                            {job.qualification}
                          </span>
                          <div className="text-[10px] font-bold text-primary">{job.category}</div>
                        </td>
                        {/* Location / Date OR Scheduling Status & Time */}
                        {activeTab === 'scheduled' ? (
                          <td className="p-4 sm:p-5 space-y-1.5 text-slate-700">
                            {job.scheduledTime && new Date(job.scheduledTime) > new Date() ? (
                              <>
                                <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full shadow-sm animate-pulse">
                                  Pending / Scheduled
                                </span>
                                <div className="text-[10px] font-extrabold text-slate-505 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                  Run: {new Date(job.scheduledTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full shadow-sm">
                                  Published / Active
                                </span>
                                <div className="text-[10px] font-extrabold text-slate-505 flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  Live: {job.scheduledTime ? new Date(job.scheduledTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                                </div>
                              </>
                            )}
                          </td>
                        ) : (
                          <td className="p-4 sm:p-5 space-y-0.5">
                            <div className="text-slate-600 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                              <span className="line-clamp-1">{job.location}</span>
                            </div>
                            <div className={`text-[10px] font-extrabold flex items-center gap-1 ${job.postedBy === 'ADMIN' ? 'text-emerald-600' : 'text-primary'}`}>
                              <Calendar className="w-3.5 h-3.5 shrink-0" /> 
                              {(() => {
                                if (!job.postedDate) return '';
                                const parts = job.postedDate.split('-');
                                if (parts.length === 3) {
                                  return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                }
                                return job.postedDate;
                              })()}
                            </div>
                          </td>
                        )}
                        {/* CRUD buttons */}
                        <td className="p-4 sm:p-5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(job)}
                              className="p-2 border border-slate-200 hover:border-primary hover:bg-primary-light text-slate-500 hover:text-primary rounded-lg cursor-pointer transition-colors"
                              title="Edit Posting"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(job.id)}
                              className="p-2 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
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
                      <td colSpan={4} className="p-16 text-center text-slate-450 space-y-3">
                        <FolderOpen className="w-10 h-10 text-slate-355 mx-auto" />
                        <div className="font-extrabold text-sm text-slate-700">
                          {activeTab === 'scheduled' 
                            ? 'No scheduled postings found' 
                            : 'No active positions matching criteria'}
                        </div>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          {activeTab === 'scheduled'
                            ? 'Create or edit a vacancy and set a Schedule Publish Date & Time to queue it.'
                            : 'Try adjusting your search keywords or switch sectors to find other publications.'}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="block md:hidden divide-y divide-slate-100">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <div key={job.id} className="p-4 space-y-3 hover:bg-slate-50/20 transition-colors">
                    {/* Job Title & Company */}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-slate-800 text-sm leading-snug">{job.title}</span>
                        {job.scheduledTime && new Date(job.scheduledTime) > new Date() && (
                          <span className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded">
                            Scheduled: {new Date(job.scheduledTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-450 text-[11px] font-semibold">{job.company}</div>
                    </div>

                    {/* Eligibility & Sector Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block text-[10px] font-bold px-2 py-0.5 bg-slate-50 border border-slate-200 text-slate-655 rounded">
                        {job.qualification}
                      </span>
                      <span className="text-[10px] font-bold text-primary">{job.category}</span>
                    </div>

                    {/* Location, Date, Scheduling Status */}
                    <div className="space-y-2 pt-2 border-t border-slate-100/60 text-[11px]">
                      {activeTab === 'scheduled' ? (
                        <div className="space-y-2">
                          <div>
                            {job.scheduledTime && new Date(job.scheduledTime) > new Date() ? (
                              <span className="inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-600 rounded-full">
                                Pending / Scheduled
                              </span>
                            ) : (
                              <span className="inline-flex items-center text-[9px] font-extrabold px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full">
                                Published / Active
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] font-extrabold text-slate-550 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>
                              {job.scheduledTime && new Date(job.scheduledTime) > new Date() ? 'Run: ' : 'Live: '}
                              {job.scheduledTime ? new Date(job.scheduledTime).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{job.location}</span>
                          </div>
                          <div className={`text-[10px] font-extrabold flex items-center gap-1.5 ${job.postedBy === 'ADMIN' ? 'text-emerald-600' : 'text-primary'}`}>
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Posted: {(() => {
                                if (!job.postedDate) return '';
                                const parts = job.postedDate.split('-');
                                if (parts.length === 3) {
                                  return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                }
                                return job.postedDate;
                              })()}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100/60">
                      <button
                        onClick={() => handleOpenEdit(job)}
                        className="px-3 py-1.5 border border-slate-200 hover:border-primary hover:bg-primary-light text-slate-500 hover:text-primary rounded-lg cursor-pointer transition-colors text-xs font-bold flex items-center gap-1"
                        title="Edit Posting"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="px-3 py-1.5 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-lg cursor-pointer transition-colors text-xs font-bold flex items-center gap-1"
                        title="Remove Posting"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-slate-450 space-y-3">
                  <FolderOpen className="w-8 h-8 text-slate-355 mx-auto" />
                  <div className="font-extrabold text-sm text-slate-700">
                    {activeTab === 'scheduled' 
                      ? 'No scheduled postings found' 
                      : 'No active positions matching criteria'}
                  </div>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    {activeTab === 'scheduled'
                      ? 'Create or edit a vacancy and set a Schedule Publish Date & Time to queue it.'
                      : 'Try adjusting your search keywords or switch sectors to find other publications.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      )}
      </div>

      {/* CREATE MODAL (ADD JOB) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Row 2: Category & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree Qualification</label>
                  <div className="space-y-2">
                    <select
                      value={qualifications.includes(form.qualification) ? form.qualification : "Other"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, qualification: val === "Other" ? "" : val });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-primary"
                    >
                      {qualifications.map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                      <option value="Other">Other (Type Custom)</option>
                    </select>
                    
                    {(!qualifications.includes(form.qualification) || form.qualification === "") && (
                      <input
                        type="text"
                        required
                        placeholder="Type custom qualification (e.g. M.Tech, Pharm.D)..."
                        value={form.qualification}
                        onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary animate-fade-in"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Location & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Arrays parsing blocks (multi-line textarea helper) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Perform shop-floor checks&#10;Verify line clearances"
                    value={form.responsibilitiesRaw}
                    onChange={(e) => setForm({ ...form, responsibilitiesRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-accent-sky block">Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="GPAT Qualified&#10;Consistent academic marks"
                    value={form.requirementsRaw}
                    onChange={(e) => setForm({ ...form, requirementsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-secondary block">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="PF & ESI statutory bonus&#10;Rotational shifts incentives"
                    value={form.benefitsRaw}
                    onChange={(e) => setForm({ ...form, benefitsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Apply Link & Recruiter Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Apply Link / URL <span className="text-slate-350 font-normal normal-case">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="https://company.com/careers/apply"
                    value={form.applyUrl}
                    onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Recruiter Email <span className="text-slate-350 font-normal normal-case">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. hr@company.com"
                    value={form.recruiterEmail}
                    onChange={(e) => setForm({ ...form, recruiterEmail: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Schedule Post */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Schedule Publish Date & Time <span className="text-slate-300 font-normal normal-case">(optional)</span>
                </label>
                <DateTimePicker12h
                  value={form.scheduledTime}
                  onChange={(val) => setForm({ ...form, scheduledTime: val })}
                />
              </div>



              {/* Poster-Apply Sections Builder */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">
                      Poster-Apply Sections (Advanced)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Configure custom groups of specific poster images paired with custom apply links.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddApplyPart}
                    className="px-3 py-1.5 bg-primary-light text-primary hover:bg-primary/10 border border-primary/20 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {form.applyParts && form.applyParts.length > 0 && (
                  <div className="space-y-4">
                    {form.applyParts.map((part, partIdx) => (
                      <div
                        key={part.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-4 shadow-sm"
                      >
                        {/* Remove Section Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveApplyPart(part.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-655 cursor-pointer"
                          title="Delete Section"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Section #{partIdx + 1}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Image Dropzone Left */}
                          <div className="md:col-span-4 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                              Section Image (Optional)
                            </label>
                            {part.imageUrl ? (
                              <div className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center group shadow-inner">
                                <img
                                  src={part.imageUrl}
                                  alt="Part Poster"
                                  className="max-w-full max-h-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePartImage(part.id)}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  Remove Image
                                </button>
                              </div>
                            ) : (
                              <div className="relative aspect-square rounded-xl border border-dashed border-slate-200 hover:border-primary transition-all bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer">
                                {uploadingJobImage ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Upload Poster</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handlePartImageUpload(part.id, e)}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Title & Link Details Right */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Section Title / Role Label
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Apply for Pharmacist positions, B.Pharm Vacancy"
                                value={part.title || ''}
                                onChange={(e) => handleUpdatePartTitle(part.id, e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                              />
                            </div>

                            {/* Section Link List */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Apply Links
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddPartLink(part.id)}
                                  className="text-[9px] font-extrabold text-primary hover:underline cursor-pointer"
                                >
                                  + Add Link
                                </button>
                              </div>

                              <div className="space-y-2">
                                {part.applyLinks.map((link, linkIdx) => (
                                  <div key={linkIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Button Label (e.g. Apply Now)"
                                      value={link.label}
                                      onChange={(e) =>
                                        handleUpdatePartLink(
                                          part.id,
                                          linkIdx,
                                          'label',
                                          e.target.value
                                        )
                                      }
                                      className="w-1/3 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary font-bold"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Apply URL / Recruiter Email"
                                      value={link.url}
                                      onChange={(e) =>
                                        handleUpdatePartLink(
                                          part.id,
                                          linkIdx,
                                          'url',
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary font-mono text-[11px]"
                                    />
                                    {part.applyLinks.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePartLink(part.id, linkIdx)}
                                        className="p-1 hover:text-red-600 transition-colors cursor-pointer"
                                        title="Remove Link"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
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
                <Edit className="w-5 h-5 text-primary" />
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
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Employer Name</label>
                  <input
                    type="text"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Row 2: Category & Qualification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Job Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-primary"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Degree Qualification</label>
                  <div className="space-y-2">
                    <select
                      value={qualifications.includes(form.qualification) ? form.qualification : "Other"}
                      onChange={(e) => {
                        const val = e.target.value;
                        setForm({ ...form, qualification: val === "Other" ? "" : val });
                      }}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-655 focus:outline-none focus:border-primary"
                    >
                      {qualifications.map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                      <option value="Other">Other (Type Custom)</option>
                    </select>
                    
                    {(!qualifications.includes(form.qualification) || form.qualification === "") && (
                      <input
                        type="text"
                        required
                        placeholder="Type custom qualification (e.g. M.Tech, Pharm.D)..."
                        value={form.qualification}
                        onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary animate-fade-in"
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Location & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Location</label>
                  <input
                    type="text"
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Experience Needed</label>
                  <input
                    type="text"
                    required
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
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
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Arrays parsing blocks (multi-line textarea helper) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">Responsibilities (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.responsibilitiesRaw}
                    onChange={(e) => setForm({ ...form, responsibilitiesRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-accent-sky block">Requirements (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.requirementsRaw}
                    onChange={(e) => setForm({ ...form, requirementsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-secondary block">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    value={form.benefitsRaw}
                    onChange={(e) => setForm({ ...form, benefitsRaw: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10.5px] text-slate-700 focus:outline-none focus:border-primary resize-none"
                  />
                </div>
              </div>

              {/* Apply Link & Recruiter Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450">Apply Link / URL <span className="text-slate-350 font-normal normal-case">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="https://company.com/careers/apply"
                    value={form.applyUrl}
                    onChange={(e) => setForm({ ...form, applyUrl: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-455">Recruiter Email <span className="text-slate-350 font-normal normal-case">(optional)</span></label>
                  <input
                    type="text"
                    placeholder="e.g. hr@company.com"
                    value={form.recruiterEmail}
                    onChange={(e) => setForm({ ...form, recruiterEmail: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Schedule Post */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Schedule Publish Date & Time <span className="text-slate-300 font-normal normal-case">(optional)</span>
                </label>
                <DateTimePicker12h
                  value={form.scheduledTime}
                  onChange={(val) => setForm({ ...form, scheduledTime: val })}
                />
              </div>



              {/* Poster-Apply Sections Builder */}
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 tracking-tight">
                      Poster-Apply Sections (Advanced)
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      Configure custom groups of specific poster images paired with custom apply links.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddApplyPart}
                    className="px-3 py-1.5 bg-primary-light text-primary hover:bg-primary/10 border border-primary/20 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Section</span>
                  </button>
                </div>

                {form.applyParts && form.applyParts.length > 0 && (
                  <div className="space-y-4">
                    {form.applyParts.map((part, partIdx) => (
                      <div
                        key={part.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-2xl relative space-y-4 shadow-sm"
                      >
                        {/* Remove Section Button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveApplyPart(part.id)}
                          className="absolute top-4 right-4 text-slate-400 hover:text-red-655 cursor-pointer"
                          title="Delete Section"
                        >
                          <X className="w-4 h-4" />
                        </button>

                        <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                          Section #{partIdx + 1}
                        </h5>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                          {/* Image Dropzone Left */}
                          <div className="md:col-span-4 space-y-2">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                              Section Image (Optional)
                            </label>
                            {part.imageUrl ? (
                              <div className="relative aspect-square rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center group shadow-inner">
                                <img
                                  src={part.imageUrl}
                                  alt="Part Poster"
                                  className="max-w-full max-h-full object-contain"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePartImage(part.id)}
                                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-all cursor-pointer"
                                >
                                  Remove Image
                                </button>
                              </div>
                            ) : (
                              <div className="relative aspect-square rounded-xl border border-dashed border-slate-200 hover:border-primary transition-all bg-white flex flex-col items-center justify-center p-3 text-center cursor-pointer">
                                {uploadingJobImage ? (
                                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : (
                                  <>
                                    <Plus className="w-4 h-4 text-slate-400 mb-1" />
                                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Upload Poster</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handlePartImageUpload(part.id, e)}
                                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                    />
                                  </>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Title & Link Details Right */}
                          <div className="md:col-span-8 space-y-3">
                            <div className="space-y-1">
                              <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                Section Title / Role Label
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Apply for Pharmacist positions, B.Pharm Vacancy"
                                value={part.title || ''}
                                onChange={(e) => handleUpdatePartTitle(part.id, e.target.value)}
                                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                              />
                            </div>

                            {/* Section Link List */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                  Apply Links
                                </label>
                                <button
                                  type="button"
                                  onClick={() => handleAddPartLink(part.id)}
                                  className="text-[9px] font-extrabold text-primary hover:underline cursor-pointer"
                                >
                                  + Add Link
                                </button>
                              </div>

                              <div className="space-y-2">
                                {part.applyLinks.map((link, linkIdx) => (
                                  <div key={linkIdx} className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      placeholder="Button Label (e.g. Apply Now)"
                                      value={link.label}
                                      onChange={(e) =>
                                        handleUpdatePartLink(
                                          part.id,
                                          linkIdx,
                                          'label',
                                          e.target.value
                                        )
                                      }
                                      className="w-1/3 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary font-bold"
                                    />
                                    <input
                                      type="text"
                                      placeholder="Apply URL / Recruiter Email"
                                      value={link.url}
                                      onChange={(e) =>
                                        handleUpdatePartLink(
                                          part.id,
                                          linkIdx,
                                          'url',
                                          e.target.value
                                        )
                                      }
                                      className="flex-1 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:outline-none focus:border-primary font-mono text-[11px]"
                                    />
                                    {part.applyLinks.length > 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleRemovePartLink(part.id, linkIdx)}
                                        className="p-1 hover:text-red-655 transition-colors cursor-pointer"
                                        title="Remove Link"
                                      >
                                        <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-500" />
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Save Modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE HERO SLIDE MODAL */}
      {showAddSlideModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Hero Slide Banner
              </h3>
              <button onClick={() => setShowAddSlideModal(false)} className="text-slate-450 hover:text-slate-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddSlideSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slide Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pharmaceutical Recruitment Drive Banner"
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slide Banner Image</label>
                {slideForm.image ? (
                  <div className="relative w-full h-32 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center group">
                    <img
                      src={slideForm.image}
                      alt="Banner Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setSlideForm((prev) => ({ ...prev, image: '' }))}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-32 rounded-xl border border-dashed border-slate-200 hover:border-primary transition-all bg-slate-50 flex flex-col items-center justify-center p-4">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploading asset...</span>
                      </div>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Banner Slide</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Click Target Link / Path</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /jobs or https://example.com/register"
                  value={slideForm.path}
                  onChange={(e) => setSlideForm({ ...slideForm, path: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddSlideModal(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleAddSlideSubmit}
                  disabled={submittingSlide}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {submittingSlide && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create Slide
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT HERO SLIDE MODAL */}
      {showEditSlideModal && selectedSlide && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Modify Slide Banner
              </h3>
              <button onClick={() => setShowEditSlideModal(false)} className="text-slate-450 hover:text-slate-650 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSlideSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slide Title</label>
                <input
                  type="text"
                  required
                  value={slideForm.title}
                  onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Slide Banner Image</label>
                {slideForm.image ? (
                  <div className="relative w-full h-32 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center group">
                    <img
                      src={slideForm.image}
                      alt="Banner Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => setSlideForm((prev) => ({ ...prev, image: '' }))}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div className="relative w-full h-32 rounded-xl border border-dashed border-slate-200 hover:border-primary transition-all bg-slate-50 flex flex-col items-center justify-center p-4">
                    {uploadingImage ? (
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Uploading asset...</span>
                      </div>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Upload Banner Slide</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Click Target Link / Path</label>
                <input
                  type="text"
                  required
                  value={slideForm.path}
                  onChange={(e) => setSlideForm({ ...slideForm, path: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-primary"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditSlideModal(false)}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={handleEditSlideSubmit}
                  disabled={submittingSlide}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-accent-sky text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {submittingSlide && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ADD CATEGORY MODAL */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add New Category
              </h3>
              <button 
                onClick={() => {
                  setShowAddCategoryModal(false);
                  setNewCategoryNameInput('');
                }} 
                className="text-slate-450 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleCreateCategorySubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biotech Jobs, Research Fellowships"
                  value={newCategoryNameInput}
                  onChange={(e) => setNewCategoryNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-primary shadow-sm"
                />
              </div>

              {/* Modal Footer Controls */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddCategoryModal(false);
                    setNewCategoryNameInput('');
                  }}
                  className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategories}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  {savingCategories && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CATEGORY MODAL */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-100 shadow-2xl overflow-hidden animate-zoom-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-650" />
                Delete Category
              </h3>
              <button 
                onClick={() => setShowDeleteCategoryModal(false)} 
                className="text-slate-455 hover:text-slate-650 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / List */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <p className="text-xs text-slate-500 leading-relaxed">
                Select a category to delete. Note: deleting a category will automatically assign all jobs in that category to <span className="font-extrabold text-slate-700">"Other Jobs"</span>.
              </p>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div 
                    key={cat}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-2xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="truncate pr-4">{cat}</span>
                    <button
                      type="button"
                      disabled={savingCategories}
                      onClick={() => handleDeleteCategoryDirect(cat)}
                      className="p-2 border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-500 hover:text-red-650 rounded-xl cursor-pointer transition-all flex items-center justify-center shrink-0 disabled:opacity-50"
                      title={`Delete "${cat}"`}
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="p-6 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteCategoryModal(false)}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-600 rounded-xl cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
