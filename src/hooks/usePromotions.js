'use client';

import { useState, useEffect, useCallback } from 'react';
import { ecommerceAPI } from '@/lib/axios';
import { calculateFinalPrice } from '@/lib/priceEngine';

let cachedPromotions = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

export function usePromotions() {
  const [promotions, setPromotions] = useState(cachedPromotions ?? []);
  const [loading, setLoading] = useState(!cachedPromotions);

  useEffect(() => {
    const now = Date.now();
    if (cachedPromotions && now - cacheTime < CACHE_TTL) {
      setPromotions(cachedPromotions);
      setLoading(false);
      return;
    }

    ecommerceAPI.get('/api/promotions/active')
      .then(({ data }) => {
        cachedPromotions = data;
        cacheTime = Date.now();
        setPromotions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getProductPrice = useCallback((product, options = {}) => {
    return calculateFinalPrice(product, promotions, options);
  }, [promotions]);

  return { promotions, loading, getProductPrice };
}