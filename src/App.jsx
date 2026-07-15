import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ShopProvider } from './context/ShopContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchModal from './components/SearchModal';
import PageTransition from './components/PageTransition';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import DynamicBackground from './components/DynamicBackground';

// Lazy loaded Screen Imports
const Home = lazy(() => import('./screens/Home'));
const Products = lazy(() => import('./screens/Products'));
const Cart = lazy(() => import('./screens/Cart'));
const Checkout = lazy(() => import('./screens/Checkout'));
const OrderSuccess = lazy(() => import('./screens/OrderSuccess'));
const ProductDetails = lazy(() => import('./screens/ProductDetails'));
const Login = lazy(() => import('./screens/Login'));
const Register = lazy(() => import('./screens/Register'));
const Profile = lazy(() => import('./screens/Profile'));
const Wishlist = lazy(() => import('./screens/Wishlist'));
const OrderTracking = lazy(() => import('./screens/OrderTracking'));
const AdminDashboard = lazy(() => import('./screens/AdminDashboard'));

const AppLayout = ({ children, onOpenSearch }) => (
  <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
    <DynamicBackground />
    <div className="relative z-10 flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <Header onOpenSearch={onOpenSearch} />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>
      <Footer />
    </div>
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/products" element={<PageTransition><Products /></PageTransition>} />
        <Route path="/products/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/track/:id" element={<PageTransition><OrderTracking /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const MainApp = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={
          <AppLayout onOpenSearch={() => setIsSearchOpen(true)}>
            <Suspense fallback={
              <div className="flex-1 flex items-center justify-center min-h-[50vh]">
                <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              </div>
            }>
              <AnimatedRoutes />
            </Suspense>
          </AppLayout>
         } />
      </Routes>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <ShopProvider>
        <Router>
          <MainApp />
        </Router>
      </ShopProvider>
    </AuthProvider>
  );
}

export default App;
