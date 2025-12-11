// scripts/seed-100-products.js
// Generate 180+ eco-friendly products with real data
// FIXED: Matches Product model schema (certifications as string, categoryName required)

const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Validate environment variables
if (!process.env.MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI not found!\n');
  console.error('Please ensure .env file exists at:', path.join(__dirname, '..', '.env'));
  console.error('\n💡 Run this to diagnose:');
  console.error('  node scripts/check-env.js\n');
  process.exit(1);
}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
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

// ==============================================
// ENHANCED PRODUCT DATA - 180+ PRODUCTS
// ==============================================

const categories = [
  {
    name: "Eco Detergents",
    slug: "eco-detergents",
    description: "Plant-based cleaning solutions that are gentle on the environment",
    image: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400",
    featured: true
  },
  {
    name: "Bamboo Products",
    slug: "bamboo-products",
    description: "Sustainable bamboo alternatives for everyday items",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
    featured: true
  },
  {
    name: "Reusable Straws",
    slug: "reusable-straws",
    description: "Durable alternatives to single-use plastic straws",
    image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?w=400",
    featured: true
  },
  {
    name: "Kitchen Essentials",
    slug: "kitchen-essentials",
    description: "Zero-waste kitchen tools and accessories",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    featured: true
  },
  {
    name: "Bathroom Essentials",
    slug: "bathroom-essentials",
    description: "Plastic-free bathroom products",
    image: "https://images.unsplash.com/photo-1584305574239-15b9c4e8a66c?w=400",
    featured: true
  },
  {
    name: "Zero Waste Living",
    slug: "zero-waste-living",
    description: "Complete zero-waste lifestyle essentials",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    featured: true
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    description: "Natural and organic personal care products",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400",
    featured: true
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Sustainable home decor and accessories",
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400",
    featured: true
  },
  {
    name: "Outdoor & Travel",
    slug: "outdoor-travel",
    description: "Eco-friendly products for adventures",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
    featured: true
  },
  {
    name: "Food Storage",
    slug: "food-storage",
    description: "Reusable containers and wraps",
    image: "https://images.unsplash.com/photo-1581027992652-6af4b6dcf277?w=400",
    featured: true
  },
  {
    name: "Organic Clothing",
    slug: "organic-clothing",
    description: "Sustainable fashion and eco-friendly fabrics",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
    featured: true
  },
  {
    name: "Garden & Plants",
    slug: "garden-plants",
    description: "Eco-friendly gardening supplies and organic seeds",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400",
    featured: true
  }
];

