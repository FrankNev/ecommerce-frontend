import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FAQS = [
  {
    question: '¿Cuáles son los medios de pago disponibles?',
    answer: 'Aceptamos todos los medios de pago disponibles en MercadoPago: tarjetas de crédito y débito, transferencia bancaria y pago en efectivo en puntos de pago.',
  },
  {
    question: '¿Cuánto tarda el envío?',
    answer: 'Los envíos dentro del AMBA demoran entre 24 y 48 horas hábiles. Para el interior del país, entre 3 y 7 días hábiles dependiendo de la localidad.',
  },
  {
    question: '¿Los productos tienen garantía?',
    answer: 'Todos nuestros productos tienen garantía oficial del fabricante. Adicionalmente ofrecemos 30 días de garantía de satisfacción.',
  },
  {
    question: '¿Puedo devolver un producto?',
    answer: 'Sí, aceptamos devoluciones dentro de los 30 días de recibido el producto, siempre que esté en su estado original con todos sus accesorios.',
  },
  {
    question: '¿Los precios incluyen IVA?',
    answer: 'Los precios publicados incluyen IVA. En el detalle de cada producto podés ver el precio sin IVA de forma orientativa.',
  },
];

export default function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Preguntas frecuentes</h2>
      <Accordion type="single" collapsible className="space-y-2">
        {FAQS.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="bg-white border border-gray-300 rounded-2xl px-6 shadow-sm"
          >
            <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-700 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}