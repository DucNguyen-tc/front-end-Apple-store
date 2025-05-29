import { authFetch } from "./authFetch";
const API_BASE_URL = "http://localhost:3000/api";

// Lấy tất cả cửa hàng
export const getAllStores = async () => {
  const res = await fetch(`${API_BASE_URL}/stores`);
  if (!res.ok) throw new Error("Không lấy được danh sách cửa hàng");
  return res.json();
};

// Lấy cửa hàng theo id
export const getStoreById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/stores/${id}`);
  if (!res.ok) throw new Error("Không lấy được cửa hàng");
  return res.json();
};

// Tạo mới cửa hàng
export const createStore = async (store) => {
  const res = await authFetch(`${API_BASE_URL}/stores`, {
    method: "POST",
    body: JSON.stringify(store),
  });
  if (!res.ok) throw new Error("Không thể tạo cửa hàng");
  return res.json(); // Return the created store
};

// Cập nhật cửa hàng
export const updateStore = async (id, store) => {
  const res = await authFetch(`${API_BASE_URL}/stores/${id}`, {
    method: "PUT",
    body: JSON.stringify(store),
  });
  if (!res.ok) throw new Error("Không thể cập nhật cửa hàng");
  return res.json(); // Return the updated store
};

// Xoá cửa hàng
export const deleteStore = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/stores/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Không thể xoá cửa hàng");
  return res.json(); // Return the deleted store
};