import React, { useEffect, useContext } from "react";
import { useCartStore } from "../../stores/cartStore";
import { Link } from "react-router-dom";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { UserContext } from "../../stores/UserContext";

const Cart = () => {
  const { user } = useContext(UserContext);
  const user_id = user?.id;
  const {
    items,
    loading,
    error,
    fetchCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
    getTotalAfterDiscount,
    getTotalDiscount,
  } = useCartStore();

  useEffect(() => {
    if (user_id) fetchCart(user_id);
  }, [user_id, fetchCart]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn trống</h2>
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const handleUpdate = (cart_item_id, new_quantity) => {
    updateQuantity(user_id, cart_item_id, new_quantity);
  };

  const handleRemove = (cart_item_id) => {
    removeItem(user_id, cart_item_id);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ hàng</h1>
      <div className="grid grid-cols-1 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.imageUrl}
                alt={item.variant_name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h3 className="font-semibold">{item.variant_name}</h3>
                <p className="text-gray-600">{item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleUpdate(item.id, Math.max(1, item.quantity - 1))
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FaMinus />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <FaPlus />
                </button>
              </div>
              <button
                onClick={() => handleRemove(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg">Tổng tiền hàng (giá gốc):</span>
          <span className="text-lg">{getTotalPrice().toFixed(2)}</span>
        </div>
        {getTotalDiscount() > 0 && (
          <>
            <div className="flex justify-between items-center mb-2 text-green-600">
              <span>Tổng tiền giảm giá:</span>
              <span>-{getTotalDiscount().toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center mb-2 text-green-600">
              <span>Tỷ lệ giảm giá:</span>
              <span>{((getTotalDiscount() / getTotalPrice()) * 100).toFixed(1)}%</span>
            </div>
          </>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-xl font-semibold">Số tiền phải trả:</span>
          <span className="text-xl font-bold text-blue-600">
            {getTotalAfterDiscount().toFixed(2)}
          </span>
        </div>
        <div className="flex justify-end space-x-4">
          <Link
            to="/"
            className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/checkout"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
