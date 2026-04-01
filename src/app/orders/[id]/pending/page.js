import Link from 'next/link';

export const metadata = { title: 'Pago pendiente' };

export default function PaymentPendingPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Pago pendiente</h1>
      <p className="text-gray-500 mb-8">
        Tu pago está siendo procesado. Te avisaremos cuando se confirme.
      </p>
      <Link
        href="/orders"
        className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
      >
        Ver mis órdenes
      </Link>
    </div>
  );
}