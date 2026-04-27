const parseJSON = (val) => {
  if (!val) return null;
  if (typeof val === 'object') return val;
  try { return JSON.parse(val); } catch { return null; }
};

const isPromotionActive = (promo) => {
  if (!promo.is_active) return false;
  const now = new Date();
  if (promo.start_date && new Date(promo.start_date) > now) return false;
  if (promo.end_date && new Date(promo.end_date) < now) return false;
  return true;
};

const promotionAppliesToProduct = (promo, product) => {
  if (promo.type === 'GLOBAL') {
    const conditions = parseJSON(promo.conditions);
    if (conditions?.excluded_categories) {
      if (conditions.excluded_categories.includes(Number(product.category_id))) return false;
    }
    if (conditions?.excluded_brands && product.brand) {
      if (conditions.excluded_brands.map(b => b.toLowerCase()).includes(product.brand.toLowerCase())) return false;
    }
    return true;
  }
  if (promo.type === 'SPECIFIC') {
    const productIds = parseJSON(promo.product_ids);
    if (!Array.isArray(productIds)) return false;
    const id = (product._id ?? product.id)?.toString();
    return productIds.includes(id);
  }
  return false;
};

export const calculateFinalPrice = (product, promotions = [], options = {}) => {
  const basePrice = Number(product.price);

  const eligible = promotions.filter(p => {
    if (!isPromotionActive(p)) return false;
    if (!promotionAppliesToProduct(p, product)) return false;
    const conditions = parseJSON(p.conditions);
    if (conditions?.min_purchase && options.cartTotal !== undefined) {
      if (options.cartTotal < Number(conditions.min_purchase)) return false;
    }
    return true;
  });

  if (eligible.length === 0) {    return { finalPrice: basePrice, appliedPromotion: null, discountAmount: 0, discountPercent: 0 };
  }

  eligible.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'SPECIFIC' ? -1 : 1;
    return Number(b.priority) - Number(a.priority);
  });

  const winner = eligible[0];
  let finalPrice = basePrice;
  if (winner.discount_type === 'PERCENTAGE') {
    finalPrice = basePrice * (1 - Number(winner.value) / 100);
  } else {
    finalPrice = basePrice - Number(winner.value);
  }
  finalPrice = Math.max(0, Math.round(finalPrice));

  const discountAmount = basePrice - finalPrice;
  const discountPercent = basePrice > 0 ? Math.round((discountAmount / basePrice) * 1000) / 10 : 0;

  return { finalPrice, appliedPromotion: winner, discountAmount, discountPercent };
};