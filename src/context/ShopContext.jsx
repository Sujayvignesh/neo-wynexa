import React, { createContext, useContext, useState, useEffect } from 'react';
import { dummyProducts } from '../data';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const products = dummyProducts;
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load state from local storage
  useEffect(() => {
    const savedCart = localStorage.getItem('Wynexa_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }
    
    const savedWishlist = localStorage.getItem('Wynexa_wishlist');
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) {}
    }
  }, []);

  // Save cart to local storage
  useEffect(() => {
    localStorage.setItem('Wynexa_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist to local storage
  useEffect(() => {
    localStorage.setItem('Wynexa_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const isLiked = prev.some(item => item.id === product.id);
      if (isLiked) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity } : item
    ));
  };

  const cartTotal = cart.reduce((total, item) => {
    const price = item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price;
    return total + price * item.quantity;
  }, 0);

  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <ShopContext.Provider value={{
      products,
      cart,
      wishlist,
      addToCart,
      removeFromCart,
      clearCart,
      updateQuantity,
      toggleWishlist,
      cartTotal,
      cartItemCount
    }}>
      {children}
    </ShopContext.Provider>
  );
};
