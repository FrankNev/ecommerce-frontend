'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ecommerceAPI } from '@/lib/axios';
import useCartStore from '@/store/useCartStore';
import useAuthStore from '@/store/useAuthStore';
import { usePromotions } from '@/hooks/usePromotions';
import { calculateFinalPrice } from '@/lib/priceEngine';

import StepHeader from './components/StepHeader';
import OrderSummary from './components/OrderSummary';
import StepContact, { validateContactForm } from './steps/StepContact';
import StepShipping, { validateShippingForm } from './steps/StepShipping';
import StepPayment from './steps/StepPayment';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const { promotions } = usePromotions();
  const user = useAuthStore(state => state.user);
  const [bankInfo, setBankInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Step tracking: 1 = contact, 2 = shipping, 3 = payment
  const [activeStep, setActiveStep] = useState(1);

  // Step 1 - Contact
  const [contact, setContact] = useState({
    nombre: '',
    apellido: '',
    email: '',
    dni: '',
    telefono: '',
  });

  // Step 2 - Shipping
  const [shippingType, setShippingType] = useState('home');
  const [address, setAddress] = useState({
    direccion: '', numero: '', piso: '', ciudad: '', provincia: '', codigo_postal: '',
  });

  // Step 3 - Payment
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [paymentSubMethod, setPaymentSubMethod] = useState(null);

  // ── Pre-fill from logged user ────────────────────────────────────────────────
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    if (user) {
      setContact(prev => ({
        ...prev,
        email: user.email || prev.email,
        nombre: user.name?.split(' ')[0] || prev.nombre,
        apellido: user.name?.split(' ').slice(1).join(' ') || prev.apellido,
      }));
    }
    ecommerceAPI.get('/api/payments/bank-info').then(({ data }) => setBankInfo(data));
  }, [mounted, user]);

  // ── Totals ───────────────────────────────────────────────────────────────────
  const rawTotal = getTotal();

  const promoTotal = items.reduce((acc, { product, quantity }) => {
    const base = { ...product, price: product.selectedVariant?.price ?? product.price };
    const { finalPrice } = calculateFinalPrice(base, promotions, { cartTotal: rawTotal });
    return acc + finalPrice * quantity;
  }, 0);

  const transferDiscount = paymentSubMethod === 'account' && bankInfo
    ? promoTotal * (bankInfo.discountPercent / 100)
    : 0;

  const finalTotal = promoTotal - transferDiscount;

  // ── Step handlers ────────────────────────────────────────────────────────────
  const confirmContact = () => {
    const error = validateContactForm(contact);
    if (error) { toast.error(error); return; }
    setActiveStep(2);
  };

  const confirmShipping = () => {
    const error = validateShippingForm(shippingType, address);
    if (error) { toast.error(error); return; }
    setActiveStep(3);
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentSubMethod(null);
  };

  const handleSubMethodChange = (sub) => {
    setPaymentSubMethod(sub);
  };

  // ── Build step summaries ─────────────────────────────────────────────────────
  const contactSummary = contact.nombre
    ? `${contact.nombre} ${contact.apellido} · ${contact.email}`
    : '';

  const shippingSummary = shippingType === 'pickup'
    ? 'Retiro en local'
    : address.direccion
      ? `${address.direccion} ${address.numero}, ${address.ciudad}`
      : 'Envío a domicilio';

  const paymentSummary = paymentSubMethod === 'card'
    ? 'MercadoPago — Tarjeta'
    : paymentSubMethod === 'account'
      ? 'MercadoPago — Dinero en cuenta'
      : '';

  // ── Checkout submit ──────────────────────────────────────────────────────────
  const canSubmit = activeStep === 3 && paymentSubMethod !== null;

  const handleCheckout = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      // Build shipping_data — includes contact info for the order record
      const shipping_data =
        shippingType === 'pickup'
          ? {
              shipping_type: 'pickup',
              nombre: contact.nombre,
              apellido: contact.apellido,
              email: contact.email,
              dni: contact.dni,
              telefono: contact.telefono,
            }
          : {
              shipping_type: 'home',
              nombre: contact.nombre,
              apellido: contact.apellido,
              email: contact.email,
              dni: contact.dni,
              telefono: contact.telefono,
              ...address,
            };

      // Create order
      const { data: order } = await ecommerceAPI.post('/api/orders', {
        items: items.map(({ product, quantity }) => ({
          product_id: product._id,
          quantity,
          variant_id: product.selectedVariant?._id || null,
        })),
        shipping_data,
        paymentSubMethod,
      });

      const { data: payment } = await ecommerceAPI.post('/api/payments/create-preference', {
        orderId: order.orderId,
        items: order.items,
        excludedPaymentTypes: excludedTypes,
        paymentSubMethod,
      });

      clearCart();
      window.location.href = payment.initPoint;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error en el checkout');
    } finally {
      setLoading(false);
    }
  };

  // ── Early exits ──────────────────────────────────────────────────────────────
  if (!mounted || items.length === 0) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Confirmar pedido</h1>

      <div
        className="gap-8 items-start"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
        }}
      >
        {/* ── Left column: steps ── */}
        <div className="space-y-3">

          {/* Step 1 — Contact */}
          <StepHeader
            step={1}
            title="Datos de contacto"
            isCompleted={activeStep > 1}
            isActive={activeStep === 1}
            summary={contactSummary}
            onEdit={() => setActiveStep(1)}
          >
            <StepContact
              data={contact}
              onChange={(field, value) => setContact(prev => ({ ...prev, [field]: value }))}
              onConfirm={confirmContact}
              loggedUser={user}
            />
          </StepHeader>

          {/* Step 2 — Shipping */}
          <StepHeader
            step={2}
            title="Método de envío"
            isCompleted={activeStep > 2}
            isActive={activeStep === 2}
            summary={shippingSummary}
            onEdit={() => setActiveStep(2)}
          >
            <StepShipping
              shippingType={shippingType}
              addressData={address}
              onTypeChange={setShippingType}
              onAddressChange={(field, value) => setAddress(prev => ({ ...prev, [field]: value }))}
              onConfirm={confirmShipping}
            />
          </StepHeader>

          {/* Step 3 — Payment */}
          <StepHeader
            step={3}
            title="Método de pago"
            isCompleted={activeStep > 3}
            isActive={activeStep === 3}
            summary={paymentSummary}
            onEdit={() => setActiveStep(3)}
          >
            <div className="space-y-4">
              <StepPayment
                paymentMethod={paymentMethod}
                paymentSubMethod={paymentSubMethod}
                onMethodChange={handlePaymentMethodChange}
                onSubMethodChange={handleSubMethodChange}
                bankInfo={bankInfo}
              />
              {paymentSubMethod && (
                <p className="text-xs text-gray-400 text-center pt-1">
                  Serás redirigido a MercadoPago para completar el pago de forma segura.
                </p>
              )}
            </div>
          </StepHeader>
        </div>

        {/* ── Right column: summary ── */}
        <OrderSummary
          items={items}
          promotions={promotions}
          rawTotal={rawTotal}
          promoTotal={promoTotal}
          transferDiscount={transferDiscount}
          bankInfo={bankInfo}
          paymentSubMethod={paymentSubMethod}
          finalTotal={finalTotal}
          calculateFinalPrice={calculateFinalPrice}
          loading={loading}
          onSubmit={handleCheckout}
          canSubmit={canSubmit}
        />
      </div>
    </div>
  );
}