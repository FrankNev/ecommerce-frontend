'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import ProductCard from './ProductCard';

export default function ProductCarousel({ title, products = [] }) {
    if (products.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
            <Carousel opts={{ align: 'start', loop: products.length > 3 }}>
                <CarouselContent className="-ml-4 px-2">
                    {products.map(product => (
                        <CarouselItem
                            key={product._id}
                            className="p-2 pl-4 basis-1/2 sm:basis-1/2 lg:basis-1/3"
                        >
                            <ProductCard product={product} totalHeight={150}></ProductCard>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {products.length > 3 && (
                    <>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                    </>
                )}
            </Carousel>
        </section>
    );
}