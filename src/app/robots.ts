import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pharmajobsdaily.com';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/superadmin/',
        '/assistantadmin/',
        '/superadminlogin',
        '/assistantlogin',
        '/api/'
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
