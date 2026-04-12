export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/checkout', '/orders', '/login', '/register'],
      },
    ],
    sitemap: 'https://ecommerce-frontend-nine-ebon.vercel.app/sitemap.xml',
  };
}