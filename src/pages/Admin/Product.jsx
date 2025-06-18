// src/pages/admin/Products.jsx
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../Api/productApi";
import { getAllProductCategories } from "../../Api/productCategoryApi";

const { Option } = Select;

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // State for categories
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        message.error("Không thể tải danh sách sản phẩm!");
      }
    };

    const fetchCategories = async () => {
      try {
        const data = await getAllProductCategories();
        setCategories(data);
      } catch (error) {
        message.error("Không thể tải danh mục sản phẩm!");
      }
    };

    fetchProducts();
    fetchCategories();
  }, []);

  const openModal = (product = null) => {
    setEditingProduct(product);
    // Đảm bảo setFieldsValue đúng key, ưu tiên id
    form.setFieldsValue(
      product
        ? {
            ...product,
            ProductCategory_Id: product.ProductCategory_Id,
            isActive: product.isActive,
          }
        : { isActive: true }
    );
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        // Kiểm tra trùng tên trong cùng danh mục
        const isDuplicate = products.some(
          (p) =>
            p.Name.trim().toLowerCase() === values.Name.trim().toLowerCase() &&
            p.ProductCategory_Id === values.ProductCategory_Id &&
            // Nếu đang sửa thì bỏ qua chính nó
            (editingProduct
              ? (p.id || p.Id) !== (editingProduct.id || editingProduct.Id)
              : true)
        );
        if (isDuplicate) {
          message.error("Tên sản phẩm đã tồn tại trong danh mục này!");
          return;
        }

        if (editingProduct) {
          try {
            // Sử dụng id hoặc Id tuỳ theo dữ liệu trả về từ API, ưu tiên id
            const productId = editingProduct.id || editingProduct.Id;
            const updatedProduct = await updateProduct(productId, values);
            setProducts(
              products.map((p) =>
                (p.id || p.Id) === productId ? updatedProduct : p
              )
            );
            // Lấy lại danh sách mới nhất
            const data = await getAllProducts();
            setProducts(data);
            message.success("Cập nhật sản phẩm thành công!");
          } catch (error) {
            message.error("Không thể cập nhật sản phẩm!");
          }
        } else {
          try {
            await createProduct(values);
            // Sau khi thêm, gọi lại API để lấy danh sách mới nhất
            const data = await getAllProducts();
            setProducts(data);
            message.success("Thêm sản phẩm thành công!");
          } catch (error) {
            message.error("Không thể thêm sản phẩm!");
          }
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingProduct(null);
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => (p.id || p.Id) !== id));
      const data = await getAllProducts();
      setProducts(data);
      message.success("Xoá sản phẩm thành công!");
    } catch (error) {
      message.error("Không thể xoá sản phẩm!");
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "Name",
      key: "Name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Danh mục",
      dataIndex: "ProductCategory_Id",
      key: "ProductCategory_Id",
      filters: categories.map((cat) => ({
        text: cat.name,
        value: cat.id,
      })),
      onFilter: (value, record) => record.ProductCategory_Id === value,
      render: (categoryId) => {
        const category = categories.find((cat) => cat.id === categoryId);
        return category ? category.name : "Không xác định";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá sản phẩm này?"
            // Sử dụng id hoặc Id
            onConfirm={() => handleDelete(record.id || record.Id)}
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
        <h2 className="text-2xl font-bold">Quản lý Sản phẩm</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-green-500"
          onClick={() => openModal()}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey={(record) => record.id || record.Id} // Use id or Id as key
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên sản phẩm"
            name="Name"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="ProductCategory_Id"
            rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((category) => (
                <Option key={category.id} value={category.id}>
                  {" "}
                  {/* Add unique key */}
                  {category.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
