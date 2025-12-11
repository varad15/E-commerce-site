// scripts/seed-enhanced.js
// Enhanced seed script with more products and variety
// FIXED: Better dotenv loading

const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI not found!\n');
  console.error('Please ensure .env file exists at:', path.join(__dirname, '..', '.env'));
  console.error('\nRun this command to diagnose:');
  console.error('  node scripts/check-env.js\n');
  process.exit(1);
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models - try both paths
let Category, Product, User;
try {
  Category = require('../models/Category');
  Product = require('../models/Product');
  User = require('../models/User');
} catch (err) {
  console.error('❌ Could not load models:', err.message);
  console.error('Please ensure models exist in:', path.join(__dirname, '..', 'models'));
  process.exit(1);
}

const connectDB = async () => {
  try {
    console.log('🌱 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI.substring(0, 30) + '...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleared\n');
    
    console.log('📦 Creating categories...');
    const categories = await Category.insertMany([
      {
        name: "Eco Detergents",
        slug: "eco-detergents",
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400",
        description: "Plant-based, biodegradable cleaning solutions for a greener home",
        featured: true,
        productCount: 5
      },
      {
        name: "Bamboo Products",
        slug: "bamboo-products",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
        description: "Sustainable bamboo alternatives for daily use",
        featured: true,
        productCount: 6
      },
      {
        name: "Reusable Straws",
        slug: "reusable-straws",
        image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=400",
        description: "Say no to plastic with our reusable straw collection",
        featured: true,
        productCount: 4
      },
      {
        name: "Kitchen Essentials",
        slug: "kitchen-essentials",
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        description: "Eco-friendly kitchen tools and utensils",
        featured: true,
        productCount: 7
      },
      {
        name: "Bathroom Essentials",
        slug: "bathroom-essentials",
        image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=400",
        description: "Sustainable bathroom and personal care items",
        featured: true,
        productCount: 6
      },
      {
        name: "Zero Waste Living",
        slug: "zero-waste-living",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
        description: "Products to help you live a zero-waste lifestyle",
        featured: false,
        productCount: 5
      }
    ]);
    console.log(`✅ Created ${categories.length} categories\n`);
    
    console.log('🛍️  Creating products...');
    const products = [
      // Eco Detergents (5 products)
      {
        name: "Eco-Friendly Liquid Detergent (1L)",
        slug: "eco-friendly-liquid-detergent-1l",
        description: "Plant-based liquid detergent suitable for all fabrics. Biodegradable formula that's tough on stains but gentle on the environment. Made with natural surfactants and essential oils.",
        price: 12.99,
        compareAtPrice: 16.99,
        discount: 24,
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600",
        images: [
          "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600",
          "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=600"
        ],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 150,
        rating: 4.5,
        reviewCount: 89,
        featured: true,
        tags: ["detergent", "eco-friendly", "plant-based", "biodegradable"],
        specifications: {
          volume: "1L",
          weight: "1050g",
          ingredients: "Plant-based surfactants, natural fragrances, essential oils"
        }
      },
      {
        name: "Organic Dishwash Bar (200g)",
        slug: "organic-dishwash-bar-200g",
        description: "Solid dishwashing bar made from coconut oil and natural minerals. Lasts longer than liquid soap and comes in zero-waste packaging. Perfect for dishes, pots, and pans.",
        price: 5.00,
        compareAtPrice: 7.00,
        discount: 29,
        image: "https://images.unsplash.com/photo-1563299796-17596ed6b017?w=600",
        images: ["https://images.unsplash.com/photo-1563299796-17596ed6b017?w=600"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 200,
        rating: 4.8,
        reviewCount: 124,
        featured: true,
        tags: ["dishwashing", "organic", "zero-waste", "coconut-oil"],
        specifications: {
          weight: "200g",
          ingredients: "Coconut oil, natural minerals, essential oils"
        }
      },
      {
        name: "Laundry Detergent Sheets (60 loads)",
        slug: "laundry-detergent-sheets-60",
        description: "Revolutionary laundry detergent sheets that dissolve completely in water. Pre-measured, zero-waste packaging, perfect for travel and home use.",
        price: 18.99,
        compareAtPrice: 24.99,
        discount: 24,
        image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600",
        images: ["https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 120,
        rating: 4.7,
        reviewCount: 203,
        featured: false,
        tags: ["laundry", "sheets", "zero-waste", "travel-friendly"],
        specifications: {
          loads: "60",
          weight: "180g"
        }
      },
      {
        name: "All-Purpose Cleaner Concentrate (500ml)",
        slug: "all-purpose-cleaner-concentrate-500ml",
        description: "Concentrated all-purpose cleaner. Mix with water to create 5L of cleaning solution. Works on all surfaces, naturally scented with lemon and tea tree.",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600",
        images: ["https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 95,
        rating: 4.6,
        reviewCount: 67,
        featured: false,
        tags: ["cleaner", "concentrate", "multi-surface", "natural"],
        specifications: {
          volume: "500ml",
          makes: "5L solution"
        }
      },
      {
        name: "Eco Fabric Softener (750ml)",
        slug: "eco-fabric-softener-750ml",
        description: "Plant-based fabric softener with natural lavender scent. Makes clothes soft and fresh without harsh chemicals. Suitable for sensitive skin.",
        price: 8.50,
        compareAtPrice: 11.99,
        discount: 29,
        image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600",
        images: ["https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600"],
        category: categories[0]._id,
        categoryName: "Eco Detergents",
        inStock: true,
        stockQuantity: 78,
        rating: 4.4,
        reviewCount: 45,
        featured: false,
        tags: ["fabric-softener", "lavender", "plant-based", "sensitive-skin"],
        specifications: {
          volume: "750ml",
          scent: "Lavender"
        }
      },

      // Bamboo Products (6 products)
      {
        name: "Bamboo Toothbrush (Pack of 4)",
        slug: "bamboo-toothbrush-pack-4",
        description: "Biodegradable bamboo toothbrushes with charcoal-infused bristles. Comes in a pack of 4 for the whole family. Different colors for easy identification.",
        price: 6.99,
        compareAtPrice: 9.99,
        discount: 30,
        image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600",
        images: [
          "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600",
          "https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600"
        ],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 300,
        rating: 4.6,
        reviewCount: 156,
        featured: true,
        tags: ["toothbrush", "bamboo", "biodegradable", "charcoal"],
        specifications: {
          material: "Bamboo handle, charcoal bristles",
          quantity: "4 pieces",
          colors: "Natural, Blue, Green, Pink"
        }
      },
      {
        name: "Bamboo Cutlery Set with Carrying Case",
        slug: "bamboo-cutlery-set-case",
        description: "Portable bamboo cutlery set with fork, spoon, knife, chopsticks, and straw. Comes with cleaning brush and premium carrying pouch. Perfect for on-the-go meals.",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600",
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 120,
        rating: 4.7,
        reviewCount: 78,
        featured: true,
        tags: ["cutlery", "bamboo", "portable", "travel"],
        specifications: {
          material: "100% bamboo",
          includes: "Fork, spoon, knife, chopsticks, straw, cleaning brush, carrying pouch"
        }
      },
      {
        name: "Bamboo Kitchen Utensil Set (5 pieces)",
        slug: "bamboo-kitchen-utensil-set-5",
        description: "Essential kitchen utensil set made from sustainable bamboo. Includes spatula, spoon, slotted spoon, fork, and ladle. Heat resistant up to 200°C.",
        price: 22.99,
        compareAtPrice: 29.99,
        discount: 23,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 65,
        rating: 4.8,
        reviewCount: 92,
        featured: false,
        tags: ["kitchen", "utensils", "bamboo", "cooking"],
        specifications: {
          pieces: "5",
          material: "Bamboo",
          heat_resistant: "200°C"
        }
      },
      {
        name: "Bamboo Fiber Towels (Set of 3)",
        slug: "bamboo-fiber-towels-set-3",
        description: "Ultra-soft and absorbent towels made from bamboo fiber. Naturally antibacterial and hypoallergenic. Includes bath towel, hand towel, and washcloth.",
        price: 34.99,
        compareAtPrice: 49.99,
        discount: 30,
        image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=600",
        images: ["https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=600"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 45,
        rating: 4.9,
        reviewCount: 134,
        featured: false,
        tags: ["towels", "bamboo-fiber", "antibacterial", "soft"],
        specifications: {
          material: "70% bamboo, 30% cotton",
          pieces: "3 (bath, hand, washcloth)"
        }
      },
      {
        name: "Bamboo Cutting Board (Large)",
        slug: "bamboo-cutting-board-large",
        description: "Durable bamboo cutting board with juice groove. Knife-friendly surface that won't dull your blades. Naturally antimicrobial and sustainable.",
        price: 19.99,
        image: "https://images.unsplash.com/photo-1594135412848-0ea1cd5d6a42?w=600",
        images: ["https://images.unsplash.com/photo-1594135412848-0ea1cd5d6a42?w=600"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 88,
        rating: 4.5,
        reviewCount: 67,
        featured: false,
        tags: ["cutting-board", "bamboo", "kitchen", "antimicrobial"],
        specifications: {
          size: "45cm x 30cm x 2cm",
          features: "Juice groove, hanging hole"
        }
      },
      {
        name: "Bamboo Food Storage Containers (Set of 3)",
        slug: "bamboo-storage-containers-3",
        description: "Eco-friendly food storage containers with bamboo lids. Glass base with airtight bamboo top. Microwave and dishwasher safe (remove lid).",
        price: 27.99,
        image: "https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600",
        images: ["https://images.unsplash.com/photo-1584270354949-c26b0d5b4a0c?w=600"],
        category: categories[1]._id,
        categoryName: "Bamboo Products",
        inStock: true,
        stockQuantity: 72,
        rating: 4.6,
        reviewCount: 54,
        featured: false,
        tags: ["storage", "containers", "bamboo", "glass"],
        specifications: {
          pieces: "3",
          sizes: "500ml, 750ml, 1000ml",
          material: "Borosilicate glass with bamboo lid"
        }
      },

      // Reusable Straws (4 products)
      {
        name: "Stainless Steel Straws (Set of 6)",
        slug: "stainless-steel-straws-6",
        description: "Food-grade stainless steel straws in straight and bent styles. Includes 2 cleaning brushes and storage pouch. Perfect for smoothies, cocktails, and everyday drinks.",
        price: 4.50,
        image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600",
        images: ["https://images.unsplash.com/photo-1528323273322-d81458248d40?w=600"],
        category: categories[2]._id,
        categoryName: "Reusable Straws",
        inStock: true,
        stockQuantity: 250,
        rating: 4.9,
        reviewCount: 203,
        featured: true,
        tags: ["straws", "stainless-steel", "reusable", "eco-friendly"],
        specifications: {
          material: "304 stainless steel",
          quantity: "6 straws + 2 brushes",
          length: "21.5cm",
          styles: "3 straight, 3 bent"
        }
      },
      {
        name: "Glass Straws (Set of 4)",
        slug: "glass-straws-4",
        description: "Elegant borosilicate glass straws. Heat and cold resistant. Dishwasher safe. Comes with cleaning brushes and protective case.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600",
        images: ["https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=600"],
        category: categories[2]._id,
        categoryName: "Reusable Straws",
        inStock: true,
        stockQuantity: 145,
        rating: 4.7,
        reviewCount: 89,
        featured: false,
        tags: ["straws", "glass", "borosilicate", "elegant"],
        specifications: {
          material: "Borosilicate glass",
          quantity: "4 straws + 1 brush",
          length: "20cm"
        }
      },
      {
        name: "Silicone Straws (Set of 8 + Case)",
        slug: "silicone-straws-8-case",
        description: "Flexible food-grade silicone straws in fun colors. Safe for kids, collapsible for easy storage. BPA-free and dishwasher safe.",
        price: 6.99,
        compareAtPrice: 9.99,
        discount: 30,
        image: "https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600",
        images: ["https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?w=600"],
        category: categories[2]._id,
        categoryName: "Reusable Straws",
        inStock: true,
        stockQuantity: 180,
        rating: 4.6,
        reviewCount: 112,
        featured: false,
        tags: ["straws", "silicone", "flexible", "kids-safe"],
        specifications: {
          material: "Food-grade silicone",
          quantity: "8 straws",
          colors: "Rainbow mix",
          features: "Collapsible, BPA-free"
        }
      },
      {
        name: "Bamboo Fiber Straws (Pack of 12)",
        slug: "bamboo-fiber-straws-12",
        description: "Biodegradable straws made from bamboo fiber. Compostable and eco-friendly. Perfect for parties and events. Suitable for hot and cold drinks.",
        price: 3.99,
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600",
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600"],
        category: categories[2]._id,
        categoryName: "Reusable Straws",
        inStock: true,
        stockQuantity: 320,
        rating: 4.4,
        reviewCount: 78,
        featured: false,
        tags: ["straws", "bamboo", "biodegradable", "compostable"],
        specifications: {
          material: "Bamboo fiber",
          quantity: "12 straws",
          length: "20cm"
        }
      },

      // Kitchen Essentials
      {
        name: "Wooden Cooking Spoon Set (5 pieces)",
        slug: "wooden-cooking-spoon-set-5",
        description: "Handcrafted wooden cooking spoons made from sustainable beech wood. Set of 5 different sizes and shapes. Food-safe oil finish.",
        price: 18.99,
        compareAtPrice: 24.99,
        discount: 24,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        images: ["https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600"],
        category: categories[3]._id,
        categoryName: "Kitchen Essentials",
        inStock: true,
        stockQuantity: 85,
        rating: 4.4,
        reviewCount: 45,
        featured: false,
        tags: ["cooking", "wooden", "utensils", "beech-wood"],
        specifications: {
          material: "Beech wood",
          quantity: "5 pieces",
          finish: "Food-safe oil"
        }
      },

      // Bathroom Essentials
      {
        name: "Solid Shampoo Bar - Lavender (100g)",
        slug: "solid-shampoo-bar-lavender-100g",
        description: "Zero-waste shampoo bar with lavender and rosemary. Lasts up to 80 washes. Suitable for all hair types. Sulfate-free and paraben-free.",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
        images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600"],
        category: categories[4]._id,
        categoryName: "Bathroom Essentials",
        inStock: true,
        stockQuantity: 180,
        rating: 4.6,
        reviewCount: 112,
        featured: true,
        tags: ["shampoo", "zero-waste", "natural", "lavender"],
        specifications: {
          weight: "100g",
          scent: "Lavender",
          washes: "80+",
          ingredients: "Natural surfactants, essential oils, plant extracts"
        }
      },
      {
        name: "Organic Cotton Towel Set (3 pieces)",
        slug: "organic-cotton-towel-set-3",
        description: "Soft and absorbent towels made from 100% organic cotton. Set includes bath towel, hand towel, and face towel. GOTS certified.",
        price: 32.99,
        compareAtPrice: 45.99,
        discount: 28,
        image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=600",
        images: ["https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=600"],
        category: categories[4]._id,
        categoryName: "Bathroom Essentials",
        inStock: true,
        stockQuantity: 60,
        rating: 4.7,
        reviewCount: 67,
        featured: false,
        tags: ["towels", "organic-cotton", "bathroom", "GOTS"],
        specifications: {
          material: "100% organic cotton",
          includes: "1 bath towel (70x140cm), 1 hand towel (50x100cm), 1 face towel (30x30cm)",
          colors: "Natural white"
        }
      }
    ];

    await Product.insertMany(products);
    console.log(`✅ Created ${products.length} products\n`);
    
    console.log('👤 Creating demo users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    await User.insertMany([
      {
        name: "Demo User",
        email: "demo@ecomart.com",
        password: hashedPassword,
        avatar: "https://i.pravatar.cc/150?img=1",
        isNewUser: false,
        addresses: [
          {
            street: "123 Green Street",
            city: "Pune",
            state: "Maharashtra",
            zipCode: "411001",
            country: "India",
            isDefault: true
          }
        ]
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: hashedPassword,
        avatar: "https://i.pravatar.cc/150?img=12",
        isNewUser: true
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        avatar: "https://i.pravatar.cc/150?img=5",
        isNewUser: false,
        addresses: [
          {
            street: "456 Eco Avenue",
            city: "Mumbai",
            state: "Maharashtra",
            zipCode: "400001",
            country: "India",
            isDefault: true
          }
        ]
      }
    ]);
    console.log('✅ Created 3 demo users\n');
    
    console.log('='.repeat(60));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log('📊 Summary:');
    console.log(`   • ${categories.length} categories created`);
    console.log(`   • ${products.length} products created`);
    console.log(`   • 3 demo users created`);
    console.log('\n👤 Demo User Credentials:');
    console.log('   1. Email: demo@ecomart.com | Password: password123');
    console.log('   2. Email: john@example.com | Password: password123');
    console.log('   3. Email: jane@example.com | Password: password123');
    console.log('\n🖼️  All products include real images from Unsplash');
    console.log('='.repeat(60) + '\n');
    
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    throw error;
  }
};

const main = async () => {
  console.log('\n🚀 Starting EcoMart Database Seeder...\n');
  await connectDB();
  await seedData();
  await mongoose.connection.close();
  console.log('🔌 MongoDB connection closed');
  process.exit(0);
};

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});