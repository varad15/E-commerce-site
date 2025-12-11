// scripts/seed.js
// Script to populate MongoDB with demo data

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const User = require('../models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    
    console.log('📦 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: "Eco Detergents",
        slug: "eco-detergents",
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80",
        description: "Plant-based, biodegradable cleaning solutions",
        featured: true,
        productCount: 2
      },
      {
        name: "Bamboo Products",
        slug: "bamboo-products",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80",
        description: "Sustainable bamboo alternatives for daily use",
        featured: true,
        productCount: 2
      },
      {
        name: "Steel Straws",
        slug: "steel-straws",
        image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80",
        description: "Reusable stainless steel drinking straws",
        featured: true,
        productCount: 1
      },
      {
        name: "Kitchen Utensils",
        slug: "kitchen-utensils",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
        description: "Eco-friendly kitchen tools and utensils",
        featured: true,
        productCount: 1
      },
      {
        name: "Bathroom Essentials",
        slug: "bathroom-essentials",
        image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?auto=format&fit=crop&w=400&q=80",
        description: "Sustainable bathroom and personal care items",
        featured: true,
        productCount: 2
      }
    ]);
    
    console.log('🛍️  Creating products...');
    await Product.insertMany([
      {
        name: "Eco-Friendly Liquid Detergent (1L)",
        slug: "eco-friendly-liquid-detergent-1l",
        description: "Plant-based liquid detergent suitable for all fabrics. Biodegradable formula that's tough on stains but gentle on the environment.",
        price: 12.99,
        compareAtPrice: 16.99,
        discount: 24,
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=400&q=80"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 150,
        rating: 4.5,
        reviewCount: 89,
        featured: true,
        tags: ["detergent", "eco-friendly", "plant-based"],
        specifications: {
          volume: "1L",
          weight: "1050g",
          ingredients: "Plant-based surfactants, natural fragrances"
        }
      },
      {
        name: "Organic Dishwash Bar",
        slug: "organic-dishwash-bar",
        description: "Solid dishwashing bar made from coconut oil and natural minerals. Lasts longer than liquid soap and comes in zero-waste packaging.",
        price: 5.00,
        compareAtPrice: 7.00,
        discount: 29,
        image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1563299796-17596ed6b017?auto=format&fit=crop&w=400&q=80"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 200,
        rating: 4.8,
        reviewCount: 124,
        featured: true,
        tags: ["dishwashing", "organic", "zero-waste"],
        specifications: {
          weight: "200g",
          ingredients: "Coconut oil, natural minerals, essential oils"
        }
      },
      {
        name: "Bamboo Toothbrush (Pack of 4)",
        slug: "bamboo-toothbrush-pack-4",
        description: "Biodegradable bamboo toothbrushes with charcoal-infused bristles. Comes in a pack of 4 for the whole family.",
        price: 6.99,
        compareAtPrice: 9.99,
        discount: 30,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=400&q=80"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 300,
        rating: 4.6,
        reviewCount: 156,
        featured: true,
        tags: ["toothbrush", "bamboo", "biodegradable"],
        specifications: {
          material: "Bamboo handle, charcoal bristles",
          quantity: "4 pieces"
        }
      },
      {
        name: "Bamboo Cutlery Set",
        slug: "bamboo-cutlery-set",
        description: "Portable bamboo cutlery set with fork, spoon, knife, chopsticks, and straw. Perfect for on-the-go meals.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 120,
        rating: 4.7,
        reviewCount: 78,
        featured: false,
        tags: ["cutlery", "bamboo", "portable"],
        specifications: {
          material: "100% bamboo",
          includes: "Fork, spoon, knife, chopsticks, straw, cleaning brush, carrying pouch"
        }
      },
      {
        name: "Reusable Steel Straws (Set of 6)",
        slug: "reusable-steel-straws-set-6",
        description: "Food-grade stainless steel straws in straight and bent styles. Includes 2 cleaning brushes.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=400&q=80"],
        category: categories[2]._id,
        categoryName: "Steel Straws",
        inStock: true,
        stockQuantity: 250,
        rating: 4.9,
        reviewCount: 203,
        featured: true,
        tags: ["straws", "stainless-steel", "reusable"],
        specifications: {
          material: "304 stainless steel",
          quantity: "6 straws + 2 brushes",
          length: "21.5cm"
        }
      },
      {
        name: "Wooden Cooking Spoon Set",
        slug: "wooden-cooking-spoon-set",
        description: "Handcrafted wooden cooking spoons made from sustainable beech wood. Set of 5 different sizes.",
        price: 18.99,
        compareAtPrice: 24.99,
        discount: 24,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=400&q=80"],
        category: categories[3]._id,
        categoryName: "Kitchen Utensils",
        inStock: true,
        stockQuantity: 85,
        rating: 4.4,
        reviewCount: 45,
        featured: false,
        tags: ["cooking", "wooden", "utensils"],
        specifications: {
          material: "Beech wood",
          quantity: "5 pieces",
          finish: "Food-safe oil"
        }
      },
      {
        name: "Organic Cotton Towel Set",
        slug: "organic-cotton-towel-set",
        description: "Soft and absorbent towels made from 100% organic cotton. Set includes bath towel, hand towel, and face towel.",
        price: 32.99,
        compareAtPrice: 45.99,
        discount: 28,
        image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?auto=format&fit=crop&w=400&q=80"],
        category: categories[4]._id,
        categoryName: "Bathroom Essentials",
        inStock: true,
        stockQuantity: 60,
        rating: 4.7,
        reviewCount: 67,
        featured: false,
        tags: ["towels", "organic-cotton", "bathroom"],
        specifications: {
          material: "100% organic cotton",
          includes: "1 bath towel (70x140cm), 1 hand towel (50x100cm), 1 face towel (30x30cm)",
          colors: "Natural white"
        }
      },
      {
        name: "Solid Shampoo Bar - Lavender",
        slug: "solid-shampoo-bar-lavender",
        description: "Zero-waste shampoo bar with lavender and rosemary. Lasts up to 80 washes. Suitable for all hair types.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"],
        category: categories[4]._id,
        categoryName: "Bathroom Essentials",
        inStock: true,
        stockQuantity: 180,
        rating: 4.6,
        reviewCount: 112,
        featured: true,
        tags: ["shampoo", "zero-waste", "natural"],
        specifications: {
          weight: "100g",
          scent: "Lavender",
          ingredients: "Natural surfactants, essential oils, plant extracts"
        }
      }
    ]);
    
    console.log('👤 Creating demo user...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      name: "Demo User",
      email: "demo@ecomart.com",
      password: hashedPassword,
      avatar: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      isNewUser: false  // Changed from isNew to isNewUser
    });
    
    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${categories.length} categories created`);
    console.log(`   - ${8} products created`);
    console.log(`   - 1 demo user created`);
    console.log('\n👤 Demo User Credentials:');
    console.log('   Email: demo@ecomart.com');
    console.log('   Password: password123');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
    throw error;
  }
};

const main = async () => {
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('\n🔌 MongoDB connection closed');
  process.exit(0);
};

main();