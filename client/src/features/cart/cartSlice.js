import { createSlice } from "@reduxjs/toolkit";
import { getSessionId } from "../../utils/storage";
import {
  clearCartOnServer,
  removeFromCartOnServer,
  syncCartWithServer,
  syncCartWrite,
  updateCartOnServer,
} from "./cartThunks";

const getSummary = (items) => {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Number((subtotal * 0.1).toFixed(2));
  const shipping = subtotal > 0 && subtotal < 100 ? 12 : 0;
  const total = Number((subtotal + tax + shipping).toFixed(2));

  return {
    itemCount,
    subtotal: Number(subtotal.toFixed(2)),
    tax,
    shipping,
    total,
  };
};

const initialState = {
  sessionId: getSessionId(),
  items: [],
  isDrawerOpen: false,
  syncStatus: "idle",
  feedback: "",
  lastSyncedAt: null,
};

const applyServerItems = (items = []) =>
  items.map((item) => ({
    ...item,
    product: item.product,
    inventory: item.inventory ?? 99,
  }));

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.product === product._id);

      if (existing) {
        existing.quantity += 1;
        existing.inventory = product.inventory;
      } else {
        state.items.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: 1,
          inventory: product.inventory,
        });
      }

      state.feedback = `${product.name} added to cart`;
      state.isDrawerOpen = true;
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product !== action.payload.productId);
      state.feedback = "Item removed from cart";
    },
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find((cartItem) => cartItem.product === productId);

      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.feedback = "Cart cleared";
    },
    toggleDrawer: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    clearFeedback: (state) => {
      state.feedback = "";
    },
  },
  selectors: {
    selectCartItems: (state) => state.items,
    selectCartSummary: (state) => getSummary(state.items),
    selectCartFeedback: (state) => state.feedback,
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncCartWithServer.pending, (state) => {
        state.syncStatus = "loading";
      })
      .addCase(syncCartWithServer.fulfilled, (state, action) => {
        state.syncStatus = "succeeded";
        state.lastSyncedAt = new Date().toISOString();
        if (!state.items.length && action.payload?.items?.length) {
          state.items = applyServerItems(action.payload.items);
        }
      })
      .addCase(syncCartWithServer.rejected, (state) => {
        state.syncStatus = "failed";
      })
      .addCase(syncCartWrite.fulfilled, (state, action) => {
        state.lastSyncedAt = new Date().toISOString();
        if (action.payload?.items) {
          state.items = applyServerItems(action.payload.items);
        }
      })
      .addCase(updateCartOnServer.fulfilled, (state, action) => {
        state.lastSyncedAt = new Date().toISOString();
        if (action.payload?.items) {
          state.items = applyServerItems(action.payload.items);
        }
      })
      .addCase(removeFromCartOnServer.fulfilled, (state, action) => {
        state.lastSyncedAt = new Date().toISOString();
        if (action.payload?.items) {
          state.items = applyServerItems(action.payload.items);
        }
      })
      .addCase(clearCartOnServer.fulfilled, (state) => {
        state.lastSyncedAt = new Date().toISOString();
      });
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleDrawer,
  clearFeedback,
} = cartSlice.actions;

export const { selectCartItems, selectCartSummary, selectCartFeedback } = cartSlice.selectors;

export default cartSlice.reducer;
