import { authFetch } from "./authFetch";

const API_BASE_URL = "http://localhost:4000/api";

// Lấy tất cả danh mục sản phẩm
export const getAllProductCategories = async () => {
  const res = await fetch(`${API_BASE_URL}/product-categories`);
  if (!res.ok) throw new Error("Không lấy được danh sách danh mục sản phẩm");
  return res.json();
};

// Lấy danh mục sản phẩm theo id
export const getProductCategoryById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/product-categories/${id}`);
  if (!res.ok) throw new Error("Không lấy được danh mục sản phẩm");
  return res.json();
};

// Tạo mới danh mục sản phẩm
export const createProductCategory = async (category) => {
  const res = await authFetch(`${API_BASE_URL}/product-categories`, {
    method: "POST",
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Không thể tạo danh mục sản phẩm");
  return res.json(); // Return the created category
};

// Cập nhật danh mục sản phẩm
export const updateProductCategory = async (id, category) => {
  const res = await authFetch(`${API_BASE_URL}/product-categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
  if (!res.ok) throw new Error("Không thể cập nhật danh mục sản phẩm");
  return res.json(); // Return the updated category
};

// Xoá danh mục sản phẩm
export const deleteProductCategory = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/product-categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Không thể xoá danh mục sản phẩm");
  return res.json(); // Return the deleted category
};
