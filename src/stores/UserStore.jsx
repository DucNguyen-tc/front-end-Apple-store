import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // Lấy user từ localStorage
  loadUserFromLocalStorage: () => {
    set({ loading: true, error: null });
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        set({ user, loading: false });
        return user;
      } else {
        set({ user: null, loading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, loading: false });
      return null;
    }
  },

  // Đổi tên và số điện thoại (cập nhật đúng object)
  updateInfo: (info) => {
    set((state) => {
      const updated = { ...state.user, ...info };
      localStorage.setItem('user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  // Đổi email (cập nhật đúng object)
  updateEmail: (email) => {
    set((state) => {
      const updated = { ...state.user, email };
      localStorage.setItem('user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  // Đổi mật khẩu (không thực hiện gì với localStorage, chỉ mô phỏng)
  changePassword: () => {
    // Không lưu mật khẩu trong localStorage vì lý do bảo mật
    return true;
  },

  // Đặt lại user (logout)
  clearUser: () => {
    localStorage.removeItem('user');
    set({ user: null, error: null, loading: false });
  },
}));
