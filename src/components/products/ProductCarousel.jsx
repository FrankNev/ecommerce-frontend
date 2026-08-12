'use client';

import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, products = [] }) {
  const [api, setApi] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  if (products.length === 0) return null;

  return (
    <section className="max-w-8xl mx-auto py-2">
      {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
      
      <div 
        className="relative" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Carousel setApi={setApi} opts={{ align: 'start', loop: products.length > 3 }}>
          <CarouselContent className="px-4">
            {products.map(product => (
              <CarouselItem
                key={product._id}
                className="py-2 basis-auto min-w-fit"
              >
                <ProductCard product={product}></ProductCard>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {products.length > 3 && (
            <>
              {/* Botón Anterior */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute -left-4 top-1/2 -translate-y-1/2 bg-white/90 border-gray-200 text-black hover:bg-white hover:text-black shadow-md rounded-full h-10 w-10 opacity-0 transition-all duration-300 z-10 hidden md:flex ${isHovered ? 'opacity-100' : ''}`}
                onClick={() => api?.scrollPrev()}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>

              {/* Botón Siguiente */}
              <Button
                variant="outline"
                size="icon"
                className={`absolute -right-4 top-1/2 -translate-y-1/2 bg-white/90 border-gray-200 text-black hover:bg-white hover:text-black shadow-md rounded-full h-10 w-10 opacity-0 transition-all duration-300 z-10 hidden md:flex ${isHovered ? 'opacity-100' : ''}`}
                onClick={() => api?.scrollNext()}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </Carousel>
      </div>
    </section>
  );
}