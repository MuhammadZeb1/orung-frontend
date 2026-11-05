import api from "../../services/api.js";

// create purchase
// payload = { items: [{ _id, cartQty }] }
export const createPurchase = async (payload) => {
  // Map items to { productId, quantity }
  const mappedItems = payload.items.map((i) => ({
    productId: i._id,
    quantity: i.cartQty ?? 1,
  }));

  const res = await api.post("/purchases/customer", { items: mappedItems });
  return res.data;
};

// fetch user purchases
export const getUserPurchases = async () => {
  const res = await api.get("/purchases/customer");
  return res.data;
};

// fetch admin purchases
export const getAdminPurchases = async () => {
  const res = await api.get("/purchases/admin");
  return res.data;
};
