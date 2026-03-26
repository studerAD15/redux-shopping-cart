import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/products/productsSlice";
import cartReducer from "../features/cart/cartSlice";
import { loadCartState, saveCartState } from "../utils/storage";

const preloadedCart = loadCartState();

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
  preloadedState: preloadedCart
    ? {
        cart: preloadedCart,
      }
    : undefined,
  devTools: import.meta.env.MODE !== "production",
});

store.subscribe(() => {
  saveCartState(store.getState().cart);
});

