import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryCharge = cart.length > 0 ? 15.00 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryCharge + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Create a snapshot of the order details before clearing the cart
    const orderDetails = {
      customerName: cardName || 'Guest User',
      items: [...cart],
      subtotal: cartTotal,
      tax: tax,
      shipping: deliveryCharge,
      total: grandTotal,
      paymentMethod: paymentMethod
    };

    try {
      // Send order to backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Pass the generated order ID from the backend to the success page
        orderDetails.id = data.order.id;
        
        setTimeout(() => {
          clearCart();
          navigate('/order-success', { state: { orderDetails } });
        }, 1500); // Simulate short redirect delay
      }
    } catch (err) {
      console.error("Failed to place order:", err);
      setIsProcessing(false);
    }
  };

  const inputClass = "w-full p-4 border border-white/10 rounded-xl bg-black/40 text-sm outline-none focus:bg-black/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all font-medium text-white mb-5 placeholder-gray-600";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1";
  const sectionClass = "bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] mb-8";
  const sectionHeaderClass = "text-xl font-bold tracking-tight mb-8 text-white flex items-center gap-3 border-b border-white/10 pb-4";

  if (cart.length === 0 && !isProcessing) {
    navigate('/cart');
    return null;
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i=0, len=match.length; i<len; i+=4) {
      parts.push(match.substring(i, i+4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  return (
    <>
      {/* Full Screen Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {paymentMethod === 'card' ? 'Processing Payment...' : `Redirecting to ${paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}...`}
            </h2>
            <p className="text-gray-400">Please do not close this window</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-transparent min-h-screen pb-24">
      {/* Checkout Progress Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-sm mb-10 sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-white tracking-tight">Checkout</h1>
          <div className="flex items-center gap-4 text-sm font-bold">
            <div className="flex items-center gap-2 text-cyan-400">
              <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-xs">1</span>
              Details
            </div>
            <div className="w-8 h-[2px] bg-white/10"></div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs">2</span>
              Payment
            </div>
            <div className="w-8 h-[2px] bg-white/10"></div>
            <div className="flex items-center gap-2 text-gray-500">
              <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs">3</span>
              Review
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-8 flex flex-col lg:flex-row gap-10 items-start">
        
        {/* Checkout Forms */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full"
        >
          <form onSubmit={handlePlaceOrder}>
            
            {/* Shipping Details */}
            <div className={sectionClass}>
              <h3 className={sectionHeaderClass}>
                <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center border border-cyan-500/30">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                </div>
                Shipping Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <div>
                  <label className={labelClass}>First Name</label>
                  <input type="text" className={inputClass} placeholder="Jane" />
                </div>
                <div>
                  <label className={labelClass}>Last Name</label>
                  <input type="text" className={inputClass} placeholder="Doe" />
                </div>
              </div>
              
              <label className={labelClass}>Street Address</label>
              <input type="text" className={inputClass} placeholder="123 Innovation Drive" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" className={inputClass} placeholder="San Francisco" />
                </div>
                <div>
                  <label className={labelClass}>Postal Code</label>
                  <input type="text" className={inputClass} placeholder="94103" />
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className={sectionClass}>
              <h3 className={sectionHeaderClass}>
                <div className="w-10 h-10 bg-purple-500/20 text-purple-400 rounded-xl flex items-center justify-center border border-purple-500/30">
                  <span className="material-symbols-outlined text-[22px]">credit_card</span>
                </div>
                Payment Method
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { id: 'card', name: 'Card', icon: 'credit_card' },
                  { id: 'paypal', name: 'PayPal', icon: 'account_balance_wallet' },
                  { id: 'gpay', name: 'GPay', icon: 'contactless' },
                  { id: 'phonepe', name: 'PhonePe', icon: 'qr_code_scanner' }
                ].map((method) => (
                  <label key={method.id} className={`flex flex-col items-center justify-center gap-2 cursor-pointer py-4 px-2 rounded-2xl font-bold text-[13px] tracking-wide transition-all ${paymentMethod === method.id ? 'border-2 border-cyan-400 bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'border border-white/10 bg-black/20 text-gray-400 hover:bg-white/5 hover:border-white/20'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === method.id} onChange={() => setPaymentMethod(method.id)} className="hidden" />
                    <span className="material-symbols-outlined text-2xl mb-1 opacity-80">{method.icon}</span>
                    {method.name}
                  </label>
                ))}
              </div>

              {paymentMethod === 'card' ? (
                <div className="flex flex-col xl:flex-row gap-8 items-center xl:items-start mb-4">
                  
                  {/* Dynamic Credit Card Visual */}
                  <div className="w-[360px] h-[220px] shrink-0 perspective-1000">
                    <motion.div 
                      className="w-full h-full relative preserve-3d"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    >
                      {/* Front */}
                      <div className="absolute inset-0 backface-hidden bg-gradient-to-tr from-gray-900 via-gray-800 to-black rounded-2xl border border-white/20 p-6 shadow-2xl flex flex-col justify-between overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
                        
                        <div className="flex justify-between items-center relative z-10">
                          <svg className="w-12 h-10 opacity-80" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="32" rx="6" fill="#D4AF37"/>
                            <path d="M12 0V32M24 0V32M36 0V32M0 16H48" stroke="#B8860B" strokeWidth="2"/>
                          </svg>
                          <span className="text-white/80 font-black italic tracking-widest text-lg">NEO WYNEXA</span>
                        </div>
                        
                        <div className="relative z-10 mt-6">
                          <div className="text-white text-xl font-mono tracking-[0.2em] h-7">
                            {cardNumber || "•••• •••• •••• ••••"}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-end relative z-10 mt-2">
                          <div className="flex flex-col">
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Card Holder</span>
                            <span className="text-sm text-white font-medium tracking-widest uppercase h-5 truncate max-w-[150px]">
                              {cardName || "YOUR NAME"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Expires</span>
                            <span className="text-sm text-white font-medium tracking-widest h-5">
                              {expiry || "MM/YY"}
                            </span>
                          </div>
                        </div>
                      </div>
  
                      {/* Back */}
                      <div className="absolute inset-0 backface-hidden bg-gradient-to-bl from-gray-900 to-black rounded-2xl border border-white/20 shadow-2xl overflow-hidden" style={{ transform: 'rotateY(180deg)' }}>
                        <div className="w-full h-10 bg-black mt-6"></div>
                        <div className="px-6 mt-4">
                          <div className="text-right text-[10px] text-white/50 mb-1 pr-2">CVC</div>
                          <div className="w-full h-10 bg-white/90 rounded flex items-center justify-end px-3">
                            <span className="text-black font-mono font-bold text-sm tracking-widest italic">{cvc || "•••"}</span>
                          </div>
                          <div className="mt-4 text-[8px] text-white/30 text-center uppercase tracking-widest">
                            Authorized Signature Not Valid Unless Signed
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
  
                  {/* Input Fields */}
                  <div className="flex-1 w-full bg-black/20 p-6 rounded-2xl border border-white/5">
                    <label className={labelClass}>Card Number</label>
                    <div className="relative mb-5">
                      <input 
                        type="text" 
                        maxLength="19"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        onFocus={() => setIsFlipped(false)}
                        placeholder="0000 0000 0000 0000" 
                        className={`${inputClass} !mb-0 pl-12`} 
                      />
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">payment</span>
                    </div>
                    
                    <label className={labelClass}>Cardholder Name</label>
                    <input 
                      type="text" 
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      onFocus={() => setIsFlipped(false)}
                      placeholder="Jane Doe" 
                      className={inputClass} 
                    />
  
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5">
                      <div>
                        <label className={labelClass}>Expiry Date</label>
                        <input 
                          type="text" 
                          maxLength="5"
                          value={expiry}
                          onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                          onFocus={() => setIsFlipped(false)}
                          placeholder="MM/YY" 
                          className={`${inputClass} !mb-0`} 
                        />
                      </div>
                      <div>
                        <label className={labelClass}>CVV</label>
                        <input 
                          type="text" 
                          maxLength="4"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value)}
                          onFocus={() => setIsFlipped(true)}
                          onBlur={() => setIsFlipped(false)}
                          placeholder="123" 
                          className={`${inputClass} !mb-0`} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-6 bg-black/20 border border-white/5 rounded-2xl mb-8 text-center">
                  <span className="material-symbols-outlined text-6xl text-cyan-500/50 mb-4">
                    {paymentMethod === 'paypal' ? 'account_balance_wallet' : paymentMethod === 'gpay' ? 'contactless' : 'qr_code_scanner'}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-2">
                    Pay with {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'}
                  </h4>
                  <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                    After clicking "Pay", you will be securely redirected to the {paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'gpay' ? 'Google Pay' : 'PhonePe'} gateway to authorize and complete your purchase.
                  </p>
                </div>
              )}
            </div>

            <Button type="submit" variant="gradient" size="large" fullWidth className="text-lg py-5 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              {isProcessing 
                ? 'Processing securely...' 
                : (paymentMethod === 'card' 
                    ? `Pay $${grandTotal.toFixed(2)} Securely` 
                    : `Pay with ${paymentMethod === 'paypal' ? 'PayPal' : paymentMethod === 'gpay' ? 'GPay' : 'PhonePe'}`
                  )
              }
            </Button>
          </form>
        </motion.div>

        {/* Order Summary (Sidebar) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full lg:w-[400px] shrink-0 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-28"
        >
          <h3 className={`${sectionHeaderClass} !mb-6 !pb-6`}>Order Summary</h3>
          
          <div className="max-h-[350px] overflow-y-auto mb-6 pr-2 flex flex-col gap-6 custom-scrollbar">
            {cart.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-white/10 overflow-hidden shrink-0 relative border border-white/5 backdrop-blur-sm">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-contain p-1 mix-blend-screen" />
                  <span className="absolute -top-2 -right-2 bg-cyan-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold z-10 shadow-lg border border-cyan-400">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1 text-sm">
                  <div className="font-bold text-white line-clamp-1">{item.name}</div>
                  <div className="text-cyan-400 text-[11px] font-semibold tracking-wider uppercase mt-1">{item.brand}</div>
                </div>
                <div className="font-bold text-white">
                  ${( (item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price) * item.quantity ).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-6 border-t border-white/10 pt-6 text-sm font-medium text-gray-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-white">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-white">${deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="font-bold text-white">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-end border-t border-white/10 pt-6">
            <span className="text-lg font-bold text-gray-300">Total</span>
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">${grandTotal.toFixed(2)}</span>
          </div>
        </motion.div>

      </div>
    </div>
    </>
  );
};

export default Checkout;
