import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Switch,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  getAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from "../../Api/promotionApi";
import dayjs from "dayjs";

const { Option } = Select;

export default function Promotion() {
  const [promotions, setPromotions] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingPromotion, setEditingPromotion] = useState(null);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const data = await getAllPromotions();
      setPromotions(data);
    } catch (error) {
      message.error("Không thể tải mã giảm giá!");
    }
  };

  const openModal = (promotion = null) => {
    setEditingPromotion(promotion);
    form.setFieldsValue(
      promotion
        ? {
            ...promotion,
            start_date: promotion.start_date
              ? dayjs(promotion.start_date)
              : null,
            end_date: promotion.end_date ? dayjs(promotion.end_date) : null,
          }
        : {}
    );
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        const payload = {
          ...values,
          start_date: values.start_date?.format("YYYY-MM-DD HH:mm:ss"),
          end_date: values.end_date?.format("YYYY-MM-DD HH:mm:ss"),
        };
        if (editingPromotion) {
          try {
            await updatePromotion(editingPromotion.id, payload);
            await fetchPromotions();
            message.success("Cập nhật mã giảm giá thành công!");
          } catch {
            message.error("Không thể cập nhật mã giảm giá!");
          }
        } else {
          try {
            console.log("payload", payload);
            await createPromotion(payload);
            await fetchPromotions();
            message.success("Thêm mã giảm giá thành công!");
          } catch {
            message.error("Không thể thêm mã giảm giá!");
          }
        }
        setIsModalOpen(false);
        setEditingPromotion(null);
        form.resetFields();
      })
      .catch(() => {});
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setEditingPromotion(null);
  };

  const handleDelete = async (id) => {
    try {
      await deletePromotion(id);
      await fetchPromotions();
      message.success("Xoá mã giảm giá thành công!");
    } catch {
      message.error("Không thể xoá mã giảm giá!");
    }
  };

  const columns = [
    {
      title: "Tên mã giảm giá",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Giá trị",
      dataIndex: "discount_value",
      key: "discount_value",
      render: (value, record) => {
        if (record.type === "percentage") {
          return value ? `${value}%` : "";
        }
        // Nếu value là số thì dùng toLocaleString, nếu không thì trả về ""
        return typeof value === "number"
          ? `${value.toLocaleString()}₫`
          : value
          ? `${Number(value).toLocaleString()}₫`
          : "";
      },
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      render: (type) => (type === "percentage" ? "Phần trăm" : "Số tiền"),
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "start_date",
      key: "start_date",
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Ngày kết thúc",
      dataIndex: "end_date",
      key: "end_date",
      render: (val) => (val ? dayjs(val).format("YYYY-MM-DD HH:mm:ss") : ""),
    },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      key: "isActive",
      render: (active) =>
        active ? (
          <span className="text-green-600">Đang áp dụng</span>
        ) : (
          <span className="text-gray-400">Ngừng áp dụng</span>
        ),
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
            title="Xoá mã giảm giá này?"
            onConfirm={() => handleDelete(record.id)}
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
        <h2 className="text-2xl font-bold">Quản lý Mã giảm giá</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-green-500"
          onClick={() => openModal()}
        >
          Thêm mã giảm giá
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={promotions}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingPromotion ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Tên mã giảm giá"
            name="name"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item
            label="Giá trị"
            name="discount_value"
            rules={[{ required: true, message: "Không được để trống" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>
          <Form.Item
            label="Loại giảm"
            name="type"
            rules={[{ required: true, message: "Chọn loại giảm" }]}
          >
            <Select placeholder="Chọn loại giảm">
              <Option value="percentage">Phần trăm (%)</Option>
              <Option value="flat_discount">Số tiền (VNĐ)</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày bắt đầu"
            name="start_date"
            rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ format: "HH:mm:ss" }}
            />
          </Form.Item>
          <Form.Item
            label="Ngày kết thúc"
            name="end_date"
            rules={[{ required: true, message: "Chọn ngày kết thúc" }]}
          >
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD HH:mm:ss"
              showTime={{ format: "HH:mm:ss" }}
            />
          </Form.Item>
          <Form.Item
            label="Kích hoạt"
            name="isActive"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="Đang áp dụng"
              unCheckedChildren="Ngừng áp dụng"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
