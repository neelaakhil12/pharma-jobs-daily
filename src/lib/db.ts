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
}

export interface DbSchema {
  admin: {
    username: string;
    passwordHash?: string; // Standard login check
    password?: string;
  };
  jobs: Job[];
  categories: string[];
  qualifications: string[];
}

const dbPath = path.join(process.cwd(), 'src/data/db.json');

// Helper to read DB
export async function readDb(): Promise<DbSchema> {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database file, returning empty schema:', error);
    return {
      admin: { username: 'admin', password: 'password123' },
      jobs: [],
      categories: [],
      qualifications: []
    };
  }
}

// Helper to write DB
export async function writeDb(data: DbSchema): Promise<void> {
  try {
    // Ensure parent directory exists (just in case)
    const dir = path.dirname(dbPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
    throw new Error('Database write operation failed');
  }
}

// CRUD Operations
export async function getAllJobs(): Promise<Job[]> {
  const db = await readDb();
  return db.jobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
}

export async function getJobById(id: string): Promise<Job | null> {
  const db = await readDb();
  const job = db.jobs.find((j) => j.id === id);
  return job || null;
}

export async function addJob(jobInput: Omit<Job, 'id' | 'postedDate'>): Promise<Job> {
  const db = await readDb();
  
  const newJob: Job = {
    ...jobInput,
    id: `job-${Date.now()}`,
    postedDate: new Date().toISOString().split('T')[0]
  };

  db.jobs.push(newJob);
  await writeDb(db);
  return newJob;
}

export async function updateJob(id: string, jobInput: Partial<Omit<Job, 'id' | 'postedDate'>>): Promise<Job | null> {
  const db = await readDb();
  const index = db.jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;

  const updatedJob: Job = {
    ...db.jobs[index],
    ...jobInput
  };

  db.jobs[index] = updatedJob;
  await writeDb(db);
  return updatedJob;
}

export async function deleteJob(id: string): Promise<boolean> {
  const db = await readDb();
  const originalLength = db.jobs.length;
  db.jobs = db.jobs.filter((j) => j.id !== id);
  
  if (db.jobs.length === originalLength) {
    return false; // Job not found
  }

  await writeDb(db);
  return true;
}

export async function getCategories(): Promise<string[]> {
  const db = await readDb();
  return db.categories;
}

export async function getQualifications(): Promise<string[]> {
  const db = await readDb();
  return db.qualifications;
}
