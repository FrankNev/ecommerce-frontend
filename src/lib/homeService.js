export async function getCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/categories`,
      { cache: 'no-store' }
    );
    return await res.json();
  } catch (error) {
    return [];
  }
}

export async function getMostPurchased() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products/most-purchased?limit=6`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error('most-purchased error:', error.message);
    return [];
  }
}

function mapProductsToPromotion(promo, allProducts) {
  let mappedProducts = [];

  if (promo.type === 'SPECIFIC' && promo.product_ids?.length > 0) {
    mappedProducts = allProducts.filter(p => promo.product_ids.includes(p._id));
  } 
  else if (promo.type === 'GLOBAL') {
    let validProducts = allProducts;
    if (promo.conditions?.excluded_categories?.length) {
      validProducts = validProducts.filter(p => !promo.conditions.excluded_categories.includes(p.category_id));
    }
    if (promo.conditions?.excluded_brands?.length) {
      validProducts = validProducts.filter(p => !promo.conditions.excluded_brands.includes(p.brand));
    }
    mappedProducts = validProducts;
  }

  const finalProducts = mappedProducts.map(product => ({
    ...product,
    badgeColor: promo.color
  }));

  return {
    ...promo,
    products: finalProducts
  };
}

export async function getActivePromotionsWithProducts() {
  try {
    const promoRes = await fetch(`${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/promotions/active`, { cache: 'no-store' });
    if (!promoRes.ok) return [];
    const promos = await promoRes.json();
    if (promos.length === 0) return [];

    const prodRes = await fetch(`${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?limit=50`, { next: { revalidate: 3600 } });
    const prodData = prodRes.ok ? await prodRes.json() : [];
    const allProducts = Array.isArray(prodData) ? prodData : (prodData.products || []);

    return promos.map(promo => {
      const enrichedPromo = mapProductsToPromotion(promo, allProducts);
      // Para el carrusel de la homepage, se limitan los globales a 8 destacados
      if (promo.type === 'GLOBAL') {
        enrichedPromo.products = enrichedPromo.products.slice(0, 8);
      }
      return enrichedPromo;
    });
  } catch (error) {
    console.error('Error fetching active promotions:', error);
    return [];
  }
}

export async function getPromotionWithProductsById(id) {
  try {
    const promoRes = await fetch(`${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/promotions/${id}`, { cache: 'no-store' });
    if (!promoRes.ok) return null;
    const promo = await promoRes.json();

    const prodRes = await fetch(`${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?limit=100`, { next: { revalidate: 3600 } });
    const prodData = prodRes.ok ? await prodRes.json() : [];
    const allProducts = Array.isArray(prodData) ? prodData : (prodData.products || []);

    return mapProductsToPromotion(promo, allProducts);
  } catch (error) {
    console.error('Error fetching promotion by ID:', error);
    return null;
  }
}