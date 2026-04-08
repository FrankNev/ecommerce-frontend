'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useRef } from 'react';
import Link from 'next/link';

const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1400&q=80',
        title: 'Los últimos smartphones',
        subtitle: 'Encontrá el tuyo al mejor precio',
        cta: 'Ver productos',
        categoryId: '2',
        overlay: true,
    },
    {
        image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1400&q=80',
        title: 'Smartwatches y wearables',
        subtitle: 'Tecnología en tu muñeca',
        cta: 'Explorar',
        categoryId: '3',
        overlay: true,
    },
    {
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1400&q=80',
        title: 'Audio de alta calidad',
        subtitle: 'Auriculares y parlantes premium',
        cta: 'Ver más',
        categoryId: '4',
        overlay: true,
    },
];

export default function HomepageCarousel() {
    const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));

    return (
        <div style={{ position: 'relative', width: '100%' }}>
            <Carousel plugins={[plugin.current]} className="w-full">
                <CarouselContent>
                    {SLIDES.map((slide, index) => (
                        <CarouselItem key={index}>
                            <div
                                style={{
                                    position: 'relative',
                                    height: '480px',
                                    overflow: 'hidden',
                                }}
                            >
                                <img
                                    src={slide.image}
                                    alt={slide.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                                {slide.overlay && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.1) 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            padding: '0 4rem',
                                        }}
                                    >
                                        <div className="text-white space-y-4 max-w-lg">
                                            <h2 className="text-4xl font-bold leading-tight">{slide.title}</h2>
                                            <p className="text-lg text-white/80">{slide.subtitle}</p>
                                            <Link
                                                href={`/products?category=${slide.categoryId}`}
                                                className="inline-block bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                                            >
                                                {slide.cta}
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious style={{ left: '16px' }} />
                <CarouselNext style={{ right: '16px' }} />
            </Carousel>
        </div>
    );
}