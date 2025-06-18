import { useEffect, useContext } from "react";
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
  } = useCartStore();

  useEffect(() => {
    if (user_id) fetchCart(user_id);
  }, [user_id]);

  // Log giá trị items để kiểm tra
  useEffect(() => {
    console.log('Cart items:', items);
  }, [items]);

  const handleUpdate = (cart_item_id, new_quantity) => {
    updateQuantity(user_id, cart_item_id, new_quantity);
  };

  const handleRemove = (cart_item_id) => {
    removeItem(user_id, cart_item_id);
  };

  if (loading) return <div className="text-center py-20">Đang tải...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (items.length === 0)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Giỏ hàng của bạn trống</h2>
        <Link to="/" className="text-blue-600 underline">
          Tiếp tục mua sắm
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Giỏ hàng của bạn</h1>
      <div className="space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col md:flex-row items-center justify-between border-b pb-4 gap-4"
          >
            <div className="flex items-center gap-4 w-full md:w-auto">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-contain rounded-xl shadow"
              />
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-500 text-sm">{item.color} – {item.storage_capacity}</p>
                <p className="text-red-600 font-semibold text-base">
                  {item.price.toLocaleString()}₫
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded px-2">
                <button
                  onClick={() => handleUpdate(item.id, Math.max(1, item.quantity - 1))}
                  className="p-2 hover:bg-gray-200"
                >
                  <FaMinus size={12} />
                </button>
                <span className="px-3">{item.quantity}</span>
                <button
                  onClick={() => handleUpdate(item.id, item.quantity + 1)}
                  className="p-2 hover:bg-gray-200"
                >
                  <FaPlus size={12} />
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

      <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xl font-medium">
         {/* tính tổng giá trị giỏ hàng */}
          Tổng cộng:{" "}
          <span className="text-red-600 font-bold text-2xl">
            {getTotalPrice().toLocaleString()}₫
          </span>
        </div>
        {/* các nút  */}
        <div className="flex gap-4">
          <Link
            to="/"
            className="px-5 py-2 border border-gray-300 rounded hover:bg-gray-100"
          >
            Tiếp tục mua sắm
          </Link>
          <Link
            to="/checkout"
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
