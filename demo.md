# EA Foods Demo Guide

## �� Quick Demo Steps

### 1. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000

### 2. Login as Different Users
Click "Login" and try different roles:

#### Customer Demo
- Name: John Customer
- Email: john@example.com
- Role: customer

#### TSU Demo
- Name: Jane TSU
- Email: jane@example.com
- Role: tsu

#### Sales Rep Demo
- Name: Bob Sales
- Email: bob@example.com
- Role: sr

#### Operations Manager Demo
- Name: Alice Manager
- Email: alice@example.com
- Role: ops_manager

### 3. Test Features

#### Product Browsing
- Browse all products on the home page
- Use search to find specific items
- Filter by categories (Fruits, Vegetables, Dairy, etc.)

#### Shopping Cart
- Add products to cart
- Adjust quantities
- View cart total

#### Order Placement
- Go to cart
- Select delivery date (must be future date)
- Choose delivery slot (morning, afternoon, evening)
- Place order

#### Order Management
- View "My Orders" to see order history
- Check order status
- Cancel pending orders (if status is pending)

### 4. API Testing

You can also test the API directly using curl:

```bash
# Get all products
curl http://localhost:3000/api/products

# Get products with authentication
curl -H "x-user-id: 1" -H "x-user-role: customer" \
     http://localhost:3000/api/products

# Get delivery slots
curl http://localhost:3000/api/orders/delivery-slots

# Create an order (requires authentication)
curl -X POST -H "Content-Type: application/json" \
     -H "x-user-id: 1" -H "x-user-role: customer" \
     -d '{
       "delivery_date": "2025-09-06",
       "delivery_slot": "morning",
       "items": [
         {"product_id": 1, "quantity": 2},
         {"product_id": 3, "quantity": 1}
       ]
     }' \
     http://localhost:3000/api/orders
```

### 5. Sample Data

The database is seeded with sample products:
- Fresh Organic Apples ($4.99)
- Premium Bananas ($2.49)
- Organic Spinach ($3.99)
- Carrots ($1.99)
- Whole Grain Bread ($3.49)
- Organic Milk ($5.99)
- Free-Range Eggs ($4.49)
- Organic Chicken Breast ($8.99)
- Salmon Fillet ($12.99)
- Quinoa ($6.99)

### 6. Business Rules Demonstrated

- **Cut-off Time**: Orders placed after 6 PM are scheduled for +2 days delivery
- **Stock Management**: Orders cannot exceed available inventory
- **Role-based Access**: Different permissions for different user types
- **Delivery Windows**: Three time slots available (morning, afternoon, evening)

## 🛠️ Troubleshooting

### If Frontend Won't Load
1. Check if backend is running: `curl http://localhost:3000/health`
2. Check if frontend is running: `curl http://localhost:3001`
3. Restart both servers: `./start-dev.sh`

### If API Calls Fail
1. Check authentication headers are set correctly
2. Verify user role is valid (customer, tsu, sr, ops_manager)
3. Check API documentation: http://localhost:3000/api

### If Database Issues
1. Re-seed the database: `npm run seed`
2. Check database file exists: `ls -la ea_foods.db`
