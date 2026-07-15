import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4);

  const phrases = ["Future of Tech.", "Next-Gen Audio.", "Premium Gadgets.", "Smart Living."];
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      
      {/* Modern Hero Banner */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-32 md:pb-40 rounded-b-[40px] shadow-soft-lg mx-2 mt-2 border-t border-x border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        
        <div className="max-w-[1440px] mx-auto px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-[650px]"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold text-white mb-6">
              <span className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></span>
              New Arrivals 2026
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-6 min-h-[120px] md:min-h-[160px]">
              Experience the <br/>
              <AnimatePresence mode="wait">
                <motion.span
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-accent-violet"
                >
                  {phrases[phraseIndex]}
                </motion.span>
              </AnimatePresence>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-10 font-medium leading-relaxed max-w-[500px]">
              Discover our premium selection of state-of-the-art electronics engineered for excellence.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/products">
                <Button variant="gradient" size="large" icon="arrow_forward">Shop Collection</Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" size="large" className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 rounded-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:flex relative justify-center items-center w-[500px] h-[500px]"
          >
             {/* Glowing aura behind product */}
             <div className="absolute inset-0 bg-cyan-400/20 blur-[100px] rounded-full mix-blend-screen animate-pulse"></div>
             
             <motion.img 
               animate={{ y: [-15, 15, -15] }}
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
               src="/hero-product.png" 
               alt="Wynexa Premium Tech" 
               className="w-[500px] h-[500px] object-cover mix-blend-screen relative z-10"
               style={{ 
                 filter: 'contrast(1.4) brightness(0.8) drop-shadow(0px 20px 30px rgba(0,0,0,0.8))',
                 WebkitMaskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 60%, transparent 100%)',
                 maskImage: 'radial-gradient(ellipse 65% 55% at 50% 50%, black 60%, transparent 100%)'
               }}
             />
          </motion.div>
        </div>
      </section>


    </div>
  );
};

export default Home;
