import { supabase } from './supabase';
import fs from 'fs/promises';
import path from 'path';

// Define TS Interfaces
export interface Job {
  id: string;
  title: string;
  company: string;
  category: string;
  type: string;
  qualification: string;
  location: string;
  salary: string;
  experience: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applyUrl: string;
  imageUrl?: string;
  imageUrls?: string[];
  applyParts?: JobApplyPart[];
  scheduledTime?: string;
  postedBy?: 'SUPER ADMIN' | 'ADMIN';
  customSections?: Array<{ title: string; items: string[] }>;
  customTitle?: string;
}

export interface ApplyLink {
  label: string;
  url: string;
}

export interface JobApplyPart {
  id: string;
  title?: string;
  imageUrl?: string;
  applyLinks: ApplyLink[];
}

export interface SocialLinks {
  whatsapp: string;
  telegram: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

export interface HeroSlide {
  id: string;
  title: string;
  image: string;
  path: string;
}

export interface DbSchema {
  admin: {
    username: string;
    passwordHash?: string;
    password?: string;
  };
  superAdmin?: {
    username: string;
    password?: string;
  };
  admins?: Array<{
    username: string;
    password?: string;
  }>;
  jobs: Job[];
  categories: string[];
  qualifications: string[];
  socialLinks?: SocialLinks;
  heroSlides?: HeroSlide[];
  customTitleOptions?: string[];
}

// ──────────────────────────────────────────────
//  LOCAL JSON FALLBACK (db.json)
//  Used when Supabase is unavailable or tables
//  have not been created yet.
// ──────────────────────────────────────────────
const dbPath = path.join(process.cwd(), 'src/data/db.json');

async function readLocalDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data) as DbSchema;
  } catch {
    return {
      admin: { username: 'admin@pharmagmail.com', password: 'pharma@2026' },
      jobs: [],
      categories: [],
      qualifications: [],
      customTitleOptions: []
    };
  }
}

async function writeLocalDb(data: DbSchema): Promise<void> {
  try {
    const dir = path.dirname(dbPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write local db.json backup:', err);
  }
}

// ──────────────────────────────────────────────
//  SUPABASE HELPERS
// ──────────────────────────────────────────────
interface JobRow {
  id: string;
  title: string;
  company: string;
  category: string;
  type: string;
  qualification: string;
  location: string;
  salary: string;
  experience: string;
  posted_date: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  apply_url: string;
  image_url: string | null;
  image_urls: string[] | null;
  apply_parts: any | null;
  scheduled_time: string | null;
  posted_by: string | null;
  custom_title: string | null;
}

function serializeCustomSections(
  descriptionText: string,
  customSections?: Array<{ title: string; items: string[] }>,
  customTitle?: string
): string {
  const payload: any = {};
  if (customSections && customSections.length > 0) {
    payload.customSections = customSections;
  }
  if (customTitle && customTitle.trim() !== '') {
    payload.customTitle = customTitle.trim();
  }
  
  if (Object.keys(payload).length === 0) return descriptionText;
  return `${descriptionText}\n\n---METADATA_START---\n${JSON.stringify(payload)}\n---METADATA_END---`;
}

function deserializeCustomSections(dbDescription: string | null): {
  description: string;
  customSections?: Array<{ title: string; items: string[] }>;
  customTitle?: string;
} {
  if (!dbDescription) return { description: '' };
  const startIndex = dbDescription.indexOf('---METADATA_START---');
  const endIndex = dbDescription.indexOf('---METADATA_END---');
  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    const text = dbDescription.substring(0, startIndex).trim();
    const metaStr = dbDescription.substring(startIndex + '---METADATA_START---'.length, endIndex).trim();
    try {
      const payload = JSON.parse(metaStr);
      return {
        description: text,
        customSections: payload.customSections,
        customTitle: payload.customTitle
      };
    } catch (e) {
      console.error('Failed to parse description metadata:', e);
    }
  }
  return { description: dbDescription };
}

