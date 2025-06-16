import { useState, useEffect } from "react";
import { Table, Tag, Button, Modal, Descriptions, message, Input } from "antd";
import { getAllOrders } from "../../Api/order";
import { getOrderItemByOrderId } from "../../Api/orderItem";

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders();
        setOrders(data);
      } catch (error) {
        message.error("Không thể tải danh sách đơn hàng");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const showDetails = async (order) => {
    try {
      setSelectedOrder(order);
      const items = await getOrderItemByOrderId(order.id);
      setOrderItems(items);
      setDetailVisible(true);
    } catch {
      message.error("Không thể tải chi tiết đơn hàng");
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.phone_number?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Khách hàng", dataIndex: "user_name" },
    { title: "Số điện thoại", dataIndex: "phone_number" },
    {
      title: "Ngày đặt",
      dataIndex: "order_date",
      render: (date) =>
        new Date(date).toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      render: (amount) =>
        Number(amount).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) +
        "đ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "completed" ? "green" : "blue"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button onClick={() => showDetails(record)}>Xem chi tiết</Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng</h2>
      <Input.Search
        placeholder="Tìm theo số điện thoại..."
        allowClear
        onChange={(e) => setSearchText(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id"
        loading={loading}
      />
      <Modal
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
      >
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Tên khách hàng">
            {selectedOrder?.user_name}
          </Descriptions.Item>
          <Descriptions.Item label="Địa chỉ giao hàng">
            {selectedOrder?.shipping_address}
          </Descriptions.Item>
          <Descriptions.Item label="Phương thức thanh toán">
            {selectedOrder?.payment_method}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag
              color={selectedOrder?.status === "completed" ? "green" : "blue"}
            >
              {selectedOrder?.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Sản phẩm:</h3>
          <Table
            dataSource={orderItems}
            rowKey="id"
            size="small"
            pagination={false}
            columns={[
              { title: "Tên", dataIndex: "variant_name" },
              { title: "Số lượng", dataIndex: "quantity" },
              {
                title: "Giá mua",
                dataIndex: "price_at_purchase",
                render: (amount) =>
                  Number(amount).toLocaleString("vi-VN", {
                    minimumFractionDigits: 0,
                  }) + "đ",
              },
            ]}
          />
        </div>
      </Modal>
    </div>
  );
}
