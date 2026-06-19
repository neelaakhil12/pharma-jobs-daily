/**
 * Migration Script: db.json -> Supabase
 * 
 * Run this ONCE to migrate all existing data to Supabase.
 * Usage: node src/scripts/migrate.js
 * 
 * Requires environment variables set in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load .env.local
const envPath = path.join(__dirname, '../../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, ...vals] = line.split('=');
    if (key && key.trim() && !key.startsWith('#')) {
      process.env[key.trim()] = vals.join('=').trim();
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Load db.json
const dbPath = path.join(__dirname, '../data/db.json');
if (!fs.existsSync(dbPath)) {
  console.error('ERROR: Cannot find src/data/db.json');
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

async function migrate() {
  console.log('\n=== Pharma Jobs Daily - Supabase Migration ===\n');

  // 1. Migrate settings (admin credentials, social links, categories, qualifications)
  console.log('Migrating settings...');

  const settings = [
    {
      key: 'admin_credentials',
      value: {
        admin: db.admin,
        superAdmin: db.superAdmin
      }
    },
    {
      key: 'social_links',
      value: db.socialLinks || {
        whatsapp: 'https://whatsapp.com/channel/0029Va54XvB0G0Xg3b8hXj0s',
        telegram: 'https://t.me/pharmajobsdaily',
        instagram: 'https://instagram.com/pharmajobsdaily',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      key: 'categories',
      value: db.categories || []
    },
    {
      key: 'qualifications',
      value: db.qualifications || []
    }
  ];

  for (const setting of settings) {
    const { error } = await supabase.from('settings').upsert(setting, { onConflict: 'key' });
    if (error) {
      console.error(`  ERROR inserting setting "${setting.key}":`, error.message);
    } else {
      console.log(`  ✓ Setting "${setting.key}" migrated`);
    }
  }

  // 2. Migrate jobs
  console.log('\nMigrating jobs...');
  let jobSuccess = 0;
  let jobErrors = 0;

  for (const job of db.jobs) {
    const row = {
      id: job.id,
      title: job.title,
      company: job.company,
      category: job.category,
      type: job.type,
      qualification: job.qualification,
      location: job.location,
      salary: job.salary,
      experience: job.experience,
      posted_date: job.postedDate,
      description: job.description,
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      benefits: job.benefits || [],
      apply_url: job.applyUrl,
      image_url: job.imageUrl || null,
      image_urls: job.imageUrls || null,
      apply_parts: job.applyParts || null,
      scheduled_time: job.scheduledTime || null,
      posted_by: job.postedBy || null
    };

    const { error } = await supabase.from('jobs').upsert(row, { onConflict: 'id' });
    if (error) {
      console.error(`  ERROR inserting job "${job.id}":`, error.message);
      jobErrors++;
    } else {
      console.log(`  ✓ Job "${job.title}" migrated (${job.id})`);
      jobSuccess++;
    }
  }

  console.log(`\n  Jobs: ${jobSuccess} migrated, ${jobErrors} errors`);

  // 3. Migrate hero slides
  console.log('\nMigrating hero slides...');
  let slideSuccess = 0;
  let slideErrors = 0;

  const slides = db.heroSlides || [];
  for (const slide of slides) {
    const { error } = await supabase.from('hero_slides').upsert(slide, { onConflict: 'id' });
    if (error) {
      console.error(`  ERROR inserting slide "${slide.id}":`, error.message);
      slideErrors++;
    } else {
      console.log(`  ✓ Slide "${slide.title}" migrated`);
      slideSuccess++;
    }
  }

  console.log(`\n  Slides: ${slideSuccess} migrated, ${slideErrors} errors`);

  // Summary
  console.log('\n=== Migration Complete ===');
  console.log(`  Settings: ${settings.length}`);
  console.log(`  Jobs:     ${jobSuccess} / ${db.jobs.length}`);
  console.log(`  Slides:   ${slideSuccess} / ${slides.length}`);
  console.log('\nVerify data in your Supabase dashboard at:');
  console.log(`  ${supabaseUrl.replace('https://', 'https://app.supabase.com/project/')}/table-editor\n`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