function mapRowToJob(row: JobRow): Job {
  const { description, customSections, customTitle } = deserializeCustomSections(row.description);
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    category: row.category,
    type: row.type,
    qualification: row.qualification,
    location: row.location,
    salary: row.salary,
    experience: row.experience,
    postedDate: row.posted_date,
    description: description,
    responsibilities: row.responsibilities || [],
    requirements: row.requirements || [],
    benefits: row.benefits || [],
    applyUrl: row.apply_url,
    imageUrl: row.image_url || undefined,
    imageUrls: row.image_urls || undefined,
    applyParts: row.apply_parts || undefined,
    scheduledTime: row.scheduled_time || undefined,
    postedBy: (row.posted_by as any) || undefined,
    customSections: customSections || undefined,
    customTitle: customTitle || row.custom_title || undefined
  };
}

function mapJobToRow(job: Partial<Job>): Partial<JobRow> {
  const row: Partial<JobRow> = {};
  if (job.id !== undefined) row.id = job.id;
  if (job.title !== undefined) row.title = job.title;
  if (job.company !== undefined) row.company = job.company;
  if (job.category !== undefined) row.category = job.category;
  if (job.type !== undefined) row.type = job.type;
  if (job.qualification !== undefined) row.qualification = job.qualification;
  if (job.location !== undefined) row.location = job.location;
  if (job.salary !== undefined) row.salary = job.salary;
  if (job.experience !== undefined) row.experience = job.experience;
  if (job.postedDate !== undefined) row.posted_date = job.postedDate;
  
  if (job.description !== undefined || job.customSections !== undefined || job.customTitle !== undefined) {
    const cleanDesc = job.description || '';
    row.description = serializeCustomSections(cleanDesc, job.customSections, job.customTitle);
  }
  
  if (job.responsibilities !== undefined) row.responsibilities = job.responsibilities;
  if (job.requirements !== undefined) row.requirements = job.requirements;
  if (job.benefits !== undefined) row.benefits = job.benefits;
  if (job.applyUrl !== undefined) row.apply_url = job.applyUrl;
  if (job.imageUrl !== undefined) row.image_url = job.imageUrl || null;
  if (job.imageUrls !== undefined) row.image_urls = job.imageUrls || null;
  if (job.applyParts !== undefined) row.apply_parts = job.applyParts || null;
  if (job.scheduledTime !== undefined) row.scheduled_time = job.scheduledTime || null;
  if (job.postedBy !== undefined) row.posted_by = job.postedBy || null;
  return row;
}

let cachedSupabaseAvailable: boolean | null = null;

/** Returns true when the Supabase connection is usable */
async function isSupabaseAvailable(): Promise<boolean> {
  if (cachedSupabaseAvailable) {
    return true;
  }
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!url || url.includes('your-project-id') || !key || key.includes('your_supabase')) {
      return false;
    }
    // Quick probe – check settings table exists
    const { error } = await supabase.from('settings').select('key').limit(1);
    const available = !error;
    if (available) {
      cachedSupabaseAvailable = true;
    }
    return available;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────────
//  SCHEDULED CLEANUP (runs on every read)
// ──────────────────────────────────────────────
// NOTE: We intentionally do NOT auto-delete jobs from Supabase when a
// scheduled post becomes active. Jobs are only removed when the admin
// explicitly deletes them via the admin panel. The scheduling feature
// controls VISIBILITY on the public site via applyScheduledFilter,
// without ever permanently destroying database records.
async function performScheduledCleanupSupabase(_jobs: Job[]): Promise<void> {
  // No-op: deletion is admin-only, not automatic.
}

// NOTE: Same as above — we do NOT auto-delete from db.json.
// The local file always retains all jobs as a complete backup.
async function performScheduledCleanupLocal(_db: DbSchema): Promise<boolean> {
  // No-op: deletion is admin-only.
  return false;
}

// ──────────────────────────────────────────────
//  readDb  (kept for backward-compat with login)
// ──────────────────────────────────────────────
export async function readDb(): Promise<DbSchema> {
  // Try Supabase first
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'admin_credentials')
        .single();

      if (!error && data?.value) {
        const creds = data.value as any;
        return {
          admin: creds.admin,
          superAdmin: creds.superAdmin,
          admins: creds.admins || [],
          jobs: [],
          categories: [],
          qualifications: []
        };
      }
    } catch {
      // fall through to local
    }
  }

  // Fallback: local db.json
  return readLocalDb();
}

