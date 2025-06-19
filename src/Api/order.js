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

// Lấy danh sách đơn hàng của user
export const getOrdersByUserId = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE_URL}/orders/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) throw new Error("Không lấy được đơn hàng");
    return res.json();  
};
  
// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (orderId, status) => {
    const accessToken = localStorage.getItem("accessToken");
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
        method: "PUT",
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Không cập nhật được trạng thái");
    return res.json();
};
// Lấy orderItem của order
export const getOrderItemsByOrderId = async (userId, orderId) => {
    const accessToken = localStorage.getItem("accessToken");        
    const res = await fetch(`${API_BASE_URL}/order-items/user/${userId}/${orderId}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    if (!res.ok) throw new Error("Không lấy được orderItem");
    return res.json();
};

export const orderApi = {
    getAllOrders,
    getOrdersByUserId,
    updateOrderStatus,
    createOrderFromCart,
    createOrder,
    getOrderItemsByOrderId
};