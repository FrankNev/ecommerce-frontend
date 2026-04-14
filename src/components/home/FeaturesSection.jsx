const FEATURES = [
  {
    svg: 'https://www.svgrepo.com/show/236649/delivery-truck-truck.svg',
    title: 'Envío gratis',
    description: 'En compras mayores a $500.000',
  },
  {
    svg: 'https://www.svgrepo.com/show/9324/secure-payment.svg',
    title: 'Pago seguro',
    description: 'Con MercadoPago y todos los medios',
  },
  {
    svg: 'https://www.svgrepo.com/show/448881/warranty.svg',
    title: '30 días de garantía',
    description: 'Devolución sin preguntas',
  },
  {
    svg: 'https://www.svgrepo.com/show/486865/support.svg',
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
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
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="bg-white rounded-md border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center gap-4"
          >
            <div
              className="bg-gray-50 rounded-xl flex items-center justify-center"
              style={{ width: '64px', height: '64px', padding: '12px' }}
            >
              <img
                src={feature.svg}
                alt={feature.title}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <p className="font-bold text-gray-900">{feature.title}</p>
              <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}