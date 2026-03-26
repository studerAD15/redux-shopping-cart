import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const summarizeCart = (cart) => {
  const items = cart?.items ?? [];
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 0 && subtotal < 100 ? 12 : 0;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return {
    sessionId: cart?.sessionId ?? null,
    items,
    summary: {
      itemCount,
      subtotal: Number(subtotal.toFixed(2)),
      tax,
      shipping,
      total,
    },
  };
};

const getOrCreateCart = async (sessionId) => {
  let cart = await Cart.findOne({ sessionId });

  if (!cart) {
    cart = await Cart.create({ sessionId, items: [] });
  }

  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const cart = await getOrCreateCart(sessionId);

  res.json({
    success: true,
    cart: summarizeCart(cart),
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { sessionId, productId, quantity = 1 } = req.body;

  if (!sessionId || !productId) {
    res.status(400);
    throw new Error("sessionId and productId are required");
  }

  const normalizedQuantity = Math.max(1, Number(quantity) || 1);
  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.inventory < normalizedQuantity) {
    res.status(400);
    throw new Error("Requested quantity exceeds inventory");
  }

  const cart = await getOrCreateCart(sessionId);
  const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

  if (itemIndex >= 0) {
    const nextQuantity = cart.items[itemIndex].quantity + normalizedQuantity;

    if (nextQuantity > product.inventory) {
      res.status(400);
      throw new Error("Requested quantity exceeds inventory");
    }

    cart.items[itemIndex].quantity = nextQuantity;
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: normalizedQuantity,
    });
  }

  await cart.save();

  res.status(201).json({
    success: true,
    message: "Item added to cart",
    cart: summarizeCart(cart),
  });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { sessionId, productId, quantity } = req.body;

  if (!sessionId || !productId || quantity === undefined) {
    res.status(400);
    throw new Error("sessionId, productId, and quantity are required");
  }

  const normalizedQuantity = Number(quantity);

  if (!Number.isFinite(normalizedQuantity) || normalizedQuantity < 1) {
    res.status(400);
    throw new Error("quantity must be at least 1");
  }

  const product = await Product.findById(productId);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (normalizedQuantity > product.inventory) {
    res.status(400);
    throw new Error("Requested quantity exceeds inventory");
  }

  const cart = await getOrCreateCart(sessionId);
  const item = cart.items.find((cartItem) => cartItem.product.toString() === productId);

  if (!item) {
    res.status(404);
    throw new Error("Item not found in cart");
  }

  item.quantity = normalizedQuantity;
  await cart.save();

  res.json({
    success: true,
    message: "Cart item updated",
    cart: summarizeCart(cart),
  });
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { sessionId, productId } = req.body;

  if (!sessionId || !productId) {
    res.status(400);
    throw new Error("sessionId and productId are required");
  }

  const cart = await getOrCreateCart(sessionId);
  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  await cart.save();

  res.json({
    success: true,
    message: "Item removed from cart",
    cart: summarizeCart(cart),
  });
});

export const clearCart = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    res.status(400);
    throw new Error("sessionId is required");
  }

  const cart = await getOrCreateCart(sessionId);
  cart.items = [];
  await cart.save();

  res.json({
    success: true,
    message: "Cart cleared",
    cart: summarizeCart(cart),
  });
});

