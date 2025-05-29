import { refreshAccessToken } from "./authApi";

export const authFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("accessToken");
  const isFormData = options.body instanceof FormData;
  options.headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${accessToken}`,
    // Chỉ set Content-Type nếu không phải FormData
    ...(isFormData
      ? {}
      : {
          "Content-Type":
            options.headers?.["Content-Type"] || "application/json",
        }),
  };

  let res = await fetch(url, options);

  // Nếu token hết hạn, tự động refresh và thử lại 1 lần
  if (res.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      res = await fetch(url, options);
    } catch (err) {
      throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
    }
  }

  return res;
};
