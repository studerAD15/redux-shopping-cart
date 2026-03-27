import Product from "../models/Product.js";
import { products } from "../data/products.js";

export const ensureProductsSeeded = async () => {
  const existingCount = await Product.countDocuments();

  if (existingCount > 0) {
    return false;
  }

  await Product.insertMany(products);
  return true;
};
