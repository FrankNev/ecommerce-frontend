import Link from 'next/link';

export const metadata = { title: 'Pago fallido' };

export default function PaymentFailurePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">El pago no se completó</h1>
      <p className="text-gray-500 mb-8">
        Hubo un problema con tu pago. Podés intentarlo nuevamente.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/cart"
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Volver al carrito
        </Link>
        <Link
          href="/products"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Ver productos
        </Link>
      </div>
    </div>
  );
}