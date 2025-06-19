import { authFetch } from "./authFetch";

const API_BASE_URL = "http://localhost:3000/api";

// Lấy tất cả người dùng
export const getAllUsers = async () => {
    const res = await fetch(`${API_BASE_URL}/users`);
    if (!res.ok) throw new Error('Không lấy được danh sách người dùng');
    return res.json();
}

// Update người dùng
export const updateUser = async (id, user) => {
    const res = await authFetch(`${API_BASE_URL}/users/${id}`,
        {
            method: "PUT",
            body: JSON.stringify(user)
        }
    );
    if (!res.ok) throw new Error('Có lỗi khi cập nhật');
    return res.json();
}

export const getUserById = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/users/${id}`);
    if (!res.ok) throw new Error('Không lấy được thông tin người dùng');
    return res.json();
};

// Xoá người dùng
export const deletedUser = async (id) => {
    const res = await authFetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
    })
    if (!res.ok) throw new Error("Có lỗi khi xoá");
    return res.json();
}