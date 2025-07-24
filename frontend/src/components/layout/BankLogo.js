import React, { useState, useEffect } from 'react';

const BankLogo = () => {
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  const logoVariations = [
    {
      icon: 'fas fa-university',
      color: '#ff6b35',
      bgColor: 'linear-gradient(135deg, #ff6b35, #f7931e)',
      vision: 'Your Trusted Digital Banking Partner',
      subtitle: 'Banking Made Simple'
    },
    {
      icon: 'fas fa-shield-alt',
      color: '#4caf50',
      bgColor: 'linear-gradient(135deg, #4caf50, #2e7d32)',
      vision: 'Secure • Reliable • Innovative',
      subtitle: 'Protecting Your Future'
    },
    {
      icon: 'fas fa-chart-line',
      color: '#3498db',
      bgColor: 'linear-gradient(135deg, #3498db, #2980b9)',
      vision: 'Growing Together Since 2024',
      subtitle: 'Your Financial Growth Partner'
    },
    {
      icon: 'fas fa-handshake',
      color: '#9b59b6',
      bgColor: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
      vision: 'Building Relationships That Last',
      subtitle: 'Trust • Integrity • Excellence'
    },
    {
      icon: 'fas fa-globe',
      color: '#e67e22',
      bgColor: 'linear-gradient(135deg, #e67e22, #d35400)',
      vision: 'Banking Without Boundaries',
      subtitle: 'Global Reach, Personal Touch'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => 
        (prevIndex + 1) % logoVariations.length
      );
    }, 180000); // Change every 3 minutes (180,000 ms)

    return () => clearInterval(interval);
  }, [logoVariations.length]);

  const currentLogo = logoVariations[currentLogoIndex];

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      left: '2rem',
      zIndex: 1000,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'fadeInSlide 0.8s ease-out'
    }}>
      <div style={{
        background: currentLogo.bgColor,
        padding: '1.5rem',
        borderRadius: '20px',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '280px',
        transition: 'all 0.8s ease-in-out',
        transform: 'translateY(0)',
        opacity: 1
      }}>
        {/* Logo Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '1rem',
          color: 'white'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '0.75rem',
            borderRadius: '12px',
            marginRight: '1rem',
            transition: 'transform 0.3s ease'
          }}>
            <i className={currentLogo.icon} style={{
              fontSize: '1.5rem',
              color: 'white'
            }}></i>
          </div>
          <div>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '700',
              fontFamily: "'Playfair Display', serif",
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Savoon Bank
            </h3>
            <p style={{
              margin: 0,
              fontSize: '0.8rem',
              opacity: 0.9,
              fontWeight: '400'
            }}>
              {currentLogo.subtitle}
            </p>
          </div>
        </div>

        {/* Vision Statement */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '1rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          <p style={{
            margin: 0,
            color: 'white',
            fontSize: '0.9rem',
            fontWeight: '500',
            textAlign: 'center',
            lineHeight: '1.4',
            fontFamily: "'Inter', sans-serif",
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
          }}>
            {currentLogo.vision}
          </p>
        </div>

        {/* Progress Indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '1rem',
          gap: '0.5rem'
        }}>
          {logoVariations.map((_, index) => (
            <div
              key={index}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: index === currentLogoIndex 
                  ? 'rgba(255, 255, 255, 0.9)' 
                  : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease',
                transform: index === currentLogoIndex ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeInSlide {
          0% {
            opacity: 0;
            transform: translateY(20px) translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) translateX(0);
          }
        }
        
        @media (max-width: 768px) {
          div[style*="position: fixed"] {
            position: relative !important;
            bottom: auto !important;
            left: auto !important;
            margin: 2rem auto !important;
            max-width: 100% !important;
          }
        }
        
        @media (max-width: 480px) {
          div[style*="max-width: 280px"] {
            max-width: 100% !important;
            margin: 0 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BankLogo;
