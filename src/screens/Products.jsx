import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const { products } = useShop();
  const location = useLocation();
  
  // Dynamically extract categories and brands from our product data
  const categories = ['All Collections', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = Array.from(new Set(products.map(p => p.brand)));

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(location.state?.category || 'All Collections');

  React.useEffect(() => {
    if (location.state?.category) {
      setSelectedCategory(location.state.category);
    }
  }, [location.state?.category]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setSelectedCategory('All Collections');
  };

  // Filter Logic
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All Collections' || product.category === selectedCategory;
    const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    return categoryMatch && brandMatch;
  });

  return (
    <div className="bg-transparent min-h-screen pb-20">
      
      {/* Breadcrumbs & Title */}
      <div className="bg-white/5 backdrop-blur-xl border-b border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] relative z-10">
        <div className="max-w-[1440px] mx-auto px-8 py-10">
          <div className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-6 flex items-center gap-2">
            <Link to="/" className="text-cyan-400 hover:bg-cyan-900/30 px-2 py-1 rounded transition-colors">Home</Link>
            <span className="text-gray-500 material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-white bg-white/10 px-2 py-1 rounded border border-white/10">All Collections</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
            Premium Collections
          </h1>
          <p className="text-gray-300 text-base max-w-xl leading-relaxed">
            Discover our premium selection of state-of-the-art products engineered for excellence. Explore the latest in technology and lifestyle.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-8 py-10 flex flex-col md:flex-row gap-10 items-start">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-[260px] shrink-0 sticky top-24">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white tracking-wide">Filters</h2>
            <button 
              onClick={handleReset} 
              className="bg-white/10 border border-white/20 text-xs font-semibold text-gray-300 flex items-center gap-1 cursor-pointer hover:bg-white/20 hover:text-white transition-colors py-1.5 px-3 rounded-full backdrop-blur-md"
            >
              Reset All
            </button>
          </div>

          <div className="flex flex-col gap-6">
            {/* Categories */}
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Categories</h3>
              <ul className="list-none flex flex-col gap-1">
                {categories.map((cat) => (
                  <li key={cat}>
                    <button 
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left py-2 px-3 border-none text-[13px] font-medium rounded-xl cursor-pointer transition-all ${
                        selectedCategory === cat 
                          ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30' 
                          : 'bg-transparent text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brands */}
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Brands</h3>
              <ul className="list-none flex flex-col gap-3">
                {brands.map(brand => (
                  <li key={brand}>
                    <label className="flex items-center gap-3 cursor-pointer text-[13px] font-medium text-gray-300 hover:text-white transition-colors group">
                      <input 
                        type="checkbox" 
                        className="elegant-checkbox group-hover:border-cyan-400 shrink-0 bg-black/30 border-white/20 checked:bg-cyan-500 checked:border-cyan-500"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                      />
                      <span className="line-clamp-1">{brand}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price Range */}
            <div className="bg-white/5 backdrop-blur-xl p-5 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10">
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Price Range</h3>
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="text" placeholder="Min" className="w-full py-2.5 pl-7 pr-3 border border-white/10 rounded-xl bg-black/30 text-white text-sm outline-none focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-gray-600" />
                </div>
                <span className="text-gray-500">-</span>
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="text" placeholder="Max" className="w-full py-2.5 pl-7 pr-3 border border-white/10 rounded-xl bg-black/30 text-white text-sm outline-none focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all placeholder:text-gray-600" />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Grid */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-white/5 backdrop-blur-xl p-4 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border border-white/10 mb-8 gap-4">
            <div className="text-sm text-gray-400 font-medium">
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> results
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Sort By</span>
                <select className="py-2 pr-8 pl-4 border border-white/10 rounded-xl appearance-none bg-black/30 text-sm font-semibold text-white outline-none focus:bg-black/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer">
                  <option>Featured Picks</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Customer Ratings</option>
                </select>
              </div>
              <div className="hidden sm:flex gap-1 bg-black/30 border border-white/10 p-1 rounded-xl">
                <button className="w-8 h-8 bg-white/10 text-white border-none rounded-lg shadow-sm flex items-center justify-center cursor-pointer">
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button className="w-8 h-8 bg-transparent text-gray-500 border-none rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl p-12 text-center rounded-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
              <span className="material-symbols-outlined text-[48px] text-gray-600 mb-4">search_off</span>
              <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
              <p className="text-gray-400 text-sm">Try adjusting your filters or resetting them to see more products.</p>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Products;
