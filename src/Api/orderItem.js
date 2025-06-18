import { authFetch } from "./authFetch";
const API_BASE_URL = 'http://localhost:3000/api' 

export const getOrderItemByOrderId = async (orderId) => {
    const res = await authFetch(`${API_BASE_URL}/order-items/${orderId}`);
    if (!res.ok) throw new Error('Không lấy được danh sách orderItem theo orderId')
    return res.json()
}