export async function writeDb(data: DbSchema): Promise<void> {
  // Always keep local file in sync as a safety backup
  await writeLocalDb(data);
}

// ──────────────────────────────────────────────
//  JOBS CRUD
// ──────────────────────────────────────────────
export async function getAllJobs(): Promise<Job[]> {
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { data, error } = await supabase.from('jobs').select('*');
      if (!error && data && data.length > 0) {
        const jobs = (data as JobRow[]).map(mapRowToJob);
        // Run cleanup but don't block the response
        performScheduledCleanupSupabase(jobs).catch(() => {});
        // Filter in-memory to reflect active scheduled state instantly
        return applyScheduledFilter(jobs);
      }
    } catch {
      // fall through
    }
  }

  // Fallback: local db.json
  console.warn('[db] Falling back to local db.json for getAllJobs');
  const db = await readLocalDb();
  const changed = await performScheduledCleanupLocal(db);
  if (changed) await writeLocalDb(db);
  return db.jobs.sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  );
}

/**
 * Admin-only: returns ALL jobs (including scheduled future ones) without any
 * cleanup filtering. This ensures admin always sees every job with its full
 * image data, apply links, and scheduling status.
 */
export async function getAllJobsForAdmin(): Promise<Job[]> {
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
      if (!error && data && data.length > 0) {
        return (data as JobRow[]).map(mapRowToJob);
      }
    } catch {
      // fall through
    }
  }

  // Fallback: local db.json (all jobs, no filter)
  const db = await readLocalDb();
  return db.jobs.sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  );
}

function applyScheduledFilter(jobs: Job[]): Job[] {
  const now = new Date();
  // Hide jobs whose scheduled time is still in the future (not yet due)
  const visible = jobs.filter(
    (j) => !j.scheduledTime || new Date(j.scheduledTime) <= now
  );
  return visible.sort(
    (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  );
}

export async function getJobById(id: string): Promise<Job | null> {
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return mapRowToJob(data as JobRow);
    } catch {
      // fall through
    }
  }

  // Fallback
  const db = await readLocalDb();
  return db.jobs.find((j) => j.id === id) || null;
}

export async function addJob(jobInput: Omit<Job, 'id' | 'postedDate'>): Promise<Job> {
  const newJob: Job = {
    ...jobInput,
    id: `job-${Date.now()}`,
    postedDate: new Date().toISOString()  // full ISO timestamp for correct newest-first ordering
  };

  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const row = mapJobToRow(newJob);
      const { error } = await supabase.from('jobs').insert(row);
      if (error) throw error;
      // Also persist to local db.json as backup
      const db = await readLocalDb();
      db.jobs.push(newJob);
      await writeLocalDb(db);
      return newJob;
    } catch (err) {
      console.warn('[db] Supabase insert failed, saving to local db.json:', err);
    }
  }

  // Fallback: local db.json
  const db = await readLocalDb();
  db.jobs.push(newJob);
  await writeLocalDb(db);
  return newJob;
}

export async function updateJob(
  id: string,
  jobInput: Partial<Omit<Job, 'id' | 'postedDate'>>
): Promise<Job | null> {
  const existing = await getJobById(id);
  if (!existing) return null;

  const updatedJob: Job = { ...existing, ...jobInput };
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const row = mapJobToRow(updatedJob);
      const { error } = await supabase.from('jobs').update(row).eq('id', id);
      if (error) throw error;
      // Mirror in local db.json
      const db = await readLocalDb();
      const idx = db.jobs.findIndex((j) => j.id === id);
      if (idx !== -1) db.jobs[idx] = updatedJob;
      await writeLocalDb(db);
      return updatedJob;
    } catch (err) {
      console.warn('[db] Supabase update failed, updating local db.json:', err);
    }
  }

  // Fallback
  const db = await readLocalDb();
  const idx = db.jobs.findIndex((j) => j.id === id);
  if (idx === -1) return null;
  db.jobs[idx] = updatedJob;
  await writeLocalDb(db);
  return updatedJob;
}

