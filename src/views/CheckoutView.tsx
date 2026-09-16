import React, { useState } from 'react';
import {
  ShieldCheck,
  Bike,
  Building,
  CreditCard,
  Wallet,
  Building2,
  Banknote,
  CheckCircle2,
  ArrowLeft,
  Lock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Order, PaymentMethod } from '../types';
import { createOrder } from '../services/dbService';
import { PaymentManager } from '../services/paymentService';
import { NotificationService } from '../services/notificationService';

interface CheckoutViewProps {
  onBackToMenu: () => void;
  onOrderPlaced: (order: Order) => void;
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Peshawar',
  'Faisalabad',
  'Multan',
  'Sialkot',
  'Gujranwala',
];

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBackToMenu, onOrderPlaced }) => {
  const {
    cart,
    subtotal,
    deliveryFee,
    tax,
    discount,
    total,
    deliveryType,
    setDeliveryType,
    coupon,
    clearCart,
    settings,
  } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { t } = useLanguage();

  const [customerName, setCustomerName] = useState(userProfile?.displayName || currentUser?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState(userProfile?.phone || '03001234567');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || 'patron@dastaan.pk');

  // Address
  const [city, setCity] = useState('Lahore');
  const [area, setArea] = useState('Gulberg III');
  const [streetAddress, setStreetAddress] = useState('House 14, Street 2');
  const [landmark, setLandmark] = useState('Near Main Boulevard');
  const [riderNotes, setRiderNotes] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [transactionRef, setTransactionRef] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="p-8 rounded-3xl bg-[#13131b] border border-[#242434]">
          <h2 className="font-heading text-2xl font-bold text-[#f5efe6] mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-xs text-[#8c8a9a] mb-6">
            Please add dishes from our royal menu before proceeding to checkout.
          </p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 rounded-xl bg-[#d4af37] text-[#0b0b0d] font-bold text-xs cursor-pointer shadow"
          >
            Explore Royal Menu
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMessage('Please provide your full name and Pakistani mobile number.');
      return;
    }

    if (deliveryType === 'delivery' && (!streetAddress.trim() || !area.trim())) {
      setErrorMessage('Please provide your complete delivery address and area.');
      return;
    }

    // If online payment method selected (JazzCash, Easypaisa, Bank Transfer), ensure ref or note
    if (paymentMethod !== 'cod' && !transactionRef.trim()) {
      setErrorMessage(`Please enter your ${paymentMethod.toUpperCase()} Transaction ID or Reference Number after initiating payment.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const orderNumber = `ORD-2026-${Math.floor(Math.random() * 900000 + 100000)}`;
      const orderId = `order-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

      const newOrder: Order = {
        id: orderId,
        orderNumber,
        customerId: currentUser?.uid,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        deliveryType,
        deliveryAddress:
          deliveryType === 'delivery'
            ? {
                city,
                area: area.trim(),
                streetAddress: streetAddress.trim(),
                landmark: landmark.trim(),
                riderNote: riderNotes.trim(),
              }
            : undefined,
        branchId: 'branch-gulberg-lhr',
        branchName: 'Dastaan Flagship - Gulberg Lahore',
        items: [...cart],
        subtotal,
        deliveryFee,
        tax,
        discount,
        couponCode: coupon?.code,
        total,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'pending' : 'verified',
        orderStatus: 'confirmed',
        transactionId: transactionRef.trim() || undefined,
        notes: riderNotes.trim(),
        createdAt: new Date().toISOString(),
      };

      // 1. Create order in Firestore
      await createOrder(newOrder);

      // 2. Dispatch simulated notification
      await NotificationService.dispatchServerNotification(
        'sms',
        newOrder.customerPhone,
        NotificationService.formatOrderSMS(newOrder)
      );

      // 3. Clear cart
      clearCart();

      // 4. Trigger success callback
      onOrderPlaced(newOrder);
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage('Could not place order. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Breadcrumb */}
      <button
        onClick={onBackToMenu}
        className="text-xs text-[#a09fae] hover:text-[#d4af37] flex items-center gap-1.5 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Royal Menu</span>
      </button>

      <div className="mb-8">
        <p className="font-urdu text-lg text-[#d4af37]">محفوظ ادائیگی اور آرڈر کی تصدیق</p>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-[#f5efe6]">
          Checkout &amp; Royal Dispatch
        </h1>
        <p className="text-xs text-[#8f8e9e] mt-1">
          Complete your contact information and select your preferred Pakistani payment method.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#2a1313] border border-[#ef444450] text-[#fca5a5] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1. Fulfillment Mode */}
          <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330]">
            <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider mb-3 flex items-center gap-2">
              <Bike className="w-4 h-4 text-[#d4af37]" />
              <span>1. Select Fulfillment Mode</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  deliveryType === 'delivery'
                    ? 'border-[#d4af37] bg-[#221c0e] text-[#f3c64c]'
                    : 'border-[#262638] bg-[#161622] text-[#8e8d9e]'
                }`}
              >
                <Bike className="w-5 h-5" />
                <span className="text-xs font-bold">Doorstep Delivery</span>
                <span className="text-[10px] text-[#b8b6c4]">Estimated 35–45 Mins</span>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  deliveryType === 'pickup'
                    ? 'border-[#d4af37] bg-[#221c0e] text-[#f3c64c]'
                    : 'border-[#262638] bg-[#161622] text-[#8e8d9e]'
                }`}
              >
                <Building className="w-5 h-5" />
                <span className="text-xs font-bold">Restaurant Pickup</span>
                <span className="text-[10px] text-[#b8b6c4]">Gulberg Flagship Branch</span>
              </button>
            </div>
          </div>

          {/* 2. Customer Contact */}
          <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330] space-y-4">
            <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider flex items-center gap-2">
              <span>2. Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Barrister Ahmed Khan"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                  Mobile Number (for SMS &amp; WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0300-1234567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                Email Address (for Digital Tax Receipt)
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="you@domain.pk"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          {/* 3. Delivery Address (if Delivery opted) */}
          {deliveryType === 'delivery' && (
            <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330] space-y-4 animate-in fade-in">
              <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider flex items-center gap-2">
                <span>3. Delivery Address</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                    City *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37] cursor-pointer"
                  >
                    {PAKISTANI_CITIES.map((c) => (
                      <option key={c} value={c} className="bg-[#171723]">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                    Area / Society / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Gulberg III, DHA Phase 5, Bahria Town"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                  Complete Street Address &amp; House No. *
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. House 42-B, Street 7, Block K"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                    Nearest Landmark
                  </label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Siddique Trade Center"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#9c9aa8] mb-1">
                    Rider Note / Gate Code
                  </label>
                  <input
                    type="text"
                    value={riderNotes}
                    onChange={(e) => setRiderNotes(e.target.value)}
                    placeholder="e.g. Ring bell twice, leave with guard"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#171723] border border-[#2b2b3b] text-sm text-[#f5efe6] focus:outline-none focus:border-[#d4af37]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 4. Pakistani Payment Options */}
          <div className="p-5 rounded-2xl bg-[#13131b] border border-[#232330] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading text-sm font-semibold text-[#f5efe6] uppercase tracking-wider flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#d4af37]" />
                <span>4. Pakistani Payment Architecture</span>
              </h3>
              <span className="text-[10px] text-[#4ade80] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#d4af37] bg-[#221c0e]'
                    : 'border-[#262638] bg-[#161622]'
                }`}
              >
                <Banknote className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#f5efe6] block">Cash on Delivery (COD)</span>
                  <span className="text-[11px] text-[#8e8d9e]">Pay cash directly to dispatch rider</span>
                </div>
              </div>

              {/* JazzCash */}
              <div
                onClick={() => setPaymentMethod('jazzcash')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'jazzcash'
                    ? 'border-[#d4af37] bg-[#221c0e]'
                    : 'border-[#262638] bg-[#161622]'
                }`}
              >
                <Wallet className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#f5efe6] block">JazzCash Mobile Wallet</span>
                  <span className="text-[11px] text-[#8e8d9e]">Till Account / App Prompt</span>
                </div>
              </div>

              {/* Easypaisa */}
              <div
                onClick={() => setPaymentMethod('easypaisa')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'easypaisa'
                    ? 'border-[#d4af37] bg-[#221c0e]'
                    : 'border-[#262638] bg-[#161622]'
                }`}
              >
                <Wallet className="w-5 h-5 text-[#22c55e] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#f5efe6] block">Easypaisa Wallet</span>
                  <span className="text-[11px] text-[#8e8d9e]">Instant wallet transfer</span>
                </div>
              </div>

              {/* Bank Transfer */}
              <div
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#d4af37] bg-[#221c0e]'
                    : 'border-[#262638] bg-[#161622]'
                }`}
              >
                <Building2 className="w-5 h-5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-[#f5efe6] block">Direct Bank / Raast</span>
                  <span className="text-[11px] text-[#8e8d9e]">1Link / IBAN online transfer</span>
                </div>
              </div>
            </div>

            {/* Payment Details Drawer if JazzCash/Easypaisa/Bank chosen */}
            {paymentMethod === 'jazzcash' && (
              <div className="p-4 rounded-xl bg-[#191515] border border-[#ef444440] text-xs space-y-1.5 animate-in fade-in">
                <span className="font-bold text-[#ef4444] block">JazzCash Transfer Instructions:</span>
                <p className="text-[#d6d4dc]">
                  Send <strong className="text-[#f5efe6]">PKR {total.toLocaleString()}</strong> to JazzCash Account:
                </p>
                <div className="p-2 rounded bg-[#0e0c0c] font-mono text-[#f3c64c]">
                  Account: {settings.jazzCashAccountNumber || '0300-1234567'} ({settings.jazzCashAccountTitle || 'Dastaan Ltd'})
                </div>
                <div className="pt-2">
                  <label className="block text-[11px] text-[#a09fae] mb-1">
                    Enter JazzCash Transaction ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. 1298471283"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#0e0c0c] border border-[#3e2323] text-sm text-white focus:outline-none focus:border-[#ef4444]"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'easypaisa' && (
              <div className="p-4 rounded-xl bg-[#111913] border border-[#22c55e40] text-xs space-y-1.5 animate-in fade-in">
                <span className="font-bold text-[#22c55e] block">Easypaisa Instructions:</span>
                <p className="text-[#d6d4dc]">
                  Send <strong className="text-[#f5efe6]">PKR {total.toLocaleString()}</strong> to Easypaisa Wallet:
                </p>
                <div className="p-2 rounded bg-[#090f0b] font-mono text-[#4ade80]">
                  Wallet: {settings.easyPaisaAccountNumber || '0345-1234567'} ({settings.easyPaisaAccountTitle || 'Dastaan Ltd'})
                </div>
                <div className="pt-2">
                  <label className="block text-[11px] text-[#a09fae] mb-1">
                    Enter Easypaisa Transaction ID (TID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. 98237461"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#090f0b] border border-[#1b3d22] text-sm text-white focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 rounded-xl bg-[#101824] border border-[#38bdf840] text-xs space-y-1.5 animate-in fade-in">
                <span className="font-bold text-[#38bdf8] block">Bank Account &amp; Raast Details:</span>
                <div className="p-2.5 rounded bg-[#090e15] font-mono text-[#bae6fd] space-y-1 text-[11px]">
                  <div>Bank: <strong className="text-white">{settings.bankName}</strong></div>
                  <div>Title: <strong className="text-white">{settings.bankAccountTitle}</strong></div>
                  <div>Account No: <strong className="text-white">{settings.bankAccountNumber}</strong></div>
                  <div>IBAN: <strong className="text-white">{settings.bankIban}</strong></div>
                </div>
                <div className="pt-2">
                  <label className="block text-[11px] text-[#a09fae] mb-1">
                    Enter Bank Reference / Raast TID *
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. FT26091600129"
                    className="w-full px-3 py-1.5 rounded-lg bg-[#090e15] border border-[#1e3450] text-sm text-white focus:outline-none focus:border-[#38bdf8]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-[#13131b] border border-[#272737] space-y-4 sticky top-28">
            <h3 className="font-heading text-base font-bold text-[#f5efe6] pb-3 border-b border-[#20202e]">
              Dastarkhwan Summary
            </h3>

            {/* Dishes list */}
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1 text-xs">
              {cart.map((item) => (
                <div key={item.cartItemId} className="flex justify-between items-start gap-2">
                  <div className="min-w-0">
                    <span className="text-[#f5efe6] font-medium block truncate">
                      {item.quantity}x {item.product.name}
                    </span>
                    {item.selectedVariation && (
                      <span className="text-[10px] text-[#d4af37] block">
                        {item.selectedVariation.name}
                      </span>
                    )}
                  </div>
                  <span className="text-[#d4af37] font-semibold whitespace-nowrap">
                    PKR {item.itemTotal.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-[#20202e] space-y-2 text-xs text-[#9d9ba9]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-[#f5efe6]">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery:</span>
                <span className="text-[#f5efe6]">
                  {deliveryFee === 0 ? <span className="text-[#4ade80]">FREE</span> : `PKR ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              {tax > 0 && (
                <div className="flex justify-between">
                  <span>PRA/SRB Tax ({settings.defaultTaxRate}%):</span>
                  <span className="text-[#f5efe6]">PKR {tax.toLocaleString()}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[#4ade80]">
                  <span>Discount ({coupon?.code}):</span>
                  <span>-PKR {discount.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-3 border-t border-[#20202e] flex justify-between text-base font-bold text-[#f5efe6]">
                <span>Total:</span>
                <span className="text-[#d4af37] font-heading">
                  PKR {total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-[#d4af37] hover:bg-[#e4bd43] text-[#0b0b0d] font-bold text-sm tracking-wide transition-all shadow-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Confirming Royal Order...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>{t('placeOrder')}</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-center text-[#6e6d7d]">
              By confirming, you agree to Dastaan's food hygiene and delivery protocols. An instant WhatsApp slip will be generated.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
