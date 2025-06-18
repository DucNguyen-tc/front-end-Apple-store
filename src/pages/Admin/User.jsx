import { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
  Switch,
} from "antd";
import { getAllUsers, updateUser, deletedUser } from "../../Api/userApi";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { UserContext } from "../../stores/UserContext";

// src/pages/admin/Users.jsx
export default function Users() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingUser, setEditingUser] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        message.error("Không thể tải danh mục người dùng");
      }
    };
    fetchUsers();
  }, []);

  const openModal = (selectedUser = null) => {
    setEditingUser(selectedUser);
    if (selectedUser && selectedUser.id === user.id && user.role === "ADMIN") {
      form.setFieldsValue({ ...selectedUser, role: undefined }); // Không set role
    } else {
      form.setFieldsValue(selectedUser || {});
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setEditingUser(null);
    form.resetFields();
    setIsModalOpen(false);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        if (editingUser) {
          try {
            await updateUser(editingUser.id, values);
            const updated = users.map((cat) =>
              cat.id === editingUser.id ? { ...cat, ...values } : cat
            );
            setUsers(updated);
            message.success("Cập nhật người dùng thành công");
          } catch (error) {
            message.error("Không thể cập nhật người dùng");
          }
        }
        setIsModalOpen(false);
        setEditingUser(null);
        form.resetFields();
      })
      .catch(() => {});
  };

  const deleteUser = async (id) => {
    if (id === user.id && user.role === "ADMIN") {
      message.error("Chưa thấy ai tự xoá mình bao giờ");
      return;
    }
    try {
      await deletedUser(id);
      setUsers(users.filter((cat) => cat.id !== id));
      message.success("Xoá người dùng thành công");
    } catch (error) {
      message.error("Không thể xoá người dùng này");
    }
  };

  const columns = [
    {
      title: "Tên người dùng",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hoạt động",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) =>
        active ? (
          <span className="text-green-600">Đang hoạt động</span>
        ) : (
          <span className="text-gray-400">Ngừng hoạt động</span>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined></EditOutlined>}
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá danh mục này?"
            onConfirm={() => deleteUser(record.id)}
            okText="Xoá"
            cancelText="Huỷ"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="hover:bg-red-600 text-white bg-red-500"
            >
              Xoá
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold mb-4">Quản lý Người dùng</h2>
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title="Cập nhật danh mục"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên người dùng"
            name="fullName"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Hoạt động"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Đang hoạt động"
              unCheckedChildren="Ngừng hoạt động"
            />
          </Form.Item>
          <Form.Item label="Vai trò" name="role">
            <Select
              placeholder="Chọn vai trò"
              disabled={editingUser?.id === user.id && user.role === "ADMIN"}
            >
              <Select.Option value="CUSTOMER">CUSTOMER</Select.Option>
              <Select.Option value="ADMIN">ADMIN</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
