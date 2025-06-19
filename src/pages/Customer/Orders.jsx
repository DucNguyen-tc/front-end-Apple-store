import { useEffect, useState, useContext } from "react";
import { UserContext } from "../../stores/UserContext";
import { getOrdersByUserId, updateOrderStatus, getOrderItemsByOrderId } from "../../Api/order";

export default function Orders() {
  const { user } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await getOrdersByUserId(user.id);
        setOrders(data);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    fetchOrders();
  }, [user]);

  const handleReceived = async (orderId) => {
    try {
      await updateOrderStatus(orderId, "delivered");
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "delivered" } : order
        )
      );
    } catch (err) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const handleShowOrderItems = async (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      setOrderItems([]);
      return;
    }
    setLoadingItems(true);
    setExpandedOrderId(orderId);
    try {
      const items = await getOrderItemsByOrderId(user.id, orderId);
      setOrderItems(items);
    } catch (err) {
      setOrderItems([]);
    }
    setLoadingItems(false);
  };

  if (loading) return <div className="text-center py-10 text-lg">Đang tải...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-[#0071e3]">Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <div className="text-center text-gray-500">Không có đơn hàng nào.</div>
      ) : (
        <ul className="space-y-6">
          {orders.map((order) => (
            <li key={order.id} className="border rounded-xl shadow p-6 bg-white">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="font-semibold text-lg text-gray-800">Mã đơn: #{order.id}</div>
                  <div className="text-gray-500 text-sm mt-1">
                    Trạng thái: 
                    <span className={
                      order.status === "pending"
                        ? "ml-2 px-2 py-1 bg-[#eaf6ff] text-[#0071e3] rounded"
                        : "ml-2 px-2 py-1 bg-[#e6f4ea] text-[#1d7f3a] rounded"
                    }>
                      {order.status === "pending" ? "Đang xử lí" : "Đã giao hàng"}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <button
                    className="px-4 py-2 bg-[#f5f5f7] text-[#0071e3] rounded hover:bg-[#eaf6ff] hover:text-[#005bb5] border border-[#eaf6ff] transition"
                    onClick={() => handleShowOrderItems(order.id)}
                  >
                    {expandedOrderId === order.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                  </button>
                  {order.status === "pending" && (
                    <button
                      className="px-4 py-2 bg-[#0071e3] text-white rounded hover:bg-[#005bb5] transition"
                      onClick={() => handleReceived(order.id)}
                    >
                      Đã nhận hàng
                    </button>
                  )}
                  {order.status === "completed" && (
                    <span className="px-4 py-2 bg-[#1d7f3a] text-white rounded">Đã giao hàng</span>
                  )}
                </div>  
              </div>
              {/* Chi tiết sản phẩm trong đơn */}
              {expandedOrderId === order.id && (
                <div className="mt-5 bg-[#f5f5f7] p-4 rounded border">
                  {loadingItems ? (
                    <div className="text-center text-gray-500">Đang tải chi tiết đơn hàng...</div>
                  ) : orderItems.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#eaf6ff]">
                          <th className="py-2 px-2 text-left">Sản phẩm</th>
                          <th className="py-2 px-2 text-center">Số lượng</th>
                    
                        </tr>
                      </thead>
                      <tbody>
                        {orderItems.map((item) => (
                          <tr key={item.id} className="border-b">
                            <td className="py-2 px-2">{item.variant_name}</td>
                            <td className="py-2 px-2 text-center">{item.quantity}</td>
                    
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={2} className="pt-4 text-right font-semibold text-base">
                            Thành tiền:{" "}
                            <span className="text-[#0071e3]">
                              {orderItems.reduce((sum, item) => sum +Number  (item.total_amount || 0), 0).toLocaleString()}₫
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center text-gray-500">Không có sản phẩm nào trong đơn hàng này.</div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}