import { authFetch } from './authFetch';

const BASE_URL = 'http://localhost:4000/api/cart-items';

export const cartApi = {
    // Lấy giỏ hàng của user
    getCart: async (user_id) => {
        const response = await authFetch(`${BASE_URL}/user/${user_id}`);
        return response.json();
    },

    // Thêm sản phẩm vào giỏ
    addToCart: async (user_id, product_variant_id, quantity = 1) => {
        const response = await authFetch(`${BASE_URL}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, product_variant_id, quantity }),
        });
        return response.json();
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateCartItem: async (cart_item_id, quantity) => {
        const response = await authFetch(`${BASE_URL}/${cart_item_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity }),
        });
        return response.json();
    },

    // Xóa một sản phẩm khỏi giỏ
    removeFromCart: async (cart_item_id) => {
        const response = await authFetch(`${BASE_URL}/${cart_item_id}`, {
            method: 'DELETE',
        });
        return response.json();
    },

    // Xóa toàn bộ giỏ hàng của user
    clearCart: async (user_id) => {
        const response = await authFetch(`${BASE_URL}/user/${user_id}`, {
            method: 'DELETE',
        });
        return response.json();
    },
};