import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/Button';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from "jspdf";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartTotal, cart } = useShop(); 
  
  // Use orderDetails from state if available, otherwise fallback to cart (in case of direct navigation)
  const orderDetails = location.state?.orderDetails || {
    items: cart,
    subtotal: cartTotal,
    tax: cartTotal * 0.08,
    shipping: cart.length > 0 ? 15.00 : 0,
    total: cartTotal + (cartTotal * 0.08) + (cart.length > 0 ? 15.00 : 0)
  };
  
  // Keep order number stable across re-renders
  const [orderNumber] = React.useState(() => Math.floor(Math.random() * 1000000));
  const [isDownloading, setIsDownloading] = useState(false);
  
  const receiptRef = useRef(null);

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;
    
    setIsDownloading(true);
    
    try {
      // Un-hide the receipt container just long enough to capture it
      receiptRef.current.style.display = 'block';
      receiptRef.current.style.position = 'absolute';
      receiptRef.current.style.left = '-9999px';
      
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2, // Higher quality
        useCORS: true,
        backgroundColor: '#0f172a' // slate-900
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`NeoWynexa-Receipt-ORD-${orderNumber}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      receiptRef.current.style.display = 'none';
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className="bg-transparent min-h-[80vh] flex items-center justify-center py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="max-w-lg w-full bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] text-center relative overflow-hidden"
        >
          {/* Glow Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-32 -mb-32 pointer-events-none"></div>

          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
            className="w-24 h-24 bg-cyan-500/20 border-2 border-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,211,238,0.3)] relative z-10"
          >
            <span className="material-symbols-outlined text-cyan-400 text-5xl">check</span>
          </motion.div>
          
          <h2 className="text-3xl font-black tracking-tight text-white mb-3 relative z-10">Order Confirmed!</h2>
          <p className="text-gray-400 mb-2 relative z-10">
            Thank you for your purchase. Your order number is <strong className="text-cyan-400">#ORD-{orderNumber}</strong>
          </p>
          <p className="text-sm text-gray-500 mb-8 relative z-10">
            We've sent a confirmation email with your order details and tracking information.
          </p>
          
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl mb-8 text-left relative z-10">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-400 text-sm">Estimated Delivery</span>
              <span className="text-white font-bold text-sm">Jul 10 - Jul 12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Payment Method</span>
              <span className="text-white font-bold text-sm">Secure Checkout</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 relative z-10">
            <Button variant="gradient" size="large" fullWidth onClick={() => navigate('/products')} className="text-lg py-4">
              Continue Shopping
            </Button>
            <Button 
              variant="outline" 
              size="large" 
              fullWidth 
              onClick={handleDownloadReceipt} 
              disabled={isDownloading}
              className="border-white/10 hover:bg-white/5 text-gray-300"
            >
              {isDownloading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div> Generating PDF...
                </span>
              ) : 'Download Receipt'}
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Hidden Receipt Template for PDF Generation */}
      <div 
        ref={receiptRef} 
        style={{ display: 'none', width: '800px', backgroundColor: '#0f172a' }} 
        className="p-12 font-sans text-white border-8 border-cyan-500/20"
      >
        <div className="flex justify-between items-center mb-12 border-b border-white/20 pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-white flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-2xl">N</span>
              </div>
              Neo Wynexa
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Premium Tech & Electronics</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-cyan-400 uppercase tracking-widest">Official Receipt</h2>
            <p className="text-gray-400 mt-2 font-medium">Order: #ORD-{orderNumber}</p>
            <p className="text-gray-400">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex gap-8 mb-12">
          <div className="flex-1 bg-white/5 p-6 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-2 uppercase text-xs tracking-widest text-gray-400">Billed To</h3>
            <p className="font-semibold text-lg">Valued Customer</p>
            <p className="text-gray-400">123 Innovation Drive</p>
            <p className="text-gray-400">San Francisco, CA 94103</p>
          </div>
          <div className="flex-1 bg-cyan-500/10 p-6 rounded-2xl border border-cyan-500/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-2 uppercase text-xs tracking-widest">Payment Status</h3>
            <p className="text-2xl font-black text-white">PAID</p>
            <p className="text-gray-300 mt-1">Method: Secure Checkout</p>
            <p className="text-gray-300">Delivery: Jul 10 - Jul 12</p>
          </div>
        </div>

        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-white/20 text-gray-400 uppercase text-xs tracking-wider">
                <th className="py-4 px-2">Item Description</th>
                <th className="py-4 px-2 text-center">Qty</th>
                <th className="py-4 px-2 text-right">Price</th>
                <th className="py-4 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.items.map((item, idx) => (
                <tr key={idx} className="border-b border-white/10">
                  <td className="py-4 px-2">
                    <p className="font-bold text-white">{item.name}</p>
                    <p className="text-gray-400 text-sm">{item.brand}</p>
                  </td>
                  <td className="py-4 px-2 text-center text-white">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-gray-300">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-2 text-right font-bold text-white">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-16">
          <div className="w-80 space-y-4">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal:</span>
              <span className="text-white">${orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Tax (8%):</span>
              <span className="text-white">${orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping:</span>
              <span className="text-white">${orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/20 pt-4 mt-4">
              <span className="text-xl font-bold text-white">Total:</span>
              <span className="text-3xl font-black text-cyan-400">${orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="text-center border-t border-white/20 pt-8 text-gray-400">
          <p className="text-lg font-medium text-white mb-2">Thank you for shopping with Neo Wynexa!</p>
          <p>If you have any questions about this receipt, please contact support@neowynexa.com</p>
          <div className="mt-8 flex justify-center">
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