export async function deleteJob(id: string): Promise<boolean> {
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
      // Mirror in local db.json
      const db = await readLocalDb();
      db.jobs = db.jobs.filter((j) => j.id !== id);
      await writeLocalDb(db);
      return true;
    } catch (err) {
      console.warn('[db] Supabase delete failed, deleting from local db.json:', err);
    }
  }

  // Fallback
  const db = await readLocalDb();
  const before = db.jobs.length;
  db.jobs = db.jobs.filter((j) => j.id !== id);
  if (db.jobs.length === before) return false;
  await writeLocalDb(db);
  return true;
}

// ──────────────────────────────────────────────
//  CATEGORIES & QUALIFICATIONS
// ──────────────────────────────────────────────
export async function getCategories(): Promise<string[]> {
  const available = await isSupabaseAvailable();
  let categories: string[] = [];
  if (available) {
    try {
      const { data, error } = await supabase
        .from('settings').select('value').eq('key', 'categories').single();
      if (!error && data?.value) categories = data.value as string[];
    } catch {}
  }
  
  if (categories.length === 0) {
    const db = await readLocalDb();
    if (db.categories && db.categories.length > 0) {
      categories = db.categories;
    }
  }

  // Self-migrating one-off check
  const targetCategories = ['Government Jobs', 'Private Jobs', 'Engineering Jobs', 'Other Jobs'];
  if (
    categories.length === 0 ||
    categories.includes('Government Pharma Jobs') ||
    categories.includes('Staff Nurse Jobs') ||
    categories.includes('Private Pharma Jobs')
  ) {
    categories = targetCategories;
    await updateCategories(targetCategories);
    
    // Migrate existing jobs categories
    const renames: Record<string, string> = {
      'Government Pharma Jobs': 'Government Jobs',
      'Staff Nurse Jobs': 'Government Jobs',
      'Paramedical Jobs': 'Government Jobs',
      'JRF & SRF Jobs': 'Government Jobs',
      'Private Pharma Jobs': 'Private Jobs',
      'Pharma Job Updates': 'Other Jobs'
    };
    // Run rename migration without blocking
    renameCategoriesInJobs(renames, [], 'Other Jobs').catch((err) => {
      console.error('Error migrating category names on jobs:', err);
    });
  }

  return categories;
}

export async function getQualifications(): Promise<string[]> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { data, error } = await supabase
        .from('settings').select('value').eq('key', 'qualifications').single();
      if (!error && data?.value) return data.value as string[];
    } catch {}
  }
  const db = await readLocalDb();
  return db.qualifications.length > 0
    ? db.qualifications
    : ['B.Pharm','D.Pharm','M.Pharm','BSc','MSc','Diploma','PhD','JRF','SRF','Staff Nurse','B.Tech'];
}

// ──────────────────────────────────────────────
//  SOCIAL LINKS
// ──────────────────────────────────────────────
const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  whatsapp: 'https://whatsapp.com/channel/0029Va54XvB0G0Xg3b8hXj0s',
  telegram: 'https://t.me/pharmajobsdaily',
  instagram: 'https://instagram.com/pharmajobsdaily',
  linkedin: 'https://linkedin.com',
  youtube: 'https://youtube.com/@pharmajobsdaily'
};

export async function getSocialLinks(): Promise<SocialLinks> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { data, error } = await supabase
        .from('settings').select('value').eq('key', 'social_links').single();
      if (!error && data?.value) return data.value as SocialLinks;
    } catch {}
  }
  const db = await readLocalDb();
  return db.socialLinks || DEFAULT_SOCIAL_LINKS;
}

export async function updateSocialLinks(links: SocialLinks): Promise<SocialLinks> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'social_links', value: links });
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase social links update failed, updating local:', err);
    }
  }
  // Always mirror in local db.json
  const db = await readLocalDb();
  db.socialLinks = links;
  await writeLocalDb(db);
  return links;
}

export async function updateCategories(categories: string[]): Promise<string[]> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'categories', value: categories });
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase categories update failed, updating local:', err);
    }
  }
  // Always mirror in local db.json
  const db = await readLocalDb();
  db.categories = categories;
  await writeLocalDb(db);
  return categories;
}

