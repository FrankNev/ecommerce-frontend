export default async function sitemap() {
  const baseUrl = 'https://ecommerce-frontend-nine-ebon.vercel.app';

  // Páginas estáticas
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/cart`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];

  // Páginas dinámicas (productos)
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?limit=1000`);
    const { products } = await res.json();

    const productPages = products.map(product => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: new Date(product.updatedAt || product.createdAt),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}