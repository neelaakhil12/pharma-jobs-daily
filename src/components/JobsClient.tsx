'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, MapPin, SlidersHorizontal, RefreshCw, Briefcase, GraduationCap } from 'lucide-react';
import JobCard from '@/components/JobCard';
import { Job } from '@/lib/db';

export default function JobsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Load initial query states from URL
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialQualification = searchParams.get('qualification') || 'All';
  const initialType = searchParams.get('type') || 'All';

  // Component States
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [qualification, setQualification] = useState(initialQualification);
  const [type, setType] = useState(initialType);
  
  // Tab sector state (All, Government, Private)
  const [sectorTab, setSectorTab] = useState<'All' | 'Government' | 'Private'>('All');

  // Static options (matching seed data and tags)
  const categoryOptions = [
    'All',
    'Pharma Job Updates',
    'Government Pharma Jobs',
    'Private Pharma Jobs',
    'Staff Nurse Jobs',
    'Paramedical Jobs',
    'JRF & SRF Jobs'
  ];

  const qualificationOptions = [
    'All', 'B.Pharm', 'D.Pharm', 'M.Pharm', 'BSc', 'MSc', 'Diploma', 'PhD', 'JRF', 'SRF', 'Staff Nurse'
  ];

  const typeOptions = ['All', 'Full-time', 'Contract', 'Internship'];

  // Fetch jobs dynamically based on state
  const fetchJobs = async () => {
    setLoading(true);
    try {
      // Build API query string
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      
      // Handle category filtering
      if (category !== 'All') {
        params.append('category', category);
      } else if (sectorTab === 'Government') {
        params.append('category', 'Government Pharma Jobs');
      } else if (sectorTab === 'Private') {
        params.append('category', 'Private Pharma Jobs');
      }

      if (qualification !== 'All') params.append('qualification', qualification);
      if (type !== 'All') params.append('type', type);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Error querying jobs API:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sync state to API query on filters modifications
  useEffect(() => {
    fetchJobs();
    
    // Sync URL queries elegantly without full refresh
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category !== 'All') params.append('category', category);
    if (qualification !== 'All') params.append('qualification', qualification);
    if (type !== 'All') params.append('type', type);
    
    const newQuery = params.toString();
    router.replace(newQuery ? `/jobs?${newQuery}` : '/jobs');
  }, [search, location, category, qualification, type, sectorTab]);

  const handleReset = () => {
    setSearch('');
    setLocation('');
    setCategory('All');
    setQualification('All');
    setType('All');
    setSectorTab('All');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 1. Page Header */}
      <div className="mb-10 text-center sm:text-left space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
          Active Opportunities Job Board
        </h1>
        <p className="text-slate-500 text-sm">
          Browse verified daily vacancies in healthcare, pharmacology, and research fellowship.
        </p>
      </div>

      {/* 2. Top Interactive Search Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Filters Pane (Desktop Sidebar) */}
        <aside className="lg:col-span-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-md space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-[#16A34A]" />
              Filter Board
            </h3>
            <button
              onClick={handleReset}
              className="text-[11px] font-bold text-orange-500 hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Qualification Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-purple-500" />
              Qualification
            </label>
            <div className="flex flex-wrap gap-1.5">
              {qualificationOptions.map((q) => (
                <button
                  key={q}
                  onClick={() => setQualification(q)}
                  className={`text-[11px] px-3 py-1.5 rounded-xl font-bold border transition-all cursor-pointer ${
                    qualification === q
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:border-slate-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Job Category Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-green-600" />
              Job Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#16A34A]"
            >
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Sectors' : opt}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-[#16A34A]"
            >
              {typeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === 'All' ? 'All Types' : opt}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* Right Listings Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Top Bar: Live Keyword Input & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-white border border-slate-100 shadow-md rounded-2xl">
            <div className="flex items-center gap-2 px-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <Search className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search job title, company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none text-slate-700 text-xs py-2.5 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-2 px-3 border border-slate-200 rounded-xl bg-slate-50/50">
              <MapPin className="w-4.5 h-4.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Filter by location e.g., Hyderabad..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none text-slate-700 text-xs py-2.5 focus:outline-none focus:ring-0"
              />
            </div>
          </div>

          {/* Sector Tabs (All / Government Jobs / Private Jobs) */}
          <div className="flex border-b border-slate-200 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] whitespace-nowrap">
            {(['All', 'Government', 'Private'] as const).map((tab) => {
              const active = sectorTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => {
                    setSectorTab(tab);
                    setCategory('All'); // Reset specific subcategory to avoid conflict
                  }}
                  className={`px-3.5 sm:px-6 py-3 font-bold text-xs sm:text-sm tracking-wide transition-all border-b-2 uppercase cursor-pointer shrink-0 ${
                    active
                      ? 'border-[#16A34A] text-[#16A34A]'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab === 'All' ? 'All Openings' : `${tab} Jobs`}
                </button>
              );
            })}
          </div>

          {/* Dynamic Job Cards Container */}
          {loading ? (
            /* Premium skeleton loader */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 4].map((i) => (
                <div key={i} className="bg-white border border-slate-100 shadow-md rounded-2xl p-6 space-y-4 animate-pulse">
                  <div className="flex justify-between">
                    <div className="w-24 h-5 bg-slate-200 rounded-full" />
                    <div className="w-20 h-4 bg-slate-100 rounded-full" />
                  </div>
                  <div className="w-3/4 h-6 bg-slate-200 rounded-md" />
                  <div className="w-1/2 h-4 bg-slate-150 rounded-md" />
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="w-full h-4 bg-slate-100 rounded" />
                    <div className="w-full h-4 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-16 text-center border border-slate-100 bg-white shadow-md rounded-3xl space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto shadow-sm">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-extrabold text-lg text-slate-800">No Job Postings Found</h3>
              <p className="text-slate-450 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                We couldn't find any vacancies matching your active filter criteria. Try resetting or adjusting the qualifications and keyword searches.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-gradient-to-r from-[#16A34A] to-[#F97316] text-xs font-bold text-white rounded-xl shadow-md cursor-pointer"
              >
                Clear All Active Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
