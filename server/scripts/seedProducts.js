import dotenv from "dotenv";
import { connectDatabase } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();

const products = [
  {
    name: "Nebula Headphones",
    slug: "nebula-headphones",
    brand: "Auralab",
    category: "Audio",
    description: "Premium wireless headphones with balanced sound, adaptive ANC, and 30-hour battery life.",
    price: 149.99,
    originalPrice: 189.99,
    inventory: 16,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Motion Desk Lamp",
    slug: "motion-desk-lamp",
    brand: "Luma",
    category: "Workspace",
    description: "A dimmable LED desk lamp with touch controls, warm tone presets, and USB-C charging.",
    price: 79.99,
    originalPrice: 99.99,
    inventory: 24,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Terra Bottle",
    slug: "terra-bottle",
    brand: "Wildcarry",
    category: "Lifestyle",
    description: "Insulated stainless steel bottle built for all-day hydration and clean minimalist carry.",
    price: 29.99,
    originalPrice: 39.99,
    inventory: 40,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Orbit Backpack",
    slug: "orbit-backpack",
    brand: "Northline",
    category: "Travel",
    description: "Structured commuter backpack with laptop sleeve, weather resistance, and modular storage.",
    price: 119.99,
    originalPrice: 149.99,
    inventory: 12,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Pulse Smart Watch",
    slug: "pulse-smart-watch",
    brand: "Chronex",
    category: "Wearables",
    description: "Fitness-first smartwatch with AMOLED display, GPS tracking, and health monitoring.",
    price: 199.99,
    originalPrice: 249.99,
    inventory: 18,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Canvas Sneakers",
    slug: "canvas-sneakers",
    brand: "Fieldstone",
    category: "Fashion",
    description: "Everyday sneakers with soft lining, durable outsole, and a clean low-profile finish.",
    price: 64.99,
    originalPrice: 84.99,
    inventory: 22,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Summit Duffel",
    slug: "summit-duffel",
    brand: "Wayfare",
    category: "Travel",
    description: "A rugged weekender duffel with water-resistant shell, shoe compartment, and reinforced straps.",
    price: 89.99,
    originalPrice: 119.99,
    inventory: 20,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Aero Wireless Charger",
    slug: "aero-wireless-charger",
    brand: "Voltic",
    category: "Tech",
    description: "Slim fast wireless charger with soft-touch finish and bedside-friendly charging indicator.",
    price: 34.99,
    originalPrice: 44.99,
    inventory: 35,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Breeze Hoodie",
    slug: "breeze-hoodie",
    brand: "Northline",
    category: "Fashion",
    description: "Midweight hoodie with brushed interior, clean tailoring, and all-day comfort for daily wear.",
    price: 54.99,
    originalPrice: 74.99,
    inventory: 28,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Drift Mechanical Keyboard",
    slug: "drift-mechanical-keyboard",
    brand: "Keystack",
    category: "Workspace",
    description: "Compact mechanical keyboard with tactile switches, hot-swap sockets, and warm white backlight.",
    price: 129.99,
    originalPrice: 159.99,
    inventory: 14,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Trail Performance Cap",
    slug: "trail-performance-cap",
    brand: "Wildcarry",
    category: "Lifestyle",
    description: "Lightweight cap with moisture-wicking fabric, curved brim, and adjustable back closure.",
    price: 24.99,
    originalPrice: 32.99,
    inventory: 50,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Lumen Table Speaker",
    slug: "lumen-table-speaker",
    brand: "Auralab",
    category: "Audio",
    description: "Compact Bluetooth speaker with room-filling sound, walnut trim, and 18-hour battery life.",
    price: 94.99,
    originalPrice: 124.99,
    inventory: 19,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1512446816042-444d64126727?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Harbor Ceramic Mug",
    slug: "harbor-ceramic-mug",
    brand: "Luma",
    category: "Home",
    description: "Matte ceramic mug with a comfortable handle, thick walls, and a clean studio-fired finish.",
    price: 18.99,
    originalPrice: 24.99,
    inventory: 60,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Atlas Carry-On",
    slug: "atlas-carry-on",
    brand: "Wayfare",
    category: "Travel",
    description: "Hard-shell carry-on with silent spinner wheels, compression straps, and TSA-friendly lock.",
    price: 179.99,
    originalPrice: 219.99,
    inventory: 10,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=900&q=80",
    featured: true
  },
  {
    name: "Core Training Mat",
    slug: "core-training-mat",
    brand: "Motion",
    category: "Fitness",
    description: "High-density training mat with anti-slip texture and easy-roll design for home workouts.",
    price: 44.99,
    originalPrice: 59.99,
    inventory: 27,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
    featured: false
  },
  {
    name: "Focus Desk Organizer",
    slug: "focus-desk-organizer",
    brand: "Luma",
    category: "Workspace",
    description: "Minimal desk organizer with compartments for cables, pens, cards, and everyday essentials.",
    price: 39.99,
    originalPrice: 49.99,
    inventory: 31,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    featured: false
  }
];

const seedProducts = async () => {
  try {
    await connectDatabase();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log("Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();
