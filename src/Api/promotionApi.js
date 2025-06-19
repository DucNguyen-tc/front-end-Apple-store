import { authFetch } from "./authFetch";

const API_BASE_URL = "http://localhost:3000/api";

// Lấy tất cả mã giảm giá
export const getAllPromotions = async () => {
  const res = await fetch(`${API_BASE_URL}/promotions`);
  if (!res.ok) throw new Error("Không lấy được danh sách mã giảm giá");
  return res.json();
};

// Lấy mã giảm giá theo id
export const getPromotionById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/promotions/${id}`);
  if (!res.ok) throw new Error("Không lấy được mã giảm giá");
  return res.json();
};

// Tạo mới mã giảm giá
export const createPromotion = async (promotion) => {
  const res = await authFetch(`${API_BASE_URL}/promotions`, {
    method: "POST",
    body: JSON.stringify(promotion),
  });
  if (!res.ok) throw new Error("Không thể tạo mã giảm giá");
  return res.json(); // Return the created promotion
};

// Cập nhật mã giảm giá
export const updatePromotion = async (id, promotion) => {
  const res = await authFetch(`${API_BASE_URL}/promotions/${id}`, {
    method: "PUT",
    body: JSON.stringify(promotion),
  });
  if (!res.ok) throw new Error("Không thể cập nhật mã giảm giá");
  return res.json(); // Return the updated promotion
};

// Xoá mã giảm giá
export const deletePromotion = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/promotions/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Không thể xoá mã giảm giá");
  return res.json(); // Return the deleted promotion
};