export async function getCustomTitleOptions(): Promise<string[]> {
  const available = await isSupabaseAvailable();
  let options: string[] = [];
  if (available) {
    try {
      const { data, error } = await supabase
        .from('custom_title_options')
        .select('title')
        .order('id', { ascending: true });
      if (!error && data) {
        options = data.map((r: any) => r.title);
      }
    } catch {}
  }
  
  if (options.length === 0) {
    const db = await readLocalDb();
    if (db.customTitleOptions && db.customTitleOptions.length > 0) {
      options = db.customTitleOptions;
    }
  }

  // Self-migrating default title options
  if (options.length === 0) {
    options = ['Pfizer Hiring For Health care executive', 'Hiring For Drug inspector'];
    await updateCustomTitleOptions(options);
  }

  return options;
}

export async function updateCustomTitleOptions(options: string[]): Promise<string[]> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { error: deleteError } = await supabase
        .from('custom_title_options')
        .delete()
        .neq('id', -1);
      if (deleteError) throw deleteError;

      if (options.length > 0) {
        const rows = options.map((title) => ({ title }));
        const { error: insertError } = await supabase
          .from('custom_title_options')
          .insert(rows);
        if (insertError) throw insertError;
      }
    } catch (err) {
      console.warn('[db] Supabase custom title options update failed, updating local:', err);
    }
  }
  // Always mirror in local db.json
  const db = await readLocalDb();
  db.customTitleOptions = options;
  await writeLocalDb(db);
  return options;
}

export async function renameCategoriesInJobs(
  renames: Record<string, string>,
  deletions: string[],
  fallbackCategory: string
): Promise<void> {
  const jobs = await getAllJobsForAdmin();
  
  for (const job of jobs) {
    let updatedCategory = job.category;
    let needsUpdate = false;

    // Check if category is renamed
    if (renames[job.category]) {
      updatedCategory = renames[job.category];
      needsUpdate = true;
    }
    // Check if category is deleted
    else if (deletions.includes(job.category)) {
      updatedCategory = fallbackCategory;
      needsUpdate = true;
    }

    if (needsUpdate) {
      await updateJob(job.id, { category: updatedCategory });
    }
  }
}



// ──────────────────────────────────────────────
//  HERO SLIDES
// ──────────────────────────────────────────────
const DEFAULT_SLIDES: HeroSlide[] = [
  { id: 'slide-1', title: 'Pharmaceutical Recruitment Drive Banner', image: '/ad-banner-1.png', path: '/jobs' },
  { id: 'slide-2', title: 'Staff Nurse Vacancy Banner', image: '/ad-banner-2.png', path: '/services' },
  { id: 'slide-3', title: 'JRF & SRF Fellowship Notice Board Banner', image: '/ad-banner-3.png', path: '/jobs?category=JRF%20%26%20SRF%20Jobs' }
];

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { data, error } = await supabase.from('hero_slides').select('*');
      if (!error && data && data.length > 0) return data as HeroSlide[];
    } catch {}
  }
  const db = await readLocalDb();
  return db.heroSlides && db.heroSlides.length > 0 ? db.heroSlides : DEFAULT_SLIDES;
}

export async function addHeroSlide(slideInput: Omit<HeroSlide, 'id'>): Promise<HeroSlide> {
  const newSlide: HeroSlide = { ...slideInput, id: `slide-${Date.now()}` };
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { error } = await supabase.from('hero_slides').insert(newSlide);
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase slide insert failed:', err);
    }
  }
  // Mirror in local db.json
  const db = await readLocalDb();
  if (!db.heroSlides) db.heroSlides = [];
  db.heroSlides.push(newSlide);
  await writeLocalDb(db);
  return newSlide;
}

export async function updateHeroSlide(
  id: string,
  slideInput: Partial<Omit<HeroSlide, 'id'>>
): Promise<HeroSlide | null> {
  const available = await isSupabaseAvailable();
  const db = await readLocalDb();
  const slides = db.heroSlides || DEFAULT_SLIDES;
  const idx = slides.findIndex((s) => s.id === id);
  if (idx === -1) return null;

  const updatedSlide = { ...slides[idx], ...slideInput };

  if (available) {
    try {
      const { error } = await supabase.from('hero_slides').update(updatedSlide).eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase slide update failed:', err);
    }
  }
  // Mirror in local db.json
  if (!db.heroSlides) db.heroSlides = [...DEFAULT_SLIDES];
  const localIdx = db.heroSlides.findIndex((s) => s.id === id);
  if (localIdx !== -1) db.heroSlides[localIdx] = updatedSlide;
  await writeLocalDb(db);
  return updatedSlide;
}

