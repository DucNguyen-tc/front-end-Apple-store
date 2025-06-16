const API_BASE_URL = "http://localhost:4000/api";

// Đăng kí
export const register = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể đăng kí");
  return res.json();
};

// Đăng nhập
export const login = async (data) => {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Không thể đăng nhập");
  return res.json();
};

export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) throw new Error("No refresh token found");

  const res = await fetch("http://localhost:4000/api/auth/refresh-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) throw new Error("Refresh token failed");
  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  return data.accessToken;
};
