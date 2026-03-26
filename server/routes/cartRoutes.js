import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/:sessionId", getCart);
router.post("/", addToCart);
router.put("/", updateCartItem);
router.delete("/", removeCartItem);
router.delete("/clear/all", clearCart);

export default router;

