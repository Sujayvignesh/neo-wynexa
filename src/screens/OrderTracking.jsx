import React from 'react';

const OrderTracking = () => {
  return (
    <div className="container" style={{ padding: 'var(--spacing-6) var(--spacing-3)' }}>
      <h2>Track Your Order</h2>
      <div style={{ marginTop: '24px', backgroundColor: 'var(--md-sys-color-surface)', padding: 'var(--spacing-4)', borderRadius: 'var(--md-sys-shape-corner-medium)' }}>
        <p><strong>Status:</strong> In Transit</p>
        <p><strong>Estimated Delivery:</strong> Tomorrow by 8 PM</p>
      </div>
    </div>
  );
};

export default OrderTracking;