export async function deleteHeroSlide(id: string): Promise<boolean> {
  const available = await isSupabaseAvailable();

  if (available) {
    try {
      const { error } = await supabase.from('hero_slides').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase slide delete failed:', err);
    }
  }
  // Mirror in local db.json
  const db = await readLocalDb();
  if (!db.heroSlides) return false;
  const before = db.heroSlides.length;
  db.heroSlides = db.heroSlides.filter((s) => s.id !== id);
  await writeLocalDb(db);
  return db.heroSlides.length !== before;
}

export interface AdminCredential {
  username: string;
  password?: string;
}

export async function getAdminsList(): Promise<AdminCredential[]> {
  const db = await readDb();
  if (!db.admins || db.admins.length === 0) {
    return [db.admin];
  }
  return db.admins;
}

export async function updateAdminsList(admins: AdminCredential[]): Promise<AdminCredential[]> {
  const available = await isSupabaseAvailable();
  const db = await readDb();
  
  db.admins = admins;
  
  if (admins.length > 0) {
    db.admin = admins[0];
  }

  if (available) {
    try {
      const credentialsObj = {
        admin: db.admin,
        superAdmin: db.superAdmin,
        admins: db.admins
      };
      
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'admin_credentials', value: credentialsObj });
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase admin credentials update failed, updating local:', err);
    }
  }

  // Always mirror in local db.json
  const localDb = await readLocalDb();
  localDb.admins = db.admins;
  localDb.admin = db.admin;
  await writeLocalDb(localDb);

  return db.admins;
}

export async function updateSuperAdminCredentials(username: string, password: string): Promise<boolean> {
  const available = await isSupabaseAvailable();
  const db = await readDb();
  
  db.superAdmin = { username, password };
  
  if (available) {
    try {
      const credentialsObj = {
        admin: db.admin,
        superAdmin: db.superAdmin,
        admins: db.admins
      };
      
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'admin_credentials', value: credentialsObj });
      if (error) throw error;
    } catch (err) {
      console.warn('[db] Supabase superAdmin credentials update failed:', err);
    }
  }

  // Always mirror in local db.json
  const localDb = await readLocalDb();
  localDb.superAdmin = { username, password };
  await writeLocalDb(localDb);

  return true;
}

const tokenPath = path.join(process.cwd(), 'src/data/reset_token.json');

export interface ResetTokenData {
  token: string;
  email: string;
  expires: number;
}

export async function saveResetToken(token: string, email: string, expires: number): Promise<void> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { error } = await supabase
        .from('settings')
        .upsert({ key: 'reset_token', value: { token, email, expires } });
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('[db] Supabase saveResetToken failed, falling back to local file:', err);
    }
  }

  try {
    const dir = path.dirname(tokenPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(tokenPath, JSON.stringify({ token, email, expires }, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write reset token:', err);
  }
}

export async function getResetToken(): Promise<ResetTokenData | null> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'reset_token')
        .single();
      if (!error && data?.value) {
        return data.value as ResetTokenData;
      }
    } catch (err) {
      console.warn('[db] Supabase getResetToken failed, falling back to local file:', err);
    }
  }

  try {
    const data = await fs.readFile(tokenPath, 'utf8');
    return JSON.parse(data) as ResetTokenData;
  } catch {
    return null;
  }
}

export async function clearResetToken(): Promise<void> {
  const available = await isSupabaseAvailable();
  if (available) {
    try {
      const { error } = await supabase
        .from('settings')
        .delete()
        .eq('key', 'reset_token');
      if (error) throw error;
      return;
    } catch (err) {
      console.warn('[db] Supabase clearResetToken failed, falling back to local file:', err);
    }
  }

  try {
    await fs.unlink(tokenPath);
  } catch {
    // Ignore error if file doesn't exist
  }
}
