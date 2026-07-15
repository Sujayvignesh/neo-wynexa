import React from 'react';
import { useShop } from '../context/ShopContext';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useShop();
  const navigate = useNavigate();

  const deliveryCharge = cart.length > 0 ? 15.00 : 0;
  const tax = cartTotal * 0.08;
  const grandTotal = cartTotal + deliveryCharge + tax;

  if (cart.length === 0) {
    return (
      <div className="bg-transparent min-h-[70vh] flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="max-w-[450px] w-full bg-black/40 backdrop-blur-xl p-12 rounded-[32px] border border-white/10 text-center shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          
          <div className="w-24 h-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10">
            <span className="material-symbols-outlined text-[48px] text-gray-500">shopping_bag</span>
          </div>
          <h2 className="text-3xl font-black mb-4 text-white tracking-tight relative z-10">Your cart is empty</h2>
          <p className="text-gray-400 mb-10 text-base relative z-10">Looks like you haven't added anything to your cart yet. Let's find something great!</p>
          <Link to="/products" className="relative z-10 block">
            <Button variant="gradient" size="large" fullWidth className="py-4 text-lg">Start Shopping</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen pb-24 relative z-10">
      <div className="bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-sm relative z-20 mb-10">
        <div className="max-w-[1440px] mx-auto px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Shopping Cart</h1>
          <p className="text-gray-400 font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 flex flex-col lg:flex-row gap-10 items-start">
        {/* Cart Items List */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <AnimatePresence>
            {cart.map((item, index) => {
              const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25, delay: index * 0.05 }}
                  key={item.id} 
                  className="flex flex-col sm:flex-row gap-6 bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] group hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="relative w-full sm:w-[140px] h-[140px] bg-white/10 border border-white/10 rounded-2xl overflow-hidden shrink-0">
                    <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover p-2 group-hover:scale-110 transition-transform duration-500 mix-blend-screen" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="text-[11px] text-cyan-400 font-bold uppercase tracking-wider mb-1 bg-cyan-500/10 border border-cyan-500/20 inline-block px-2 py-0.5 rounded-md">
                            {item.brand}
                          </div>
                          <h3 className="font-bold text-lg text-white line-clamp-1">{item.name}</h3>
                        </div>
                        <span className="text-xl font-bold text-white">${(price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center border border-white/20 h-10 bg-black/40 rounded-xl overflow-hidden">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-full text-gray-400 hover:text-white hover:bg-white/10 font-medium text-lg transition-colors outline-none cursor-pointer"
                        >-</button>
                        <span className="w-10 flex justify-center font-bold text-sm text-white">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-full text-gray-400 hover:text-white hover:bg-white/10 font-medium text-lg transition-colors outline-none cursor-pointer"
                        >+</button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center w-10 h-10 rounded-xl cursor-pointer hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        title="Remove Item"
                      >
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.2 }}
          className="w-full lg:w-[400px] shrink-0 bg-white/5 backdrop-blur-xl p-8 rounded-[32px] border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] sticky top-28 relative overflow-hidden"
        >
          {/* Glow Effect */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none"></div>

          <h3 className="text-xl font-bold tracking-tight mb-6 text-white border-b border-white/10 pb-4 relative z-10 flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">receipt_long</span>
            Order Summary
          </h3>
          
          <div className="flex gap-2 mb-8 relative z-10">
            <input type="text" placeholder="Promo code" className="flex-1 p-3 border border-white/10 rounded-xl bg-black/40 text-sm outline-none focus:bg-black/60 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all text-white placeholder-gray-500" />
            <Button variant="outline" className="border-white/20 hover:bg-white/10 text-white">Apply</Button>
          </div>

          <div className="flex flex-col gap-4 mb-6 text-sm font-medium text-gray-400 relative z-10">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-white font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Delivery</span>
              <span className="text-white font-semibold">${deliveryCharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span className="text-white font-semibold">${tax.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-white/10 pt-6 mb-8 relative z-10">
            <span className="text-lg font-bold text-gray-300">Total</span>
            <span className="text-3xl font-black text-cyan-400">${grandTotal.toFixed(2)}</span>
          </div>
          
          <div className="relative z-10">
            <Button variant="gradient" size="large" fullWidth onClick={() => navigate('/checkout')} className="mb-4 text-lg py-4">
              Proceed to Checkout
            </Button>
          </div>
          
          <div className="text-center text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-4 relative z-10">
            <span className="material-symbols-outlined text-sm">lock</span>
            Secure encrypted checkout
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Cart;
