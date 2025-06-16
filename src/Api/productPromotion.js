import { authFetch } from "./authFetch";
const API_BASE_URL = "http://localhost:3000/api";

//Lấy tất cả
export const getAllProductPromotion = async () => {
  const res = await fetch(`${API_BASE_URL}/product-promotions`);
  if (!res.ok) throw new Error("Không lấy được danh sách product promotion");
  return res.json();
};

//Thêm mới
export const createProductPromotion = async ({
  productVariantId, promotionId
}) => {
  const res = await authFetch(`${API_BASE_URL}/product-promotions`, {
    method: "POST",
    body: JSON.stringify({
      productVariantId,
      promotionId,
    }),
  });
  if (!res.ok) throw new Error("Không thêm được product promotion");
  return res.json();
};

//Xoá
export const deleteProductPromotion = async ({productVariantId, promotionId}) => {
  const res = await authFetch(`${API_BASE_URL}/product-promotions`, {
    method: "DELETE",
    body: JSON.stringify({
      productVariantId,
      promotionId,
    }),
  });
  if (!res.ok) throw new Error("Không xoá được product promotion");
  return res.json();
};
