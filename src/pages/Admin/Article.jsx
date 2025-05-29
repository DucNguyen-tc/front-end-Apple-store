import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Upload,
  Select,
  message,
  Card,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import dayjs from "dayjs";

const { Option } = Select;

const Article = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [authors, setAuthors] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  // Fetch authors từ backend (giả lập)
  useEffect(() => {
    // Giả sử mày fetch từ API
    setAuthors([
      { id: 1, name: "Admin 1" },
      { id: 2, name: "Admin 2" },
    ]);
  }, []);

  const handleImageUpload = (info) => {
    if (info.file.status === "done") {
      // Giả sử upload thành công, nhận URL từ backend
      const url = info.file.response?.url || "https://dummyimage.com/600x400";
      setImageUrl(url);
      message.success("Tải ảnh lên thành công");
    }
  };

  const onFinish = (values) => {
    const finalData = {
      ...values,
      content,
      image_url: imageUrl,
      published_at: values.published_at.toISOString(),
    };
    console.log("Submit bài viết:", finalData);
    message.success("Đã tạo bài viết!");
  };

  return (
    <Card title="📝 Tạo Bài Viết" className="max-w-4xl mx-auto mt-6 shadow-md">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          published_at: dayjs(),
        }}
      >
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item label="Nội dung">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            className="bg-white"
          />
        </Form.Item>

        <Form.Item label="Ảnh bìa">
          <Upload
            name="image"
            listType="picture"
            maxCount={1}
            action="/api/upload" // URL upload ảnh thực tế
            onChange={handleImageUpload}
          >
            <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
          </Upload>
          {imageUrl && (
            <img
              src={imageUrl}
              alt="preview"
              className="mt-2 rounded-lg shadow w-64"
            />
          )}
        </Form.Item>

        <Form.Item
          label="Ngày đăng"
          name="published_at"
          rules={[{ required: true, message: "Chọn ngày đăng" }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>

        <Form.Item
          label="Tác giả"
          name="author_id"
          rules={[{ required: true, message: "Chọn tác giả" }]}
        >
          <Select placeholder="Chọn tác giả">
            {authors.map((author) => (
              <Option key={author.id} value={author.id}>
                {author.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex gap-4">
            <Button type="primary" htmlType="submit">
              Đăng bài
            </Button>
            <Button htmlType="button" onClick={() => form.resetFields()}>
              Hủy
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default Article;
