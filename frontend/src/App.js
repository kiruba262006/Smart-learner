import React, { useState, useEffect } from 'react';
import Register from './Component/Register.js';
import Login from './Component/Login.js';
import SplashScreen from './Component/SplashScreen.js';
import FeedsScreen from './Component/FeedsScreen.js';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showLogin, setShowLogin] = useState(false); // 🔄 Changed from true to false
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  const toggleLoginRegister = () => {
    setShowLogin(!showLogin);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setShowLogin(true);
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={handleSplashFinish} />
      ) : (
        <div>
          {isLoggedIn ? (
            <FeedsScreen onLogout={handleLogout} />
          ) : (
            showLogin ? (
              <Login onSwitchToRegister={toggleLoginRegister} onLoginSuccess={handleLoginSuccess} />
            ) : (
              <Register onSwitchToLogin={toggleLoginRegister} />
            )
          )}
        </div>
      )}
    </>
  );
}

export default App;