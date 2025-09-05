import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [deliverySlots, setDeliverySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadDeliverySlots();
  }, [isAuthenticated, navigate]);

  const loadDeliverySlots = async () => {
    try {
      const response = await ordersAPI.getAvailableDeliverySlots();
      if (response.data.success) {
        setDeliverySlots(response.data.data);
      }
    } catch (err) {
      setError('Failed to load delivery slots');
      console.error('Error loading delivery slots:', err);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    updateQuantity(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    
    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    if (!selectedSlot || !deliveryDate) {
      setError('Please select delivery date and slot');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const orderData = {
        delivery_date: deliveryDate,
        delivery_slot: selectedSlot,
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await ordersAPI.createOrder(orderData);
      
      if (response.data.success) {
        clearCart();
        alert('Order placed successfully!');
        navigate('/orders');
      } else {
        setError(response.data.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error('Error placing order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyCart}>
          <h2>Your cart is empty</h2>
          <p>Add some products to get started!</p>
          <button 
            onClick={() => navigate('/')}
            style={styles.continueShoppingBtn}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Shopping Cart</h1>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.cartContent}>
        <div style={styles.cartItems}>
          {cartItems.map((item) => (
            <div key={item.id} style={styles.cartItem}>
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemPrice}>${item.price.toFixed(2)} each</p>
              </div>
              
              <div style={styles.itemControls}>
                <div style={styles.quantityControls}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    style={styles.quantityBtn}
                  >
                    -
                  </button>
                  <span style={styles.quantity}>{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    style={styles.quantityBtn}
                  >
                    +
                  </button>
                </div>
                
                <div style={styles.itemTotal}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  style={styles.removeBtn}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div style={styles.orderForm}>
          <h3 style={styles.formTitle}>Delivery Information</h3>
          
          <form onSubmit={handleSubmitOrder} style={styles.form}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Date</label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                required
                style={styles.input}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Delivery Slot</label>
              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                required
                style={styles.select}
              >
                <option value="">Select a time slot</option>
                {deliverySlots.map((slot) => (
                  <option key={slot.slot} value={slot.slot}>
                    {slot.slot} ({slot.time_range})
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.orderSummary}>
              <div style={styles.summaryRow}>
                <span>Subtotal:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Delivery:</span>
                <span>Free</span>
              </div>
              <div style={styles.summaryRowTotal}>
                <span>Total:</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={styles.submitButton}
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>
        </div>
      </div>
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
  cartContent: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem',
  },
  cartItems: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  cartItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
  },
  itemPrice: {
    margin: 0,
    color: '#666',
  },
  itemControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  quantityBtn: {
    width: '30px',
    height: '30px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  quantity: {
    minWidth: '30px',
    textAlign: 'center',
  },
  itemTotal: {
    fontWeight: 'bold',
    color: '#27ae60',
    minWidth: '80px',
  },
  removeBtn: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  orderForm: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    height: 'fit-content',
  },
  formTitle: {
    margin: '0 0 1.5rem 0',
    color: '#2c3e50',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
  },
  orderSummary: {
    borderTop: '1px solid #ddd',
    paddingTop: '1rem',
    marginTop: '1rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '0.5rem',
  },
  summaryRowTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    borderTop: '1px solid #ddd',
    paddingTop: '0.5rem',
    marginTop: '0.5rem',
  },
  submitButton: {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    padding: '1rem',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  emptyCart: {
    textAlign: 'center',
    padding: '4rem 2rem',
  },
  continueShoppingBtn: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    marginTop: '1rem',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '2rem',
    textAlign: 'center',
  },
};

export default Cart;
