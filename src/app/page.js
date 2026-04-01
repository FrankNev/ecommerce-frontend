import Link from 'next/link';

export const metadata = {
  title: 'Inicio',
  description: 'Bienvenido a Mi Tienda, tu tienda online de electrónica',
};

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-900 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            La mejor tecnología,<br />al mejor precio
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Encontrá los últimos smartphones, auriculares, smartwatches y más.
            Envíos a todo el país.
          </p>
          <Link
            href="/products"
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition inline-block"
          >
            Ver productos
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl mb-4">🚚</div>
            <h3 className="font-bold text-lg mb-2">Envío gratis</h3>
            <p className="text-gray-500 text-sm">En compras mayores a $50.000</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-bold text-lg mb-2">Pago seguro</h3>
            <p className="text-gray-500 text-sm">Con MercadoPago y todos los medios</p>
          </div>
          <div className="p-6">
            <div className="text-4xl mb-4">↩️</div>
            <h3 className="font-bold text-lg mb-2">30 días de garantía</h3>
            <p className="text-gray-500 text-sm">Devolución sin preguntas</p>
          </div>
        </div>
      </section>
    </div>
  );
}