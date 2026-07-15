import React from 'react';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlist } = useShop();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1440px] mx-auto px-8 py-12 pt-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Your Wishlist</h1>
          <p className="text-gray-400 text-lg">
            {wishlist.length === 0 ? "You haven't saved any items yet." : `You have ${wishlist.length} saved item${wishlist.length === 1 ? '' : 's'}.`}
          </p>
        </div>

        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-16 text-center shadow-lg"
          >
            <span className="material-symbols-outlined text-[80px] text-gray-500 mb-6">heart_broken</span>
            <h2 className="text-2xl font-bold text-white mb-4">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Explore our collections and tap the heart icon to save items you love. They'll be waiting for you here.
            </p>
            <Button variant="primary" onClick={() => navigate('/products')} size="large">
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
