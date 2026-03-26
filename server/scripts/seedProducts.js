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

