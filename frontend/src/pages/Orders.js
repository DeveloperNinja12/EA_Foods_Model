import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [isAuthenticated, navigate, user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await ordersAPI.getOrdersByUserId(user.id);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error loading orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await ordersAPI.cancelOrder(orderId);
      if (response.data.success) {
        loadOrders(); // Reload orders
        alert('Order cancelled successfully');
      } else {
        alert('Failed to cancel order');
      }
    } catch (err) {
      alert('Failed to cancel order');
      console.error('Error cancelling order:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      preparing: '#9b59b6',
      out_for_delivery: '#e67e22',
      delivered: '#27ae60',
      cancelled: '#e74c3c',
    };
    return colors[status] || '#666';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}>🔄</div>
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>My Orders</h1>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div style={styles.noOrders}>
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <button 
            onClick={() => navigate('/')}
            style={styles.shopButton}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} style={styles.orderCard}>
              <div style={styles.orderHeader}>
                <div style={styles.orderInfo}>
                  <h3 style={styles.orderId}>Order #{order.id}</h3>
                  <p style={styles.orderDate}>
                    Placed on {formatDate(order.created_at)}
                  </p>
                </div>
                <div style={styles.orderStatus}>
                  <span 
                    style={{
                      ...styles.statusBadge,
                      backgroundColor: getStatusColor(order.status)
                    }}
                  >
                    {order.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>

              <div style={styles.orderDetails}>
                <div style={styles.deliveryInfo}>
                  <p><strong>Delivery Date:</strong> {formatDate(order.delivery_date)}</p>
                  <p><strong>Delivery Slot:</strong> {order.delivery_slot}</p>
                </div>

                <div style={styles.itemsList}>
                  <h4>Items:</h4>
                  {order.items.map((item, index) => (
                    <div key={index} style={styles.orderItem}>
                      <span>{item.product_name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.unit_price ? item.unit_price.toFixed(2) : '0.00'}</span>
                    </div>
                  ))}
                </div>

                <div style={styles.orderTotal}>
                  <strong>Total: ${order.total_amount ? order.total_amount.toFixed(2) : '0.00'}</strong>
                </div>
              </div>

              {order.status === 'pending' && (
                <div style={styles.orderActions}>
                  <button
                    onClick={() => handleCancelOrder(order.id)}
                    style={styles.cancelButton}
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  title: {
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
    fontSize: '1.2rem',
  },
  spinner: {
    fontSize: '2rem',
    marginBottom: '1rem',
    animation: 'spin 1s linear infinite',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem',
    textAlign: 'center',
  },
  noOrders: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  shopButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  ordersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  orderCard: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1.5rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #eee',
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
  },
  orderDate: {
    margin: 0,
    color: '#666',
    fontSize: '0.9rem',
  },
  orderStatus: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  orderDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '2rem',
    marginBottom: '1rem',
  },
  deliveryInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  orderItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f0f0f0',
  },
  orderTotal: {
    gridColumn: '1 / -1',
    textAlign: 'right',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
    fontSize: '1.1rem',
    color: '#27ae60',
  },
  orderActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '1rem',
    borderTop: '1px solid #eee',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
};

export default Orders;
