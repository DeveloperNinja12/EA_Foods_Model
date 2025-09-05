import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <div style={styles.placeholderImage}>
          🍽️
        </div>
      </div>
      
      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>
        <div style={styles.category}>{product.category}</div>
        <div style={styles.price}>${product.price.toFixed(2)}</div>
        
        <button 
          onClick={() => onAddToCart(product)}
          style={styles.addButton}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  imageContainer: {
    height: '150px',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
  },
  placeholderImage: {
    fontSize: '3rem',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  name: {
    margin: 0,
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  description: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#666',
    lineHeight: '1.4',
  },
  category: {
    fontSize: '0.8rem',
    color: '#3498db',
    backgroundColor: '#ecf0f1',
    padding: '0.2rem 0.5rem',
    borderRadius: '12px',
    alignSelf: 'flex-start',
  },
  price: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#27ae60',
  },
  addButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    marginTop: '0.5rem',
  },
};

export default ProductCard;