// Enhanced product templates with 15 products per category
const productTemplates = {
  "eco-detergents": [
    { name: "Eco-Friendly Liquid Detergent 1L", price: 12.99, comparePrice: 16.99, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "Organic Dishwash Bar 200g", price: 5.99, comparePrice: 8.99, image: "photo-1563201515-f0b6e0c98a33" },
    { name: "Laundry Detergent Sheets (60 loads)", price: 18.99, comparePrice: 24.99, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "All-Purpose Cleaner Concentrate 500ml", price: 9.99, image: "photo-1585421514738-01798e348b17" },
    { name: "Eco Fabric Softener 750ml", price: 8.50, comparePrice: 11.99, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "Natural Floor Cleaner 1L", price: 10.99, image: "photo-1563201515-f0b6e0c98a33" },
    { name: "Glass & Window Cleaner 750ml", price: 7.99, comparePrice: 9.99, image: "photo-1585421514738-01798e348b17" },
    { name: "Bathroom Cleaner Spray 500ml", price: 8.99, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "Kitchen Degreaser 750ml", price: 9.50, comparePrice: 12.99, image: "photo-1563201515-f0b6e0c98a33" },
    { name: "Dishwasher Detergent Pods (40 pack)", price: 15.99, image: "photo-1585421514738-01798e348b17" },
    { name: "Toilet Bowl Cleaner 500ml", price: 7.50, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "Carpet Cleaner Solution 1L", price: 13.99, comparePrice: 17.99, image: "photo-1563201515-f0b6e0c98a33" },
    { name: "Stain Remover Spray 250ml", price: 6.99, image: "photo-1585421514738-01798e348b17" },
    { name: "Multi-Surface Wipes (50 pack)", price: 5.99, image: "photo-1610557892470-55d9e80c0bce" },
    { name: "Dish Soap Refill 1L", price: 8.99, comparePrice: 11.99, image: "photo-1563201515-f0b6e0c98a33" }
  ],
  "bamboo-products": [
    { name: "Bamboo Toothbrush (Pack of 4)", price: 6.99, comparePrice: 9.99, image: "photo-1607613009820-a29f7bb81c04" },
    { name: "Bamboo Cutlery Set", price: 14.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Kitchen Utensil Set (5 pieces)", price: 22.99, comparePrice: 29.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Bamboo Fiber Towels (Set of 3)", price: 34.99, comparePrice: 49.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Cutting Board Large", price: 19.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Bamboo Food Storage Containers", price: 27.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Straws (Pack of 12)", price: 8.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Bamboo Coffee Mug 350ml", price: 12.99, comparePrice: 16.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Serving Tray", price: 24.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Bamboo Soap Dish", price: 4.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Hairbrush", price: 11.99, image: "photo-1607613009820-a29f7bb81c04" },
    { name: "Bamboo Dish Rack", price: 29.99, comparePrice: 39.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Bamboo Salad Bowl Set", price: 32.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Coasters (Set of 6)", price: 9.99, image: "photo-1591195853828-11db59a44f6b" },
    { name: "Bamboo Phone Stand", price: 7.99, image: "photo-1591195853828-11db59a44f6b" }
  ],
  "reusable-straws": [
    { name: "Stainless Steel Straws (Set of 6)", price: 4.50, image: "photo-1528323273322-d81458248d40" },
    { name: "Glass Straws (Set of 4)", price: 8.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Silicone Straws (Set of 8)", price: 6.99, comparePrice: 9.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Bamboo Fiber Straws (Pack of 12)", price: 3.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Collapsible Travel Straw", price: 5.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Wide Smoothie Straws (Set of 4)", price: 7.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Kids Silicone Straws (6 pack)", price: 8.99, comparePrice: 11.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Bent Stainless Steel Straws", price: 5.50, image: "photo-1528323273322-d81458248d40" },
    { name: "Glass Straw Gift Set", price: 12.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Copper Straws (Set of 4)", price: 9.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Titanium Straws (Set of 2)", price: 15.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Wheat Straw Drinking Straws", price: 4.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Bubble Tea Straws Reusable", price: 6.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Straw Cleaning Brush Set", price: 2.99, image: "photo-1528323273322-d81458248d40" },
    { name: "Travel Straw Case", price: 5.99, comparePrice: 7.99, image: "photo-1528323273322-d81458248d40" }
  ],
  "kitchen-essentials": [
    { name: "Wooden Cooking Spoon Set", price: 18.99, comparePrice: 24.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Reusable Beeswax Food Wraps", price: 16.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Silicone Baking Mats (Set of 2)", price: 14.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Stainless Steel Lunch Box", price: 24.99, comparePrice: 32.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Glass Food Storage Set", price: 39.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Reusable Produce Bags (10 pack)", price: 12.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Kitchen Compost Bin 5L", price: 29.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Cloth Dish Towels (Pack of 6)", price: 19.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Reusable Coffee Filters", price: 8.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Vegetable Brush Set", price: 6.99, comparePrice: 9.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Cast Iron Skillet 12 inch", price: 44.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Ceramic Mixing Bowls Set", price: 34.99, comparePrice: 44.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Silicone Pot Holders (4 pack)", price: 11.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Wooden Salad Servers", price: 9.99, image: "photo-1556909114-f6e7ad7d3136" },
    { name: "Reusable Zip-Lock Bags", price: 15.99, image: "photo-1581027992652-6af4b6dcf277" }
  ],
  "bathroom-essentials": [
    { name: "Solid Shampoo Bar Lavender", price: 8.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Organic Cotton Towel Set", price: 32.99, comparePrice: 45.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Bamboo Toothbrush Holder", price: 7.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Reusable Cotton Rounds (20 pack)", price: 11.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Natural Loofah Sponge", price: 4.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Solid Conditioner Bar", price: 9.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Bamboo Bath Mat", price: 28.99, comparePrice: 38.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Safety Razor Plastic-Free", price: 24.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Natural Pumice Stone", price: 3.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Organic Bath Towel", price: 22.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Bamboo Cotton Swabs", price: 5.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Natural Sea Sponge", price: 8.99, comparePrice: 11.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Shower Curtain Organic Cotton", price: 39.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Bath Robe Organic Cotton", price: 54.99, comparePrice: 69.99, image: "photo-1584305574239-15b9c4e8a66c" },
    { name: "Soap Saver Bag", price: 4.99, image: "photo-1584305574239-15b9c4e8a66c" }
  ],
  "zero-waste-living": [
    { name: "Zero Waste Starter Kit", price: 49.99, comparePrice: 69.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Reusable Shopping Bags (Set of 5)", price: 14.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Stainless Steel Water Bottle 750ml", price: 18.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Cloth Napkins (Set of 8)", price: 16.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Reusable Sandwich Bags", price: 12.99, comparePrice: 16.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Beeswax Candles (Set of 4)", price: 19.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Metal Safety Pins Set", price: 5.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Natural Fiber Scrub Brush", price: 7.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Reusable Gift Wrap", price: 13.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Compostable Trash Bags", price: 11.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Cloth Menstrual Pads", price: 24.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Reusable Makeup Remover Pads", price: 9.99, comparePrice: 12.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Stainless Steel Soap Bar", price: 6.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Unpaper Towels (12 pack)", price: 22.99, image: "photo-1542601906990-b4d3fb778b09" },
    { name: "Mesh Laundry Bags", price: 13.99, image: "photo-1542601906990-b4d3fb778b09" }
  ],
  "personal-care": [
    { name: "Natural Deodorant Stick", price: 9.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Organic Face Wash 150ml", price: 14.99, comparePrice: 19.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Lip Balm (Pack of 3)", price: 8.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Bamboo Hair Brush", price: 12.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Body Lotion 250ml", price: 16.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Organic Sunscreen SPF 50", price: 18.99, comparePrice: 24.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Toothpaste 100ml", price: 7.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Activated Charcoal Face Mask", price: 13.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Hand Cream 75ml", price: 9.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Organic Essential Oil Set", price: 29.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Body Scrub 200g", price: 12.99, comparePrice: 16.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Organic Face Serum 30ml", price: 24.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Foot Cream 100ml", price: 11.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Organic Moisturizer 100ml", price: 19.99, comparePrice: 25.99, image: "photo-1556228578-8c89e6adf883" },
    { name: "Natural Makeup Remover 200ml", price: 13.99, image: "photo-1556228578-8c89e6adf883" }
  ],
  "home-living": [
    { name: "Soy Wax Candles (Set of 3)", price: 24.99, comparePrice: 32.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Organic Cotton Bedsheet Set", price: 59.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Natural Jute Rug 5x7ft", price: 79.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Bamboo Picture Frames (3 pack)", price: 16.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Hemp Throw Pillows (Set of 2)", price: 34.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Air Purifying Plants (3 pack)", price: 22.99, comparePrice: 29.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Recycled Glass Vase", price: 18.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Organic Cotton Blanket", price: 49.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Natural Wood Wall Shelf", price: 39.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Eco-Friendly Plant Pots (5 pack)", price: 14.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Linen Table Runner", price: 27.99, comparePrice: 35.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Cork Coaster Set", price: 11.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Organic Duvet Cover", price: 69.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Natural Fiber Baskets (3 pack)", price: 32.99, image: "photo-1556228453-efd6c1ff04f6" },
    { name: "Bamboo Lamp", price: 44.99, comparePrice: 59.99, image: "photo-1556228453-efd6c1ff04f6" }
  ],
  "outdoor-travel": [
    { name: "Stainless Steel Travel Mug", price: 16.99, comparePrice: 21.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Solar-Powered Charger", price: 39.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Water Filter Bottle", price: 24.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Organic Cotton Travel Towel", price: 18.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Bamboo Travel Cutlery Set", price: 12.99, comparePrice: 16.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Collapsible Food Container", price: 14.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Natural Bug Repellent Spray", price: 11.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Eco-Friendly Picnic Set", price: 44.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Biodegradable Camping Soap", price: 7.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Recycled Plastic Backpack", price: 54.99, comparePrice: 69.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Portable Solar Lantern", price: 29.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Camping Hammock Organic", price: 39.99, comparePrice: 49.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Travel Toiletry Kit", price: 19.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Reusable Hand Warmer Set", price: 13.99, image: "photo-1501594907352-04cda38ebc29" },
    { name: "Eco Yoga Mat", price: 42.99, image: "photo-1501594907352-04cda38ebc29" }
  ],
  "food-storage": [
    { name: "Glass Mason Jars (Set of 6)", price: 19.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Silicone Food Bags (Set of 4)", price: 17.99, comparePrice: 22.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Stainless Steel Containers", price: 29.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Beeswax Bowl Covers (5 pack)", price: 13.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Glass Refrigerator Containers", price: 34.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Silicone Stretch Lids (6 pack)", price: 11.99, comparePrice: 14.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Bamboo Bread Box", price: 38.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Reusable Freezer Bags", price: 15.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Glass Spice Jars (Set of 12)", price: 24.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Stainless Steel Tiffin Box", price: 26.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Vacuum Seal Bags (10 pack)", price: 18.99, comparePrice: 23.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Glass Butter Dish", price: 12.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Ceramic Canister Set", price: 44.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Produce Storage Bags (8 pack)", price: 14.99, image: "photo-1581027992652-6af4b6dcf277" },
    { name: "Stackable Storage Bins", price: 22.99, image: "photo-1581027992652-6af4b6dcf277" }
  ],
  "organic-clothing": [
    { name: "Organic Cotton T-Shirt", price: 24.99, comparePrice: 32.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Hemp Fabric Jeans", price: 54.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Bamboo Socks (5 pack)", price: 16.99, comparePrice: 21.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Cotton Hoodie", price: 44.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Linen Button-Up Shirt", price: 39.99, comparePrice: 49.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Yoga Pants", price: 34.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Cotton Tank Top (3 pack)", price: 29.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Hemp Fabric Dress", price: 59.99, comparePrice: 74.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Cotton Underwear (4 pack)", price: 22.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Bamboo Pajama Set", price: 42.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Baby Onesie (3 pack)", price: 24.99, comparePrice: 29.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Hemp Canvas Tote Bag", price: 18.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Cotton Scarf", price: 19.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Bamboo Beanie Hat", price: 14.99, comparePrice: 18.99, image: "photo-1523381210434-271e8be1f52b" },
    { name: "Organic Cotton Gloves", price: 12.99, image: "photo-1523381210434-271e8be1f52b" }
  ],
  "garden-plants": [
    { name: "Organic Seed Starter Kit", price: 19.99, comparePrice: 25.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Compost Tumbler 50 Gal", price: 89.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Bamboo Garden Tools Set", price: 34.99, comparePrice: 44.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Organic Fertilizer 5kg", price: 16.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Biodegradable Plant Pots (20 pack)", price: 12.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Rain Barrel 50 Gallon", price: 79.99, comparePrice: 99.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Organic Herb Seeds Collection", price: 14.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Garden Kneeler Pad", price: 18.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Natural Pest Control Spray", price: 13.99, comparePrice: 17.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Worm Composting Bin", price: 44.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Organic Potting Soil 10kg", price: 11.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Garden Hose 50ft", price: 32.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Mushroom Growing Kit", price: 24.99, comparePrice: 29.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Bee-Friendly Flower Seeds", price: 9.99, image: "photo-1466692476868-aef1dfb1e735" },
    { name: "Organic Mulch 25L", price: 14.99, image: "photo-1466692476868-aef1dfb1e735" }
  ]
};

// Generate product variations - FIXED: matches Product model schema
function generateProducts(categorySlug, categoryId, categoryName, templates) {
  return templates.map((template, index) => {
    const isFeatured = index < 3; // First 3 products in each category are featured
    const stockLevels = [50, 75, 100, 120, 150, 200, 250];
    const stock = stockLevels[Math.floor(Math.random() * stockLevels.length)];
    
    const rating = (4.0 + Math.random() * 1.0).toFixed(1);
    const reviewCount = Math.floor(30 + Math.random() * 200);
    
    const discount = template.comparePrice 
      ? Math.round(((template.comparePrice - template.price) / template.comparePrice) * 100)
      : 0;
    
    return {
      name: template.name,
      slug: template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: `High-quality ${template.name.toLowerCase()} made from sustainable materials. Perfect for eco-conscious living. ${template.comparePrice ? 'Limited time offer!' : 'Great value for money!'} Certified organic and ethically sourced.`,
      price: template.price,
      compareAtPrice: template.comparePrice || null,
      discount: discount,
      category: categoryId,
      categoryName: categoryName, // FIXED: Added required categoryName field
      image: `https://images.unsplash.com/${template.image}?w=600`,
      images: [
        `https://images.unsplash.com/${template.image}?w=600`,
        `https://images.unsplash.com/${template.image}?w=600&sat=-100`,
        `https://images.unsplash.com/${template.image}?w=600&hue=30`
      ],
      stockQuantity: stock,
      inStock: true,
      featured: isFeatured,
      rating: parseFloat(rating),
      reviewCount: reviewCount,
      tags: ['eco-friendly', 'sustainable', 'organic', categorySlug.replace('-', ' ')],
      specifications: {
        material: 'Eco-friendly materials',
        certifications: 'Organic, Fair Trade, Plastic Free', // FIXED: Changed from array to string
        madeIn: 'Sustainably Sourced',
        weight: `${Math.floor(100 + Math.random() * 400)}g`
      }
    };
  });
}

// ==============================================
// SEED DATABASE
// ==============================================

async function seedDatabase() {
  try {
    console.log('\n🚀 Starting EcoMart Database Seeder...\n');
    console.log('🌱 Connecting to MongoDB...');
    console.log(`📍 Using URI: ${process.env.MONGODB_URI.substring(0, 30)}...`);
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Database cleared\n');

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories\n`);

    // Generate and create products
    console.log('📦 Generating products...');
    let allProducts = [];
    let totalProducts = 0;

    for (const category of createdCategories) {
      const templates = productTemplates[category.slug];
      if (templates) {
        const products = generateProducts(category.slug, category._id, category.name, templates);
        allProducts = allProducts.concat(products);
        totalProducts += products.length;
        console.log(`   ✓ ${products.length} products for ${category.name}`);
      }
    }

    const createdProducts = await Product.insertMany(allProducts);
    console.log(`✅ Created ${createdProducts.length} total products\n`);

    // Update category product counts
    console.log('🔢 Updating category product counts...');
    for (const category of createdCategories) {
      const count = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount: count });
    }
    console.log('✅ Category counts updated\n');

    // Create demo users
    console.log('👥 Creating demo users...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        name: 'Demo User',
        email: 'demo@ecomart.com',
        password: hashedPassword,
        isNewUser: false,
        avatar: 'https://i.pravatar.cc/150?img=1',
        addresses: [{
          street: '123 Green Street',
          city: 'Pune',
          state: 'Maharashtra',
          zipCode: '411001',
          country: 'India',
          isDefault: true
        }]
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        isNewUser: true,
        avatar: 'https://i.pravatar.cc/150?img=12'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        isNewUser: false,
        avatar: 'https://i.pravatar.cc/150?img=5',
        addresses: [{
          street: '456 Eco Avenue',
          city: 'Mumbai',
          state: 'Maharashtra',
          zipCode: '400001',
          country: 'India',
          isDefault: true
        }]
      }
    ];

    await User.insertMany(users);
    console.log(`✅ Created ${users.length} demo users\n`);

    // Summary
    console.log('\n' + '='.repeat(70));
    console.log('✅ DATABASE SEEDED SUCCESSFULLY!');
    console.log('='.repeat(70));
    console.log(`📊 Summary:`);
    console.log(`   • Categories: ${createdCategories.length}`);
    console.log(`   • Products: ${createdProducts.length}`);
    console.log(`   • Featured Products: ${createdProducts.filter(p => p.featured).length}`);
    console.log(`   • Users: ${users.length}`);
    console.log('');
    console.log('🔐 Demo Credentials:');
    console.log('   • Email: demo@ecomart.com');
    console.log('   • Password: password123');
    console.log('');
    console.log('📂 Categories with Products:');
    for (const category of createdCategories) {
      const count = await Product.countDocuments({ category: category._id });
      console.log(`   • ${category.name.padEnd(25)} ${count} products`);
    }
    console.log('');
    console.log('🎯 Product Stats:');
    console.log(`   • Price Range: ₹${Math.min(...allProducts.map(p => p.price))} - ₹${Math.max(...allProducts.map(p => p.price))}`);
    console.log(`   • Average Rating: ${(allProducts.reduce((sum, p) => sum + p.rating, 0) / allProducts.length).toFixed(1)} ⭐`);
    console.log(`   • Total Stock: ${allProducts.reduce((sum, p) => sum + p.stockQuantity, 0)} items`);
    console.log('='.repeat(70) + '\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check that MONGODB_URI in .env is correct');
    console.error('   2. Ensure MongoDB Atlas network access allows your IP');
    console.error('   3. Verify database user has read/write permissions');
    console.error('   4. Check that models are in the correct location');
    console.error('   5. Run: node scripts/check-env.js\n');
    process.exit(1);
  }
}

// Run seeder
seedDatabase();