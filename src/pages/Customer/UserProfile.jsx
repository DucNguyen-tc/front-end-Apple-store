import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../stores/UserContext";
import { useUserStore } from "../../stores/UserStore";
import { updateUser } from "../../Api/userApi";

export default function UserProfile() {
  const { user, setUser } = useContext(UserContext);
  const {
    updateInfo,
    updateEmail,
    loading,
    error,
    loadUserFromLocalStorage,
  } = useUserStore();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [emailError, setEmailError] = useState("");

  // Khi component mount, nếu user chưa có thì lấy từ localStorage
  useEffect(() => {
    if (!user) {
      loadUserFromLocalStorage();
    }
    console.log("User hiện tại trong context:", user);
  }, [user, loadUserFromLocalStorage]);

  // Khi user thay đổi, đồng bộ lại form
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || user.full_name || "",
        phone: user.phone || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Đổi họ tên, số điện thoại
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Kiểm tra định dạng email khi nhập
  const handleEmailInput = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, email: value }));
    // Regex kiểm tra email
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("Chưa đúng định dạng email");
    } else {
      setEmailError("");
    }
  };

  // Lưu thông tin (họ tên, SĐT)
  const handleSaveInfo = async () => {
    if (!form.fullName || !form.phone) {
      setMessage("❌ Vui lòng nhập đầy đủ họ tên và số điện thoại.");
      return;
    }
    try {
      // Tạo object đủ 5 trường, isActive luôn là 1
      const userUpdate = {
        fullName: form.fullName,
        email: user.email,
        phone: form.phone,
        role: user.role,
         isActive: 1,
      };
      await updateUser(user.id, userUpdate);
      updateInfo({ fullName: form.fullName, phone: form.phone });
      setUser({ ...user, ...userUpdate });
      setMessage("✅ Cập nhật thông tin thành công!");
    } catch {
      setMessage("❌ Có lỗi khi cập nhật.");
    }
  };

  // Đổi email (không cần nhập mật khẩu)
  const handleChangeEmail = async () => {
    if (!form.email) {
      setMessage("❌ Vui lòng nhập email mới.");
      return;
    }
    // Kiểm tra lại định dạng email trước khi gửi
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(form.email)) {
      setEmailError("Chưa đúng định dạng email");
      setMessage("");
      return;
    }
    try {
      // Tạo object đủ 5 trường, isActive luôn là 1
      const userUpdate = {
        fullName: user.fullName || user.full_name || "",
        email: form.email,
        phone: user.phone,
        role: user.role,
        isActive: 1,
      };
      await updateUser(user.id, userUpdate);
      updateEmail(form.email);
      setUser({ ...user, ...userUpdate });
      setMessage("✅ Đổi email thành công!");
    } catch {
      setMessage("❌ Có lỗi khi đổi email.");
    }
  };

  // // Đổi mật khẩu (cần nhập mật khẩu cũ và mới)
  // const handleChangePassword = async () => {
  //   if (!oldPassword || !newPassword) {
  //     setMessage("❌ Vui lòng nhập đủ mật khẩu cũ và mới.");
  //     return;
  //   }
  //   try {
  //     await updateUser(user.id, { oldPassword, newPassword });
  //     changePassword(); // chỉ mô phỏng local
  //     setMessage("✅ Mật khẩu đã được đổi.");
  //     setOldPassword("");
  //     setNewPassword("");
  //   } catch {
  //     setMessage("❌ Mật khẩu cũ không đúng hoặc lỗi.");
  //   }
  // };

  // Ẩn message sau 2 giây
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Ẩn emailError sau 2 giây
  useEffect(() => {
    if (emailError) {
      const timer = setTimeout(() => setEmailError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [emailError]);

  if (loading) return <div className="text-center py-10">Đang tải...</div>;
  if (!user)
    return (
      <div className="text-center py-10 text-red-500">
        Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl space-y-6">
      <h2 className="text-2xl font-bold text-center">Trang cá nhân của bạn</h2>

      {/* Đổi họ tên, số điện thoại */}
      <div className="space-y-3">
        <label className="block">
          Họ tên:
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="input"
          />
        </label>
        <label className="block">
          SĐT:
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="input"
          />
        </label>
        <button
          onClick={handleSaveInfo}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Lưu thông tin
        </button>
      </div>

      {/* Đổi email */}
      <div className="space-y-3 pt-4 border-t">
        <label className="block">
          Email hiện tại:
          <input
            value={user && user.email ? user.email : "Chưa có email"}
            className="input bg-gray-100 text-black"
            size={form.email.length > 0 ? form.email.length + 2 : 12}
            style={{ minWidth: '150px', maxWidth: '100%' }}
            disabled
          />
        </label>
        <label className="block">
          Email mới:
          <input
            name="email"
            value={form.email}
            onChange={handleEmailInput}
            className="input"
            size={form.email.length > 0 ? form.email.length + 2 : 12}
            style={{ minWidth: '150px', maxWidth: '100%' }}
          />
          {emailError && (
            <span className="text-red-500 text-xs">{emailError}</span>
          )}
        </label>
        <button
          onClick={handleChangeEmail}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Đổi Email
        </button>
      </div>

      {/* Đổi mật khẩu */}
      {/* <div className="space-y-3 pt-4 border-t">
        <label className="block">
          Mật khẩu hiện tại:
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="input"
          />
        </label>
        <label className="block">
          Mật khẩu mới:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="input"
          />
        </label>
        <button
          onClick={handleChangePassword}
          className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
        >
          Đổi mật khẩu
        </button>
      </div> */}

      {message && (
        <p className="text-center text-sm text-blue-500 mt-4">{message}</p>
      )}
      {error && (
        <p className="text-center text-sm text-red-500 mt-2">{error}</p>
      )}
    </div>
  );
}
