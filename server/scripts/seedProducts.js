import dotenv from "dotenv";
import { connectDatabase } from "../config/db.js";
import Product from "../models/Product.js";
import { products } from "../data/products.js";

dotenv.config();

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
