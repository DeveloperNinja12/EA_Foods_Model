# EA Foods Frontend

A React frontend application for the EA Foods Pre-Order API.

## Features

- **Product Browsing**: View all available products with search and category filtering
- **User Authentication**: Simple role-based authentication (Customer, TSU, SR, Ops Manager)
- **Shopping Cart**: Add products to cart and manage quantities
- **Order Management**: Place orders and view order history
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- The EA Foods API backend running on port 3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

## Usage

### Authentication

The app uses a simple authentication system for demo purposes:

1. Click "Login" to access the login page
2. Enter your name, email, and select a role:
   - **Customer**: Can browse products and place orders
   - **TSU**: Territory Sales Unit - can place orders
   - **SR**: Sales Representative - can place orders
   - **Ops Manager**: Full administrative access

### Shopping

1. Browse products on the home page
2. Use search and category filters to find specific items
3. Add products to your cart
4. Go to the cart to review and place your order
5. Select delivery date and time slot
6. Place your order

### Order Management

- View all your orders in the "My Orders" page
- Track order status
- Cancel pending orders

## API Integration

The frontend integrates with the EA Foods API running on `http://localhost:3000`:

- **Products API**: `/api/products`
- **Orders API**: `/api/orders`
- **Authentication**: Uses `x-user-id` and `x-user-role` headers

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm eject`: Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   └── ProductCard.js  # Product display card
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── CartContext.js  # Shopping cart state
├── pages/              # Page components
│   ├── Products.js     # Product listing page
│   ├── Login.js        # Login page
│   ├── Cart.js         # Shopping cart page
│   └── Orders.js       # Order history page
├── services/           # API services
│   └── api.js          # API client
└── App.js              # Main app component
```

## Technologies Used

- React 18
- React Router DOM
- Axios (HTTP client)
- CSS-in-JS (inline styles)
- Context API (state management)
