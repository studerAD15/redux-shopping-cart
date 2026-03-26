import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductsApi } from "../../api/products";

export const fetchProducts = createAsyncThunk("products/fetchProducts", async (_, thunkAPI) => {
  try {
    return await getProductsApi();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load products";
      });
  },
});

export default productsSlice.reducer;

