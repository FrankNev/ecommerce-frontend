import Link from 'next/link';

export const metadata = { title: 'Pedido recibido' };

export default function PendingTransferPage({ params }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-6">
      <div className="text-6xl">🏦</div>
      <h1 className="text-2xl font-bold text-gray-900">¡Pedido recibido!</h1>
      <p className="text-gray-500">
        Tu pedido quedó registrado y está pendiente de confirmación.
        Una vez que acreditemos tu transferencia, te notificaremos por email.
      </p>
      <div className="bg-gray-50 rounded-2xl p-6 text-left space-y-2 text-sm">
        <p className="font-semibold text-gray-900 mb-3">¿Qué hacer ahora?</p>
        <p className="text-gray-600">1. Realizá la transferencia al CBU/Alias que te mostramos en el checkout</p>
        <p className="text-gray-600">2. Guardá el comprobante</p>
        <p className="text-gray-600">3. Esperá la confirmación por email</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/orders"
          className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition"
        >
          Ver mis órdenes
        </Link>
        <Link
          href="/products"
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}