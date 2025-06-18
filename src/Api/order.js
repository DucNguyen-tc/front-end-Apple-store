import { authFetch } from "./authFetch";
const API_BASE_URL = 'http://localhost:4000/api' 

export const getAllOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Không lấy được danh sách đơn hàng')
    return res.json()
}

// Tạo đơn hàng từ giỏ hàng
export const createOrderFromCart = async (orderData) => {
    console.log(orderData);
    const res = await authFetch(`${API_BASE_URL}/orders/from-cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Không thể tạo đơn hàng');
    }
    
    return res.json();
};

// Tạo đơn hàng mới
export const createOrder = async (orderData) => {
    const res = await authFetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
    });
    
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Không thể tạo đơn hàng');
    }
    
    return res.json();
};

export const orderApi = {
    getAllOrders,
    createOrderFromCart,
    createOrder
};