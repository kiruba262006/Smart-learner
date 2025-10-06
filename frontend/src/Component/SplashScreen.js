import React, { useEffect } from 'react';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #1a202c, #2d3748, #4a5568, #1a202c)',
    backgroundSize: '400% 400%',
    animation: 'gradientBG 15s ease infinite',
    color: '#edf2f7',
    fontFamily: "'Inter', sans-serif",
    fontWeight: '900',
    letterSpacing: '0.05em',
    userSelect: 'none',
    overflow: 'hidden',
  },
  logoContainer: {
    backgroundColor: 'rgba(66, 153, 225, 0.15)',
    borderRadius: '20px',
    padding: '40px 60px',
    boxShadow: '0 8px 30px rgba(66, 153, 225, 0.3)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transformOrigin: 'center',
    animation: 'zoomIn 2s ease forwards',
  },
  logo: {
    fontSize: '5em',
    marginBottom: '15px',
    color: '#63b3ed',
    textShadow: '0 3px 12px rgba(66, 153, 225, 0.7)',
  },
  subtitle: {
    fontSize: '1.2em',
    color: '#a0aec0',
    fontWeight: '600',
    marginBottom: '30px',
    fontStyle: 'italic',
  },
  loadingText: (isVisible) => ({
    fontSize: '1em',
    color: '#718096',
    fontWeight: '600',
    letterSpacing: '0.15em',
    opacity: isVisible ? 1 : 0.3,
    transition: 'opacity 0.8s ease-in-out',
  }),
  
  // Keyframes can't be inside JS object for inline styles,
  // so they'll be injected via <style> tag below.
};

const SplashScreen = ({ onFinish }) => {
  const [visible, setVisible] = React.useState(true);

  useEffect(() => {
    const blinkInterval = setInterval(() => setVisible(v => !v), 800);
    const timer = setTimeout(() => onFinish(), 5000);

    return () => {
      clearInterval(blinkInterval);
      clearTimeout(timer);
    };
  }, [onFinish]);

  return (
    <>
      {/* Inject keyframe animations */}
      <style>{`
        @keyframes gradientBG {
          0% {background-position: 0% 50%;}
          50% {background-position: 100% 50%;}
          100% {background-position: 0% 50%;}
        }
        @keyframes zoomIn {
          0% { transform: scale(0.7); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.logoContainer}>
          <div style={styles.logo}>🚀</div>
          <div style={{...styles.logo, fontSize: '2.5em', marginBottom: '10px', color: '#edf2f7', textShadow: 'none'}}>
            My Page
          </div>
          <div style={styles.subtitle}>Launching Your Experience</div>
          <p style={styles.loadingText(visible)}>Loading...</p>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;