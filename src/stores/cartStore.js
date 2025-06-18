import { create } from 'zustand';
import { cartApi } from '../Api/cartApi';

export const useCartStore = create((set, get) => ({
    items: [],
    loading: false,
    error: null,

    // Lấy giỏ hàng của user
    fetchCart: async (user_id) => {
        set({ loading: true, error: null });
        try {
            const response = await cartApi.getCart(user_id);
            set({ items: response, loading: false });
            console.log(response);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Thêm sản phẩm vào giỏ
    addItem: async (user_id, product_variant_id, quantity = 1) => {
        set({ loading: true, error: null });
        try {
            await cartApi.addToCart(user_id, product_variant_id, quantity);
            // Sau khi thêm, fetch lại giỏ hàng
            await get().fetchCart(user_id);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Cập nhật số lượng sản phẩm trong giỏ
    updateQuantity: async (user_id, cart_item_id, quantity) => {
        set({ loading: true, error: null });
        try {
            await cartApi.updateCartItem(cart_item_id, quantity);
            await get().fetchCart(user_id);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Xóa một sản phẩm khỏi giỏ
    removeItem: async (user_id, cart_item_id) => {
        set({ loading: true, error: null });
        try {
            await cartApi.removeFromCart(cart_item_id);
            await get().fetchCart(user_id);
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Xóa toàn bộ giỏ hàng của user
    clearCart: async (user_id) => {
        set({ loading: true, error: null });
        try {
            await cartApi.clearCart(user_id);
            set({ items: [], loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    // Tổng số lượng sản phẩm
    getTotalItems: () => {
        return get().items.reduce((total, item) => total + (item.quantity || 0), 0);
    },

    // Tổng giá trị giỏ hàng (giá gốc)
    getTotalPrice: () => {
        return get().items.reduce(
            (total, item) => total + (item.price || 0) * (item.quantity || 0),
            0
        );
    },

    // Tổng giá trị sau giảm giá
    getTotalAfterDiscount: () => {
        return get().items.reduce((total, item) => {
            const finalPrice = item.final_price || item.price;
            return total + (finalPrice * item.quantity);
        }, 0);
    },

    // Tổng tiền giảm giá
    getTotalDiscount: () => {
        return get().items.reduce((total, item) => {
            const discount = item.total_discount || 0;
            return total + (discount * item.quantity);
        }, 0);
    },

  
})); 