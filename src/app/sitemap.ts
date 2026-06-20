import { MetadataRoute } from 'next';
import { getAllJobs } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmajobsdaily.com';

  // Base static routes
  const routes = ['', '/jobs', '/contact', '/services', '/disclaimer', '/privacy-policy', '/terms-and-conditions'].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    const jobs = await getAllJobs();
    const jobRoutes = jobs.map((job) => ({
      url: `${siteUrl}/jobs/${job.id}`,
      lastModified: job.postedDate ? new Date(job.postedDate).toISOString() : new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
    return [...routes, ...jobRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return routes;
  }
}
