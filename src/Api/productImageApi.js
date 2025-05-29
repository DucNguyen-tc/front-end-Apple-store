import { authFetch } from "./authFetch";

const API_BASE_URL = "http://localhost:3000/api";

// Lấy tất cả ảnh sản phẩm
export const getAllProductImages = async () => {
  const res = await fetch(`${API_BASE_URL}/product-variant-images`);
  if (!res.ok) throw new Error("Không lấy được danh sách ảnh sản phẩm");
  return res.json();
};

// Tạo ảnh sản phẩm mới (POST)
// export const createProductImage = async (formData, productVariantId) => {
//   if (
//     typeof productVariantId !== "undefined" &&
//     productVariantId !== null &&
//     productVariantId !== ""
//   ) {
//     formData.append("productVariantId", String(productVariantId));
//   }
//   const res = await authFetch(`${API_BASE_URL}/product-variant-images`, {
//     method: "POST",
//     body: formData,
//   });
//   if (!res.ok) throw new Error("Không tạo được ảnh sản phẩm");
//   return res.json();
// };

export const createProductVariantImages = async ({ productVariantId, images, thumbnail }) => {
  const res = await authFetch(`${API_BASE_URL}/product-variant-images/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productVariantId, images, thumbnail }),
  });
  if (!res.ok) throw new Error("Không lưu được ảnh biến thể");
  return res.json();
};


export const createProductImage = async (formData, productVariantId) => {
  let url = `${API_BASE_URL}/product-variant-images/upload-temp`;
  // Nếu có productVariantId thì gọi endpoint lưu DB
  if (
    typeof productVariantId !== "undefined" &&
    productVariantId !== null &&
    productVariantId !== ""
  ) {
    formData.append("productVariantId", String(productVariantId));
    url = `${API_BASE_URL}/product-variant-images`;
  }
  const res = await authFetch(url, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Không tạo được ảnh sản phẩm");
  return res.json();
};

// Cập nhật ảnh sản phẩm (PUT)
export const updateProductImage = async (id, data) => {
  const res = await authFetch(`${API_BASE_URL}/product-variant-images/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không cập nhật được ảnh sản phẩm");
  return res.json();
};

// Xoá ảnh sản phẩm (DELETE)
export const deleteProductImage = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/product-variant-images/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Không xoá được ảnh sản phẩm");
  return res.json();
};

// Lấy ảnh sản phẩm theo ID
export const getProductImageById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/product-variant-images/${id}`);
  if (!res.ok) throw new Error("Không lấy được ảnh sản phẩm");
  return res.json();
};

// Lấy tất cả ảnh theo variantId
export const getImagesByVariantId = async (variantId) => {
  const res = await fetch(
    `${API_BASE_URL}/product-variant-images/variant/${variantId}`
  );
  if (!res.ok) throw new Error("Không lấy được danh sách ảnh của biến thể");
  return res.json();
};

// Đặt ảnh chính
export const setThumbnailImage = async ({ variantId, imageId }) => {
  const res = await authFetch(
    `${API_BASE_URL}/product-variant-images/set-thumbnail`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variantId, imageId }),
    }
  );
  if (!res.ok) throw new Error("Không đặt được ảnh chính");
  return res.json();
};
