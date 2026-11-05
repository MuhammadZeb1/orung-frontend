import api from "../../services/api";

// READ
export const getProductsAPI = async () => {
  const res = await api.get("/products");
  return res.data;
};

// CREATE
export const createProductAPI = async (formData) => {
  const res = await api.post("/products/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// DELETE  ✅ FIXED
export const deleteProductAPI = async (id) => {
  const res = await api.delete(`/products/delete/${id}`);
  return res.data;
};

// UPDATE
export const updateProductAPI = async ({ id, formData }) => {
  const res = await api.put(`/products/update/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
