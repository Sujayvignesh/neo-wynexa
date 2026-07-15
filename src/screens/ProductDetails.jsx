import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, wishlist, toggleWishlist } = useShop();
  
  const product = products.find(p => p.id === parseInt(id));
  const [quantity, setQuantity] = React.useState(1);
  const isLiked = product && wishlist.some(item => item.id === product.id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 bg-transparent">
        <h2 className="text-2xl font-bold mb-4 text-white">Product not found</h2>
        <Button variant="outline" onClick={() => navigate('/products')} className="text-white border-white/30 hover:bg-white/10">Back to Products</Button>
      </div>
    );
  }

  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  const handleAddToCart = () => {
    for(let i=0; i<quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} x ${product.name} added to cart!`, {
      style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontSize: '14px' },
      iconTheme: { primary: '#10B981', secondary: '#fff' }
    });
  };

  return (
    <div className="bg-background min-h-screen pb-24">
      {/* Breadcrumbs */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 shadow-sm relative z-10">
        <div className="max-w-[1440px] mx-auto px-8 py-6 text-xs text-gray-400 font-medium tracking-wide flex items-center gap-2">
          <span className="cursor-pointer text-cyan-400 hover:bg-cyan-500/10 px-2 py-1 rounded transition-colors" onClick={() => navigate('/')}>Home</span> 
          <span className="text-gray-500 material-symbols-outlined text-sm">chevron_right</span>
          <span className="cursor-pointer text-cyan-400 hover:bg-cyan-500/10 px-2 py-1 rounded transition-colors" onClick={() => navigate('/products')}>Products</span> 
          <span className="text-gray-500 material-symbols-outlined text-sm">chevron_right</span>
          <span className="cursor-pointer text-cyan-400 hover:bg-cyan-500/10 px-2 py-1 rounded transition-colors" onClick={() => navigate('/products')}>{product.category}</span> 
          <span className="text-gray-500 material-symbols-outlined text-sm">chevron_right</span>
          <span className="font-semibold text-white bg-white/10 px-2 py-1 rounded">{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 pt-12 flex flex-col lg:flex-row gap-12 xl:gap-20 items-start">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 w-full lg:max-w-[600px] flex flex-col gap-6"
        >
          <div className="bg-white/5 w-full pt-[100%] relative shadow-soft rounded-[32px] border border-white/10 overflow-hidden group">
            <img src={product.image} alt={product.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
            {product.discount > 0 && (
              <div className="absolute top-6 left-6 bg-accent-red text-white py-1.5 px-3 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                -{product.discount}% OFF
              </div>
            )}
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map(thumb => (
              <div key={thumb} className={`w-24 h-24 shrink-0 bg-white/5 backdrop-blur-md shadow-sm rounded-2xl border-2 cursor-pointer transition-all overflow-hidden ${thumb === 1 ? 'border-cyan-400' : 'border-transparent hover:border-white/30'}`}>
                <img src={product.image} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 w-full"
        >
          <div className="text-sm text-cyan-400 font-bold uppercase tracking-widest mb-3 bg-cyan-500/10 inline-block px-3 py-1 rounded-full border border-cyan-500/20">
            {product.brand}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">{product.name}</h1>
          
          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-1 rounded-lg border border-yellow-500/30">
              <span className="material-symbols-outlined text-yellow-400 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="font-bold text-yellow-100 text-sm">{product.rating}</span>
            </div>
            <span className="text-sm text-gray-400 font-medium underline cursor-pointer hover:text-white transition-colors">Read {product.reviews} reviews</span>
          </div>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-extrabold text-white">
              ${discountedPrice.toFixed(2)}
            </span>
            {product.discount > 0 && (
              <span className="text-xl line-through text-gray-500 font-medium mb-1">
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-gray-300 text-base leading-relaxed mb-10 pb-10 border-b border-white/10">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <div className="flex items-center border border-white/20 h-14 bg-white/5 backdrop-blur-md rounded-2xl shadow-sm overflow-hidden shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-14 h-full bg-transparent text-gray-300 hover:text-white hover:bg-white/10 font-medium text-xl transition-colors outline-none"
              >-</button>
              <span className="w-14 flex justify-center font-bold text-lg text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-14 h-full bg-transparent text-gray-300 hover:text-white hover:bg-white/10 font-medium text-xl transition-colors outline-none"
              >+</button>
            </div>
            
            <Button 
              variant="gradient" 
              size="large" 
              icon="add_shopping_cart" 
              onClick={handleAddToCart}
              className="flex-1 h-14 text-lg w-full"
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            <button 
              className={`w-14 h-14 border rounded-2xl flex items-center justify-center shadow-sm transition-colors cursor-pointer shrink-0 ${isLiked ? 'bg-accent-red/20 border-accent-red/50 text-accent-red hover:bg-accent-red/30' : 'bg-white/5 border-white/20 text-gray-300 hover:bg-white/20 hover:text-white hover:border-white/40'}`}
              onClick={() => {
                toggleWishlist(product);
                toast(isLiked ? "Removed from Wishlist" : "Added to Wishlist", { icon: isLiked ? '💔' : '❤️' });
              }}
            >
              <span className="material-symbols-outlined text-[24px]" style={isLiked ? {fontVariationSettings: "'FILL' 1"} : {}}>
                {isLiked ? 'favorite' : 'favorite_border'}
              </span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 text-sm text-gray-200 font-medium">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-cyan-400 bg-white/10 p-2 rounded-xl shadow-sm border border-cyan-400/20">local_shipping</span>
              <span>Free delivery over $50</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-cyan-400 bg-white/10 p-2 rounded-xl shadow-sm border border-cyan-400/20">verified</span>
              <span>1 Year warranty included</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-cyan-400 bg-white/10 p-2 rounded-xl shadow-sm border border-cyan-400/20">assignment_return</span>
              <span>30-Day returns</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-cyan-400 bg-white/10 p-2 rounded-xl shadow-sm border border-cyan-400/20">security</span>
              <span>Secure checkout</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
