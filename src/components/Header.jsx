import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onOpenSearch }) => {
  const { cartItemCount } = useShop();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Banner */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div 
            initial={{ height: 40, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-accent-blue to-accent-violet text-white text-xs font-medium py-2 px-8 flex justify-center items-center overflow-hidden"
          >
            <span className="flex items-center gap-2">
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold">NEW</span>
              Free express shipping on all orders over $150.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)]' : 'bg-transparent border-b border-white/10'}`}>
        <div className="max-w-[1440px] mx-auto py-4 px-8 flex items-center justify-between gap-12">
          <Link to="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <img src="/favicon.svg" alt="Neo Wynexa Logo" className="w-[60px] h-[60px] object-contain scale-110" />
            Neo Wynexa
          </Link>
          
          <div className="flex-1 max-w-[500px] relative hidden md:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <button 
              onClick={onOpenSearch}
              className="w-full py-2.5 px-4 pl-11 bg-white/5 border border-white/10 rounded-full font-sans text-sm text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-400/50 transition-all text-left flex justify-between items-center group" 
            >
              Search products...
              <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded text-[10px] font-sans">⌘</kbd>
                <kbd className="px-1.5 py-0.5 bg-black/40 border border-white/10 rounded text-[10px] font-sans">K</kbd>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-6 text-gray-300">
            <Link to="/admin" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 text-sm font-medium">
              Admin
            </Link>
            <div className="w-[1px] h-4 bg-white/20"></div>
            <Link to="/profile" className="hover:text-cyan-400 transition-colors relative group">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-0 right-0 w-2 h-2 bg-accent-red rounded-full ring-2 ring-background"></span>
            </Link>
            <Link to="/wishlist" className="hover:text-cyan-400 transition-colors">
              <span className="material-symbols-outlined text-[24px]">favorite_border</span>
            </Link>
            <Link to="/cart" className="hover:text-cyan-400 transition-colors relative flex items-center group">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
              </div>
              <AnimatePresence>
                {cartItemCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    key={cartItemCount}
                    className="absolute -top-1 -right-1 bg-accent-blue text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm ring-2 ring-white"
                  >
                    {cartItemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-3 ml-2 relative group">
                <Link to="/profile">
                  <div className="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center font-semibold text-sm hover:ring-4 hover:ring-cyan-500/30 transition-all cursor-pointer shadow-lg shadow-cyan-500/20 uppercase">
                    {user.name.charAt(0)}
                  </div>
                </Link>
                <div className="absolute right-0 top-10 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-2 w-48 shadow-xl flex flex-col">
                    <div className="px-3 py-2 border-b border-white/10 mb-2">
                      <p className="text-white font-medium text-sm truncate">{user.name}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="text-left px-3 py-2 text-sm text-accent-red hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="ml-2">
                <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-semibold transition-colors border border-white/20 shadow-sm">
                  Sign In
                </button>
              </Link>
            )}
          </div>
        </div>

      </header>
    </>
  );
};

export default Header;
