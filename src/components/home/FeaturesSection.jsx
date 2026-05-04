import { BadgeCheck, Truck, ShieldCheck, MessagesSquare } from 'lucide-react';

const FEATURES = [
  {
    icon: Truck,
    title: 'Envío gratis a todo el país',
    description: 'En compras mayores a $500.000',
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro',
    description: 'Con MercadoPago y todos los medios',
  },
  {
    icon: BadgeCheck,
    title: '30 días de garantía',
    description: 'Devolución por fallos de fábrica',
  },
  {
    icon: MessagesSquare,
    title: 'Soporte directo',
    description: 'Estamos para ayudarte y resolver tus dudas',
  },
];

export default function FeaturesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-white mb-6">¿Por qué elegirnos?</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))',
          gap: '1.5rem',
        }}
      >
        {FEATURES.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="bg-white rounded-md border border-gray-100 shadow-sm p-6 flex lg:flex-col items-center lg:text-center gap-4"
          >
            <div
              className="bg-gray-100 rounded-md flex items-center justify-center"
              style={{ width: '64px', height: '64px', padding: '12px' }}
            >
              <Icon size={32} className="text-gray-500" />
            </div>
            <div>
              <p className="font-bold text-gray-900">{title}</p>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}