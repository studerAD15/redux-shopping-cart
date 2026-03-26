const CART_STORAGE_KEY = "nova-cart-state";
const SESSION_STORAGE_KEY = "nova-cart-session-id";

export const loadCartState = () => {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const serializedState = window.localStorage.getItem(CART_STORAGE_KEY);
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch {
    return undefined;
  }
};

export const saveCartState = (cartState) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
};

export const getSessionId = () => {
  if (typeof window === "undefined") {
    return "server-render";
  }

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const newId = `session_${crypto.randomUUID()}`;
  window.localStorage.setItem(SESSION_STORAGE_KEY, newId);
  return newId;
};

