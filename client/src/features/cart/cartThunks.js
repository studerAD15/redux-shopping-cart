import { createAsyncThunk } from "@reduxjs/toolkit";
import { addToCartApi, clearCartApi, fetchCartApi, removeCartApi, updateCartApi } from "../../api/cart";

export const syncCartWithServer = createAsyncThunk(
  "cart/syncCartWithServer",
  async (_, thunkAPI) => {
    try {
      const sessionId = thunkAPI.getState().cart.sessionId;
      const data = await fetchCartApi(sessionId);
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const syncCartWrite = createAsyncThunk("cart/syncCartWrite", async (product, thunkAPI) => {
  try {
    const sessionId = thunkAPI.getState().cart.sessionId;
    const data = await addToCartApi({
      sessionId,
      productId: product._id,
      quantity: 1,
    });
    return data.cart;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

export const updateCartOnServer = createAsyncThunk(
  "cart/updateCartOnServer",
  async ({ productId, quantity }, thunkAPI) => {
    try {
      const sessionId = thunkAPI.getState().cart.sessionId;
      const data = await updateCartApi({ sessionId, productId, quantity });
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const removeFromCartOnServer = createAsyncThunk(
  "cart/removeFromCartOnServer",
  async (productId, thunkAPI) => {
    try {
      const sessionId = thunkAPI.getState().cart.sessionId;
      const data = await removeCartApi({ sessionId, productId });
      return data.cart;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const clearCartOnServer = createAsyncThunk("cart/clearCartOnServer", async (_, thunkAPI) => {
  try {
    const sessionId = thunkAPI.getState().cart.sessionId;
    const data = await clearCartApi({ sessionId });
    return data.cart;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

