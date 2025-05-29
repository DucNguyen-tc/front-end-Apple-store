import { authFetch } from "./authFetch";

const API_BASE_URL = "http://localhost:3000/api";

// Lấy tất cả biến thể
export const getAllVariants = async () => {
  const res = await fetch(`${API_BASE_URL}/product-variants`);
  if (!res.ok) throw new Error("Không lấy được danh sách biến thể");
  return res.json();
};

// Lấy biến thể theo ID
export const getVariantById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/product-variants/${id}`);
  if (!res.ok) throw new Error("Không lấy được biến thể");
  return res.json();
};

// Tạo biến thể mới
export const createVariant = async (variantData) => {
  const res = await authFetch(`${API_BASE_URL}/product-variants`, {
    method: "POST",
    body: JSON.stringify(variantData),
  });
  if (!res.ok) throw new Error("Không thể tạo biến thể mới");
  return res.json();
};

// Cập nhật biến thể
export const updateVariant = async (id, variantData) => {
  const res = await authFetch(`${API_BASE_URL}/product-variants/${id}`, {
    method: "PUT",
    body: JSON.stringify(variantData),
  });
  if (!res.ok) throw new Error("Không thể cập nhật biến thể");
  return res.json();
};

// Xoá biến thể
export const deleteVariant = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/product-variants/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Không thể xoá biến thể");
  return res.json();
};