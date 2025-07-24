import React from 'react';

const Footer = () => {
  return (
    <footer className='footer' style={{
      background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
      color: 'white',
      textAlign: 'center',
      padding: '2rem',
      marginTop: 'auto',
      borderRadius: 'var(--border-radius) var(--border-radius) 0 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '1rem' }}>
          <i className="fas fa-university" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
          <h3 style={{ margin: '0.5rem 0', fontFamily: "'Playfair Display', serif" }}>Savoon Bank</h3>
          <p style={{ opacity: 0.9, fontSize: '0.9rem' }}>Your Trusted Digital Banking Partner</p>
        </div>
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.2)', 
          paddingTop: '1rem',
          fontSize: '0.9rem',
          opacity: 0.8
        }}>
          <p>&copy; {new Date().getFullYear()} Savoon Bank. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem' }}>Digital Banking Made Simple</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
