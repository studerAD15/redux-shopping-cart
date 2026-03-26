import { http } from "./http";

export const fetchCartApi = (sessionId) => http(`/cart/${sessionId}`);

export const addToCartApi = (payload) =>
  http("/cart", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateCartApi = (payload) =>
  http("/cart", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const removeCartApi = (payload) =>
  http("/cart", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });

export const clearCartApi = (payload) =>
  http("/cart/clear/all", {
    method: "DELETE",
    body: JSON.stringify(payload),
  });
