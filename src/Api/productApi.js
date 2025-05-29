import { authFetch } from "./authFetch";

const API_BASE_URL = 'http://localhost:3000/api' 


// Lấy tất cả sản phẩm
export const getAllProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`)
  if (!res.ok) throw new Error('Không lấy được danh sách sản phẩm')
  return res.json()
}

// Lấy chi tiết sản phẩm
export const getProductById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!res.ok) throw new Error('Không lấy được chi tiết sản phẩm')
  return res.json()
}

// Thêm sản phẩm (POST)
export const createProduct = async (data) => {
  const res = await authFetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Không thêm được sản phẩm')
  return res.json()
}

// Cập nhật sản phẩm (PUT)
export const updateProduct = async (id, data) => {
  const res = await authFetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Không cập nhật được sản phẩm')
  return res.json()
}

// Xoá sản phẩm (DELETE)
export const deleteProduct = async (id) => {
  const res = await authFetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  })
  console.log(res)
  if (!res.ok) throw new Error('Không xoá được sản phẩm')
  return res.json()
}
