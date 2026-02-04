import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/checkout/*',
          '/book/*',
          '/reservations',
          '/login-history',
        ],
      },
    ],
    sitemap: 'https://gildedevents.com/sitemap.xml',
  };
}
