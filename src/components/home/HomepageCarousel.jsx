'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HomepageCarousel({ slides }) {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }));
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative w-full group">
      <Carousel plugins={[plugin.current]} setApi={setApi} className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative overflow-hidden w-full h-[250px] md:h-[350px]">
                <img
                  src={slide.image}
                  alt={slide.title || 'Promoción'}
                  className="w-full h-full object-cover"
                />
                {slide.overlay && slide.title && (
                  <div
                    className="absolute inset-0 flex items-center px-8 md:px-16"
                    style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)' }}
                  >
                    <div className="text-white space-y-3 md:space-y-4 max-w-lg">
                      <h2 className="text-2xl md:text-4xl font-bold leading-tight">{slide.title}</h2>
                      {slide.subtitle && <p className="text-sm md:text-lg text-white/80">{slide.subtitle}</p>}
                      {slide.cta && slide.url && (
                        <Link
                          href={slide.url}
                          prefetch={false}
                          className="inline-block bg-white text-gray-900 px-4 py-2 md:px-6 md:py-3 rounded-md font-semibold hover:bg-gray-100 transition text-sm md:text-base"
                        >
                          {slide.cta}
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <Button
          variant="outline"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 border-white/50 text-white hover:bg-white hover:text-black rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:flex"
          onClick={() => api?.scrollPrev()}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 border-white/50 text-white hover:bg-white hover:text-black rounded-full h-10 w-10 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden md:flex"
          onClick={() => api?.scrollNext()}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>

        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                current === index 
                  ? 'w-8 bg-white' 
                  : 'w-2.5 bg-white/50 hover:bg-white/80'
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>
    </div>
  );
}