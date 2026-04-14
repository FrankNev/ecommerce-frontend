import Link from 'next/link';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';

export const metadata = {
  title: 'Productos',
  description: 'Explorá nuestro catálogo de productos electrónicos',
};

async function getProducts(searchParams) {
  try {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    const url = `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?${params.toString()}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();
    return data;
  } catch (error) {
    return { products: [], total: 0, pages: 1, currentPage: 1 };
  }
}

async function getBrands() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_ECOMMERCE_API_URL}/api/products?limit=1000`,
      { cache: 'no-store' }
    );
    const { products } = await res.json();
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    return brands;
  } catch {
    return [];
  }
}

async function getCategories() {
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

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const [{ products, total, pages, currentPage }, categories, brands] = await Promise.all([
    getProducts(params),
    getCategories(),
    getBrands(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="text-gray-500 mt-1">{total} productos encontrados</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros */}
        <aside className="w-full md:w-64 shrink-0">
          <ProductFilters categories={categories} brands={brands} />
        </aside>

        {/* Grilla de productos */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              No se encontraron productos
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} totalHeight={200}/>
                ))}
              </div>

              {/* Paginación */}
              {pages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(page => {
                    const pageParams = new URLSearchParams(params);
                    pageParams.set('page', page);
                    return (
                      <Link
                        key={page}
                        href={`/products?${pageParams.toString()}`}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${page === currentPage
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {page}
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}