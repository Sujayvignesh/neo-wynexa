import React from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const isProductPage = location.pathname.match(/^\/products\/\d+$/);

  const footerStyle = {
    backgroundColor: 'var(--md-sys-color-on-surface)',
    color: 'var(--md-sys-color-surface-variant)',
    padding: 'var(--spacing-6) 0',
    marginTop: 'auto'
  };

  const containerStyle = {
    maxWidth: '1440px',
    margin: '0 auto',
    padding: '0 var(--spacing-3)',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 'var(--spacing-4)'
  };

  const titleStyle = {
    color: '#ffffff',
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: 'var(--spacing-2)'
  };

  const listStyle = {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  };

  const linkStyle = {
    color: '#d1d5db',
    fontSize: '14px',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  };

  return (
    <footer style={footerStyle}>
      {!isProductPage && (
        <div style={containerStyle}>
          <div>
            <h3 style={titleStyle}>Neo Wynexa</h3>
          <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6' }}>
            Your premium destination for modern tech, gadgets, and accessories. Experience shopping reimagined.
          </p>
        </div>
        
        <div>
          <h3 style={titleStyle}>Quick Links</h3>
          <ul style={listStyle}>
            <li><a href="#" style={linkStyle}>About Us</a></li>
            <li><a href="#" style={linkStyle}>Customer Support</a></li>
            <li><a href="#" style={linkStyle}>FAQ</a></li>
            <li><a href="#" style={linkStyle}>Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style={titleStyle}>Legal</h3>
          <ul style={listStyle}>
            <li><a href="#" style={linkStyle}>Privacy Policy</a></li>
            <li><a href="#" style={linkStyle}>Terms & Conditions</a></li>
            <li><a href="#" style={linkStyle}>Return Policy</a></li>
          </ul>
        </div>
        
        <div>
          <h3 style={titleStyle}>Newsletter</h3>
          <p style={{ color: '#e5e7eb', fontSize: '14px', marginBottom: '16px' }}>
            Subscribe to get special offers, free giveaways, and deals.
          </p>
          <div style={{ display: 'flex' }}>
            <input 
              type="email" 
              placeholder="Your email address" 
              style={{
                padding: '10px 16px',
                borderRadius: '8px 0 0 8px',
                border: 'none',
                outline: 'none',
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff'
              }}
            />
            <button style={{
              padding: '10px 16px',
              backgroundColor: '#0ea5e9',
              color: 'white',
              border: 'none',
              borderRadius: '0 8px 8px 0',
              cursor: 'pointer',
              fontWeight: '500'
            }}>
              Join
            </button>
          </div>
        </div>
        </div>
      )}
      
      <div style={{ 
        maxWidth: '1440px', 
        margin: isProductPage ? '0 auto' : 'var(--spacing-4) auto 0', 
        padding: 'var(--spacing-3) var(--spacing-3) 0', 
        borderTop: isProductPage ? 'none' : '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#d1d5db'
      }}>
        <p>&copy; 2026 Neo Wynexa. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span className="material-symbols-outlined" style={{ cursor: 'pointer' }}>language</span>
          <span>English (US)</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
