import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ featured: -1, createdAt: -1 });

  res.json({
    success: true,
    count: products.length,
    products,
  });
});

