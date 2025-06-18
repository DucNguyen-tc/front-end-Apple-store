import { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllProductCategories,
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "../../Api/productCategoryApi";

export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllProductCategories();
        setCategories(data);
      } catch (error) {
        message.error("Không thể tải danh mục sản phẩm!");
      }
    };
    fetchCategories();
  }, []);

  const openModal = (category = null) => {
    setEditingCategory(category);
    form.setFieldsValue(category || {});
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        // Kiểm tra tên danh mục đã tồn tại chưa (không phân biệt hoa thường)
        const nameExists = categories.some(
          (cat) =>
            cat.name.trim().toLowerCase() ===
              values.name.trim().toLowerCase() &&
            (!editingCategory || cat.id !== editingCategory.id)
        );
        if (nameExists) {
          message.error("Tên danh mục đã tồn tại!");
          return;
        }

        if (editingCategory) {
          try {
            await updateProductCategory(editingCategory.id, values);
            const updated = categories.map((cat) =>
              cat.id === editingCategory.id ? { ...cat, ...values } : cat
            );
            setCategories(updated);
            message.success("Cập nhật danh mục thành công!");
          } catch (error) {
            const msg =
              error?.response?.data?.message ||
              error.message ||
              "Không thể cập nhật danh mục sản phẩm!";
            message.error(msg);
          }
        } else {
          try {
            await createProductCategory(values);
            const data = await getAllProductCategories();
            setCategories(data);
            message.success("Thêm danh mục thành công!");
          } catch (error) {
            const msg =
              error?.response?.data?.message ||
              error.message ||
              "Không thể thêm danh mục sản phẩm!";
            message.error(msg);
          }
        }

        setIsModalOpen(false);
        setEditingCategory(null);
        form.resetFields();
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingCategory(null);
  };

  const deleteCategory = async (id) => {
    try {
      await deleteProductCategory(id);
      setCategories(categories.filter((cat) => cat.id !== id));
      message.success("Xoá danh mục thành công!");
    } catch (error) {
      message.error("Không thể xoá danh mục sản phẩm!");
    }
  };

  const columns = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => openModal(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá danh mục này?"
            onConfirm={() => deleteCategory(record.id)}
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
        <h2 className="text-2xl font-bold">Quản lý Danh mục Sản phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-green-500"
          onClick={() => openModal()}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description" rules={[{ required: true, message: "Không được để trống" }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
