import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🍽️ EA Foods
        </Link>
        
        <nav style={styles.nav}>
          <Link to="/" style={styles.navLink}>Products</Link>
          {isAuthenticated && (
            <>
              <Link to="/orders" style={styles.navLink}>My Orders</Link>
              <Link to="/cart" style={styles.navLink}>
                Cart {getTotalItems() > 0 && (
                  <span style={styles.cartBadge}>{getTotalItems()}</span>
                )}
              </Link>
            </>
          )}
        </nav>

        <div style={styles.userSection}>
          {isAuthenticated ? (
            <div style={styles.userInfo}>
              <span style={styles.userName}>
                {user.name} ({user.role})
              </span>
              <button onClick={logout} style={styles.logoutBtn}>
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    transition: 'background-color 0.3s',
    position: 'relative',
  },
  cartBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '50%',
    padding: '0.2rem 0.5rem',
    fontSize: '0.8rem',
    marginLeft: '0.5rem',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '0.9rem',
  },
  loginBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    transition: 'background-color 0.3s',
  },
  logoutBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
};

export default Header;
