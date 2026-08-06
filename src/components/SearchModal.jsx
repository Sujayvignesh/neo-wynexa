import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const { products } = useShop();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery(''); // Reset query on open
    }
  }, [isOpen]);

  // Filter products based on query
  const filteredProducts = query.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        p.brand.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5); // Limit to 5 results for clean UI

  const handleSelect = (id) => {
    onClose();
    navigate(`/products/${id}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 sm:pt-32 px-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Search Input Area */}
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <span className="material-symbols-outlined text-gray-400 mr-3 text-2xl">search</span>
              <input 
                ref={inputRef}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories, or brands..."
                className="flex-1 bg-transparent border-none outline-none text-white text-lg placeholder-gray-500"
              />
              <button 
                onClick={onClose}
                className="ml-3 px-2 py-1 bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-bold rounded-md transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              {query.trim() === '' && (
                <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                  <span className="material-symbols-outlined text-5xl mb-4 opacity-50">shopping_bag</span>
                  <p>Start typing to search for products</p>
                </div>
              )}

              {query.trim() !== '' && filteredProducts.length === 0 && (
                <div className="p-12 text-center text-gray-500">
                  <p>No results found for "<span className="text-white">{query}</span>"</p>
                </div>
              )}

              {filteredProducts.length > 0 && (
                <div className="py-2">
                  <div className="px-4 py-2 text-xs font-bold tracking-wider text-gray-500 uppercase">
                    Products
                  </div>
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id}
                      onClick={() => handleSelect(product.id)}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors group"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center p-1 relative border border-white/5">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain mix-blend-screen" />
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                          {product.name}
                        </div>
                        <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mt-0.5">
                          {product.category}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-bold">
                          ₹{(product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price).toFixed(2)}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-gray-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 ml-2">
                        arrow_forward
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-black/50 px-4 py-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/5 shadow-sm text-gray-300">↑</span>
                  <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/5 shadow-sm text-gray-300">↓</span>
                  <span>to navigate</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 bg-white/10 rounded border border-white/5 shadow-sm text-gray-300">↵</span>
                  <span>to select</span>
                </div>
              </div>
              <div className="text-cyan-500 font-bold tracking-widest uppercase text-[10px]">Wynexa Search</div>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
