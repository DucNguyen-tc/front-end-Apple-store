import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../stores/cartStore";
import { UserContext } from "../../stores/UserContext";
import { orderApi } from "../../Api/order";
import { FaArrowLeft, FaCreditCard, FaTruck, FaGift } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { items, getTotalPrice, clearCart } = useCartStore();
  
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    email: user?.email || "",
    shippingAddress: "",
    paymentMethod: "COD", // COD hoặc "online"
    note: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect nếu giỏ hàng trống
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.fullName || !formData.phone || !formData.shippingAddress) {
      setError("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        user_id: user.id,
        status: "pending",
        total_amount: getTotalAfterDiscount(), // Sử dụng giá sau giảm
        shipping_address: formData.shippingAddress,
        payment_method: formData.paymentMethod,
        note: formData.note,
        customer_info: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email
        }
      };
      console.log(orderData);

      const result = await orderApi.createOrderFromCart(orderData);
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      await clearCart(user.id);
      
      // Hiển thị thông báo thành công
      alert(`Đặt hàng thành công! Mã đơn hàng: #${result.order_id}`);
      
      // Chuyển về trang chủ
      navigate("/");
      
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra khi đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  // Tính tổng tiền sau giảm giá
  const getTotalAfterDiscount = () => {
    return items.reduce((total, item) => {
      const finalPrice = item.final_price || item.price;
      return total + (finalPrice * item.quantity);
    }, 0);
  };

  // Tính tổng tiền giảm giá
  const getTotalDiscount = () => {
    return items.reduce((total, item) => {
      const discount = item.total_discount || 0;
      return total + (discount * item.quantity);
    }, 0);
  };

  // Tính tổng tiền gốc
  const getTotalOriginalPrice = () => {
    return items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate("/cart")}
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <FaArrowLeft className="mr-2" />
          Quay lại giỏ hàng
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Thông tin đơn hàng */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="bg-gray-50 p-4 rounded-lg">
            {items.map((item) => (
              <div key={item.id} className="py-3 border-b last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.imageUrl || item.thumbnail_url}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 line-through">
                      {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <p className="font-semibold">
                      {((item.final_price || item.price) * item.quantity).toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                </div>
                
                {/* Thông tin khuyến mãi cho từng sản phẩm */}
                {item.total_discount > 0 && (
                  <div className="ml-19 bg-green-50 p-2 rounded border-l-4 border-green-400">
                    <div className="flex items-center text-green-700 text-sm">
                      <FaGift className="mr-1" />
                      <span className="font-medium">Chương trình khuyến mãi:</span>
                    </div>
                    <div className="ml-5 text-sm text-green-600">
                      <p>• Giá gốc: {item.price.toLocaleString('vi-VN')} VNĐ </p>
                      <p>• Giảm giá: -{item.total_discount.toLocaleString('vi-VN')} VNĐ</p>
                      <p>• Giá sau giảm: {(item.final_price || item.price).toLocaleString('vi-VN')} VNĐ</p>
                      {item.promotion_name && (
                        <p>• Tên chương trình: {item.promotion_name}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {/* Tổng kết đơn hàng */}
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-semibold mb-3 text-lg">Tổng kết đơn hàng</h3>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng tiền hàng (giá gốc):</span>
                  <span>{getTotalOriginalPrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
                
                {getTotalDiscount() > 0 && (
                  <>
                    <div className="flex justify-between text-green-600">
                      <span>Tổng tiền giảm giá:</span>
                      <span>-{getTotalDiscount().toLocaleString('vi-VN')} VNĐ</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Hình thức giảm:</span>
                      <span>{((getTotalDiscount() / getTotalOriginalPrice()) * 100)}%</span>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Số tiền phải trả:</span>
                    <span className="text-blue-600">{getTotalAfterDiscount().toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form thanh toán */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Thông tin thanh toán</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border mb-4">
              <h3 className="text-lg font-semibold mb-3">Thông tin khách hàng</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Họ và tên <span className="text-red-500"></span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    readOnly
                    disabled  
                    className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Số điện thoại <span className="text-red-500"></span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    readOnly
                    disabled
                    className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    readOnly
                    disabled
                    className="w-full p-3 border border-gray-300 rounded bg-gray-100 text-gray-700 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Địa chỉ giao hàng <span className="text-red-500">*</span>
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                rows="3"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập địa chỉ giao hàng chi tiết..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Phương thức thanh toán
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="COD"
                    checked={formData.paymentMethod === "COD"}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <FaTruck className="mr-2" />
                  Thanh toán khi nhận hàng (COD)
                </label>
                <label className="flex items-center opacity-50 cursor-not-allowed">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === "online"}
                    onChange={handleInputChange}
                    className="mr-2"
                    disabled
                  />
                  <FaCreditCard className="mr-2" />
                  Thanh toán online (Chưa hỗ trợ)
                </label>
              </div>
            </div>

          

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đặt hàng"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 
