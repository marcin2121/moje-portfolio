import { MetadataRoute } from 'next/types';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://molendadevelopment.pl';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/oferta/', '/sukces', '/api/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
