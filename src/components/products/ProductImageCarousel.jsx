'use client';

import { useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import useProductImageStore from '@/store/useProductImageStore';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

export default function ProductImageCarousel({ images, productName }) {
  const { activeIndex, setActiveIndex } = useProductImageStore();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setActiveIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    if (emblaApi.selectedScrollSnap() !== activeIndex) {
      emblaApi.scrollTo(activeIndex);
    }
  }, [activeIndex, emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const fallbackSrc =
    'https://res.cloudinary.com/dh10owmif/image/upload/v1776060127/images_sz53ic.png';

  if (!images || images.length === 0) {
    return (
      <div
        className="bg-gray-50 rounded-2md overflow-hidden border flex items-center justify-center"
        style={{ height: '420px' }}
      >
        <img
          src={fallbackSrc}
          alt={productName}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {/* Carrusel */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((img, index) => (
            <div
              key={index}
              className="flex-none w-full bg-gray-50 rounded-2md overflow-hidden border flex items-center justify-center"
              style={{ height: '420px' }}
            >
              <img
                src={img.url}
                alt={`${productName} - Imagen ${index + 1}`}
                style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controles */}
      {images.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 -translate-y-1/2"
            style={{ left: '0px' }}
            onClick={scrollPrev}
          >
            <ChevronLeftIcon />
            <span className="sr-only">Anterior</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            className="absolute top-1/2 -translate-y-1/2"
            style={{ right: '0px' }}
            onClick={scrollNext}
          >
            <ChevronRightIcon />
            <span className="sr-only">Siguiente</span>
          </Button>
        </>
      )}

      {/* Thumbnails / dots */}
      {images.length > 1 && (
        <div className="flex justify-center gap-2 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                emblaApi?.scrollTo(i);
                setActiveIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === activeIndex ? 'bg-gray-900 scale-125' : 'bg-gray-300'
              }`}
              aria-label={`Imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
