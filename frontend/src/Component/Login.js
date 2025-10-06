import React, { useState } from 'react';
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #8c9ad9ff 0%, #bb80f6ff 100%)',
    fontFamily: "'Inter', sans-serif",
    padding: '20px',
  },
  loginBox: {
    width: '400px',
    padding: '40px',
    backgroundColor: 'white',
    borderRadius: '20px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    transform: 'translateY(30px)',
    opacity: 0,
    animation: 'fadeInUp 0.6s ease forwards',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    color: '#333',
    fontWeight: '700',
    fontSize: '2rem',
    letterSpacing: '0.05em',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '20px',
  },
  icon: {
    position: 'absolute',
    left: '15px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '18px',
    color: '#9CA3AF',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 45px',
    border: '1.8px solid #ddd',
    borderRadius: '12px',
    boxSizing: 'border-box',
    fontSize: '16px',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    outline: 'none',
    color: '#4A5568',
  },
  inputFocus: {
    borderColor: '#667eea',
    boxShadow: '0 0 8px rgba(102, 126, 234, 0.6)',
  },
  button: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '18px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, transform 0.15s ease',
    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.4)',
  },
  buttonHover: {
    backgroundColor: '#5563c1',
    transform: 'translateY(-3px)',
  },
  switchText: {
    textAlign: 'center',
    marginTop: '25px',
    fontSize: '14px',
    color: '#718096',
  },
  switchLink: {
    color: '#667eea',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: '700',
    marginLeft: '5px',
  },
  error: {
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: '15px',
    fontSize: '14px',
    fontWeight: '600',
  },
  // Animations added via style tag below
};

const Login = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Track focus to style inputs
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Email and password cannot be empty.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userEmail', data.user.email);
        localStorage.setItem('userName', data.user.name);

        onLoginSuccess();
      } else {
        setError(data.msg || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div style={styles.container}>
        <div style={styles.loginBox}>
          <h2 style={styles.heading}>Login</h2>
          {error && <p style={styles.error}>{error}</p>}
          <form style={styles.form} onSubmit={handleSubmit} noValidate>
            <div style={styles.inputWrapper}>
              <span style={styles.icon}>📧</span>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                style={{
                  ...styles.input,
                  ...(emailFocused ? styles.inputFocus : {}),
                }}
                required
                disabled={loading}
              />
            </div>

            <div style={styles.inputWrapper}>
              <span style={styles.icon}>🔒</span>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                style={{
                  ...styles.input,
                  ...(passwordFocused ? styles.inputFocus : {}),
                }}
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.button, ...(isHovered ? styles.buttonHover : null) }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              disabled={loading}
            >
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>
          <p style={styles.switchText}>
            Don't have an account?
            <span style={styles.switchLink} onClick={onSwitchToRegister}>
              Register here
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;