import { http } from "./http";

export const getProductsApi = async () => {
  const data = await http("/products");
  return data.products;
};

