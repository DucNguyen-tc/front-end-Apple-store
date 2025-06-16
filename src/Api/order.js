import { authFetch } from "./authFetch";
const API_BASE_URL = 'http://localhost:3000/api' 

export const getAllOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error('Không lấy được danh sách đơn hàng')
    return res.json()
}