import React, { useEffect, useState } from "react";
import { Card, Spin, Empty, Form, Input, Button, message, Modal } from "antd";
import {
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Modal as AntdModal } from "antd"; // Để tránh trùng tên với Modal của form
import {
  getAllStores,
  createStore,
  updateStore,
  deleteStore,
} from "../../Api/storeApi"; // Thêm dòng này

const { Meta } = Card;

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const data = await getAllStores();
        setStores(data);
      } catch (error) {
        message.error("Lỗi lấy dữ liệu cửa hàng!");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  // Mở modal thêm/sửa cửa hàng
  const openModal = (store = null) => {
    if (store) {
      form.setFieldsValue(store);
      setEditingStore(store);
    } else {
      form.resetFields();
      setEditingStore(null);
    }
    setIsModalOpen(true);
  };

  // Đóng modal
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingStore(null);
  };

  // Thêm hoặc cập nhật cửa hàng
  const handleAddOrEditStore = async () => {
    try {
      const values = await form.validateFields();
      if (editingStore) {
        // Sửa
        try {
          await updateStore(editingStore.id, values);
          // Lấy lại danh sách mới nhất từ server
          const data = await getAllStores();
          setStores(data);
          message.success("Đã cập nhật cửa hàng!");
        } catch {
          message.error("Không thể cập nhật cửa hàng!");
        }
      } else {
        // Thêm mới
        try {
          await createStore(values);
          // Lấy lại danh sách mới nhất từ server
          const data = await getAllStores();
          setStores(data);
          message.success("Đã thêm cửa hàng mới!");
        } catch {
          message.error("Không thể thêm cửa hàng!");
        }
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingStore(null);
    } catch {
      // validation error
    }
  };

  // Xoá cửa hàng
  const handleDeleteStore = (id) => {
    AntdModal.confirm({
      title: "Bạn có chắc muốn xoá cửa hàng này?",
      icon: <ExclamationCircleOutlined />,
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      async onOk() {
        try {
          await deleteStore(id);
          // Lấy lại danh sách mới nhất từ server
          const data = await getAllStores();
          setStores(data);
          message.success("Đã xoá cửa hàng!");
        } catch {
          message.error("Không thể xoá cửa hàng!");
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Danh sách cửa hàng
      </h2>

      {/* Nút thêm cửa hàng */}
      <div className="mb-8">
        <Button
          type="primary"
          className="bg-green-500"
          onClick={() => openModal()}
        >
          Thêm cửa hàng
        </Button>
      </div>

      {/* Modal form thêm/sửa cửa hàng */}
      <Modal
        title={editingStore ? "Sửa cửa hàng" : "Thêm cửa hàng mới"}
        open={isModalOpen}
        onOk={handleAddOrEditStore}
        onCancel={handleCancel}
        okText={editingStore ? "Lưu" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên cửa hàng"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên cửa hàng" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giờ mở cửa"
            name="opening_hours"
            rules={[{ required: true, message: "Vui lòng nhập giờ mở cửa" }]}
          >
            <Input placeholder="Ví dụ: 9:00 - 21:00" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Danh sách cửa hàng */}
      {stores.length === 0 ? (
        <Empty description="Không có cửa hàng nào." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              hoverable
              className="rounded-2xl shadow-md border border-gray-100"
              title={
                <span className="font-semibold text-lg text-indigo-700">
                  {store.name}
                </span>
              }
              actions={[
                <Button
                  key="edit"
                  type="link"
                  onClick={() => openModal(store)}
                  icon={<EditOutlined />}
                >
                  Sửa
                </Button>,
                <Button
                  key="delete"
                  type="link"
                  danger
                  onClick={() => handleDeleteStore(store.id)}
                  icon={<ExclamationCircleOutlined />}
                >
                  Xoá
                </Button>,
              ]}
            >
              <div className="text-gray-600 mb-2">
                <EnvironmentOutlined className="mr-2 text-indigo-500" />
                {store.address}, {store.city}
              </div>
              <div className="text-gray-600 mb-2">
                <PhoneOutlined className="mr-2 text-green-500" />
                {store.phone}
              </div>
              <div className="text-gray-600">
                <ClockCircleOutlined className="mr-2 text-orange-500" />
                {store.opening_hours}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
