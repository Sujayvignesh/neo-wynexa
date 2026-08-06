import React, { memo } from 'react';
import { useShop } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = memo(({ product }) => {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const isLiked = wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      style: { borderRadius: '12px', background: '#0F172A', color: '#fff', fontSize: '14px' },
      iconTheme: { primary: '#10B981', secondary: '#fff' }
    });
  };

  const discountedPrice = product.discount > 0 
    ? product.price * (1 - product.discount / 100) 
    : product.price;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group flex flex-col h-full bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 overflow-hidden relative"
    >
      <Link to={`/products/${product.id}`} className="no-underline text-inherit flex flex-col h-full">
        <div className="relative w-full pt-[100%] bg-white/5 overflow-hidden">
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            src={product.image} 
            alt={product.name} 
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.discount > 0 && (
              <div className="bg-accent-red text-white py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg backdrop-blur-md">
                -{product.discount}%
              </div>
            )}
            {product.rating >= 4.8 && (
              <div className="bg-white/20 text-white border border-white/30 backdrop-blur-md py-1 px-2.5 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg">
                Top Rated
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
            <button 
              className={`w-9 h-9 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-colors cursor-pointer ${isLiked ? 'bg-accent-red/20 border-accent-red/50 text-accent-red hover:bg-accent-red/30' : 'bg-black/40 text-white border-white/10 hover:bg-white/20 hover:text-accent-red'}`}
              onClick={(e) => { 
                e.preventDefault(); 
                toggleWishlist(product);
                toast(isLiked ? "Removed from Wishlist" : "Added to Wishlist", { icon: isLiked ? '💔' : '❤️' }); 
              }}
            >
              <span className="material-symbols-outlined text-[20px]" style={isLiked ? {fontVariationSettings: "'FILL' 1"} : {}}>
                {isLiked ? 'favorite' : 'favorite_border'}
              </span>
            </button>
            <button 
              className="w-9 h-9 bg-black/40 text-white backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 hover:text-cyan-300 transition-colors cursor-pointer"
              onClick={(e) => { e.preventDefault(); }}
            >
              <span className="material-symbols-outlined text-[20px]">visibility</span>
            </button>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col bg-transparent">
          <div className="flex justify-between items-start mb-2">
            <div className="text-xs text-cyan-400 font-semibold tracking-wide uppercase">
              {product.brand}
            </div>
            <div className="flex items-center gap-1 bg-black/30 border border-white/10 px-1.5 py-0.5 rounded-md backdrop-blur-sm">
              <span className="material-symbols-outlined text-yellow-400 text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span className="text-[11px] font-bold text-white">{product.rating}</span>
            </div>
          </div>
          
          <h3 className="text-base font-medium text-white leading-tight mb-3 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-white/10">
            <div className="flex flex-col">
              {product.discount > 0 && (
                <span className="text-xs line-through text-gray-500 font-medium">
                  ₹{product.price.toFixed(2)}
                </span>
              )}
              <span className="text-lg font-bold text-white tracking-wide">
                ₹{discountedPrice.toFixed(2)}
              </span>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="w-10 h-10 bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 backdrop-blur-md rounded-full flex items-center justify-center cursor-pointer hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] hover:-translate-y-0.5"
            >
              <span className="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;
