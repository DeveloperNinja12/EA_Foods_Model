require('dotenv').config();
const db = require('../utils/database');
const User = require('../models/User');
const Product = require('../models/Product');
const Stock = require('../models/Stock');

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await db.connect();
    
    // Clear existing data (in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('�� Clearing existing data...');
      await db.run('DELETE FROM stock_updates');
      await db.run('DELETE FROM order_items');
      await db.run('DELETE FROM orders');
      await db.run('DELETE FROM stock');
      await db.run('DELETE FROM products');
      await db.run('DELETE FROM users');
    }

    // Create users
    console.log('👥 Creating users...');
    const users = [
      { email: 'admin@eafoods.com', name: 'Admin User', role: 'ops_manager' },
      { email: 'customer1@example.com', name: 'John Doe', role: 'customer' },
      { email: 'customer2@example.com', name: 'Jane Smith', role: 'customer' },
      { email: 'tsu1@eafoods.com', name: 'Mike Johnson', role: 'tsu' },
      { email: 'tsu2@eafoods.com', name: 'Sarah Wilson', role: 'tsu' },
      { email: 'sr1@eafoods.com', name: 'David Brown', role: 'sr' },
      { email: 'sr2@eafoods.com', name: 'Lisa Davis', role: 'sr' },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create(userData);
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.name} (${user.role})`);
    }

    // Create products
    console.log('🍎 Creating products...');
    const products = [
      {
        name: 'Fresh Organic Apples',
        description: 'Crisp and sweet organic apples from local farms',
        price: 4.99,
        category: 'Fruits',
      },
      {
        name: 'Premium Bananas',
        description: 'Fresh yellow bananas, perfect for snacking',
        price: 2.49,
        category: 'Fruits',
      },
      {
        name: 'Organic Spinach',
        description: 'Fresh organic spinach leaves, great for salads',
        price: 3.99,
        category: 'Vegetables',
      },
      {
        name: 'Carrots (1 lb)',
        description: 'Fresh orange carrots, perfect for cooking',
        price: 1.99,
        category: 'Vegetables',
      },
      {
        name: 'Whole Grain Bread',
        description: 'Artisan whole grain bread, freshly baked',
        price: 3.49,
        category: 'Bakery',
      },
      {
        name: 'Organic Milk (1 gallon)',
        description: 'Fresh organic milk from grass-fed cows',
        price: 5.99,
        category: 'Dairy',
      },
      {
        name: 'Free-Range Eggs (dozen)',
        description: 'Fresh eggs from free-range chickens',
        price: 4.49,
        category: 'Dairy',
      },
      {
        name: 'Organic Chicken Breast',
        description: 'Fresh organic chicken breast, antibiotic-free',
        price: 8.99,
        category: 'Meat',
      },
      {
        name: 'Salmon Fillet',
        description: 'Fresh Atlantic salmon fillet',
        price: 12.99,
        category: 'Seafood',
      },
      {
        name: 'Quinoa (1 lb)',
        description: 'Organic quinoa, high in protein',
        price: 6.99,
        category: 'Grains',
      },
    ];

    const createdProducts = [];
    for (const productData of products) {
      const product = await Product.create(productData);
      createdProducts.push(product);
      console.log(`✅ Created product: ${product.name}`);
    }

    // Create stock
    console.log('📦 Creating stock...');
    const stockData = [
      { product_id: 1, quantity: 50 }, // Apples
      { product_id: 2, quantity: 75 }, // Bananas
      { product_id: 3, quantity: 30 }, // Spinach
      { product_id: 4, quantity: 40 }, // Carrots
      { product_id: 5, quantity: 25 }, // Bread
      { product_id: 6, quantity: 20 }, // Milk
      { product_id: 7, quantity: 35 }, // Eggs
      { product_id: 8, quantity: 15 }, // Chicken
      { product_id: 9, quantity: 10 }, // Salmon
      { product_id: 10, quantity: 20 }, // Quinoa
    ];

    const adminUser = createdUsers.find(u => u.role === 'ops_manager');
    
    for (const stockItem of stockData) {
      const stock = await Stock.create({
        ...stockItem,
        updated_by: adminUser.id,
      });
      console.log(`✅ Created stock: ${stockItem.quantity} units for product ${stockItem.product_id}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users created: ${createdUsers.length}`);
    console.log(`🍎 Products created: ${createdProducts.length}`);
    console.log(`📦 Stock items created: ${stockData.length}`);
    
    console.log('\n🔑 Test Users:');
    createdUsers.forEach(user => {
      console.log(`   ${user.role}: ${user.email} (ID: ${user.id})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await db.close();
    process.exit(0);
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
