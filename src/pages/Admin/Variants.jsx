import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  message,
  Upload,
  Popconfirm,
  Carousel,
  Descriptions,
} from "antd";
import {
  PlusOutlined,
  StarFilled,
  StarOutlined,
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  getAllVariants,
  createVariant,
  updateVariant,
  deleteVariant,
  getVariantById,
} from "../../Api/variantApi";
import { getAllProducts } from "../../Api/productApi"; // Thêm dòng này
import {
  createProductImage,
  createProductVariantImages,
  getImagesByVariantId,
  deleteProductImageByVariantID,
  deleteProductImage,
  setThumbnailImage,
} from "../../Api/productImageApi";

const { Option } = Select;

export default function ProductVariants() {
  const [variants, setVariants] = useState([]); //Biến thể
  const [products, setProducts] = useState([]); // Sản phẩm
  const [modalOpen, setModalOpen] = useState(false); // Kiểm tra đóng mở form
  const [form] = Form.useForm(); //Form
  const [fileList, setFileList] = useState([]);
  const [autoVariantName, setAutoVariantName] = useState("");
  const [thumbnailIndex, setThumbnailIndex] = useState(null);
  const variantNameEdited = useRef(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [viewingVariant, setViewingVariant] = useState(null);

  useEffect(() => {
    // Fetch sản phẩm từ API
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        console.log(data);
        setProducts(data);
      } catch (err) {
        message.error("Không lấy được danh sách sản phẩm");
      }
    };
    fetchProducts();

    // Fetch biến thể từ API
    const fetchVariants = async () => {
      try {
        const data = await getAllVariants();
        setVariants(data);
      } catch (err) {
        message.error("Không lấy được danh sách biến thể");
      }
    };
    fetchVariants();
  }, []);

  // Khi mở modal, reset trạng thái chỉnh sửa tên biến thể
  const handleAdd = () => {
    setModalOpen(true);
    setTimeout(() => {
      form.resetFields();
    }, 0);
    setFileList([]);
    variantNameEdited.current = false;
    setAutoVariantName("");
    setThumbnailIndex(null);
    setEditingVariant(null);
  };

  // Xử lý khi bấm nút "Sửa"
  const handleEdit = async (variant) => {
    setEditingVariant(variant);
    // Lấy ảnh của biến thể nếu cần
    let images = [];
    try {
      images = await getImagesByVariantId(variant.id);
    } catch {}
    // Map lại fileList cho Upload
    setFileList(
      images.map((img, idx) => {
        // Nếu image_url là đường dẫn tương đối, thêm domain
        console.log(img);
        let imgUrl = img.imageUrl || img.url || "";
        if (imgUrl && !/^https?:\/\//.test(imgUrl)) {
          imgUrl = `http://localhost:3000/${imgUrl.replace(/^\/+/, "")}`;
        }
        return {
          uid: img.id ? String(img.id) : `-${idx}`,
          name: imgUrl,
          status: "done",
          url: imgUrl,
          thumbUrl: imgUrl,
        };
      })
    );
    setThumbnailIndex(
      images.findIndex((img) => img.is_thumbnail || img.isThumbnail)
    );
    form.setFieldsValue({
      ...variant,
      name: variant.name,
      // Nếu cần map lại các trường khác
    });
    setModalOpen(true);
    variantNameEdited.current = true;
  };

  // Theo dõi thay đổi các trường liên quan để tự động cập nhật tên biến thể
  const handleFormValuesChange = (changedValues, allValues) => {
    // Nếu admin đã chỉnh sửa tên biến thể thì không tự động nữa
    console.log(changedValues);
    console.log(allValues);
    if ("name" in changedValues) {
      variantNameEdited.current = true;
      return;
    }
    const { product_id, color, storage_capacity } = allValues;
    if (product_id && color && storage_capacity && !variantNameEdited.current) {
      const productName = products.find((p) => p.Id === product_id)?.Name || "";
      const autoName = `${productName} ${color} ${storage_capacity}`;
      setAutoVariantName(autoName);
      form.setFieldsValue({ name: autoName });
    }
  };

  // Hàm upload ảnh lên server, trả về object ảnh đã upload thành công
  const handleCustomRequest = async ({ file, onSuccess, onError }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      // Pass null as productVariantId for now (since variant not created yet)
      const data = await createProductImage(formData);

      // Giả sử backend trả về { imageUrl: "uploads/abc.jpg" }
      onSuccess({ url: `http://localhost:3000/${data.imageUrl}` }, file);
    } catch (err) {
      onError(err);
      message.error("Tải ảnh lên thất bại");
    }
  };

  // Khi upload xong, cập nhật fileList với url từ server
  const handleUploadChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 10) {
      message.warning("Chỉ được phép tải lên tối đa 10 hình ảnh!");
      return;
    }
    setFileList(
      newFileList.map((file) => {
        // Nếu đã upload thành công thì dùng url từ response
        if (file.response && file.response.url) {
          return {
            ...file,
            url: file.response.url,
            name: file.response.url, // hoặc file.response.id nếu muốn lưu id
          };
        }
        return file;
      })
    );
    // Nếu xóa ảnh chính thì reset thumbnailIndex
    if (
      thumbnailIndex !== null &&
      (!newFileList[thumbnailIndex] ||
        !newFileList.some((f, idx) => idx === thumbnailIndex))
    ) {
      setThumbnailIndex(null);
    }
  };

  // Cập nhật handleFinish để xử lý cập nhật biến thể
  const handleFinish = async (values) => {
    if (fileList.length > 10) {
      message.error("Chỉ được phép tải lên tối đa 10 hình ảnh!");
      return;
    }
    console.log(fileList);
    const productName =
      products.find((p) => p.id === values.product_id)?.Name ||
      products.find((p) => p.Id === values.product_id)?.Name ||
      "";
    const variantName =
      values.name ||
      `${productName} ${values.color} ${values.storage_capacity}`;
    const newVariant = {
      ...values,
      name: variantName,
    };
    try {
      if (editingVariant) {
        // Cập nhật biến thể
        await updateVariant(editingVariant.id, newVariant);

        // Lấy danh sách ảnh cũ từ server
        const oldImages = await getImagesByVariantId(editingVariant.id);
        const oldImageUrls = oldImages.map((img) => img.imageUrl || img.url);
        const newImageUrls = fileList.map((file) => file.url || file.name);

        // Xác định thumbnail mới
        const thumbnailUrl =
          thumbnailIndex !== null && fileList[thumbnailIndex]
            ? fileList[thumbnailIndex].url || fileList[thumbnailIndex].name
            : null;

        // Thumbnail cũ
        const oldThumbnail = oldImages.find(
          (img) => img.is_thumbnail || img.isThumbnail
        );
        const oldThumbnailUrl = oldThumbnail
          ? oldThumbnail.imageUrl || oldThumbnail.url
          : null;

        // Nếu danh sách ảnh hoặc thumbnail thay đổi thì cập nhật lại ảnh
        const isImageChanged =
          oldImageUrls.length !== newImageUrls.length ||
          oldImageUrls.some((url, idx) => url !== newImageUrls[idx]);
        const isThumbnailChanged = oldThumbnailUrl !== thumbnailUrl;

        console.log("thumb", isThumbnailChanged);

        if (isImageChanged || isThumbnailChanged) {
          //Xóa toàn bộ ảnh cũ
          // if (oldImages.length > 0) {
          //   await deleteProductImageByVariantID(editingVariant.id);
          // }
          const deletedImages = oldImages.filter(
            (img) => !newImageUrls.includes(img.imageUrl)
          );
          for (const img of deletedImages) {
            await deleteProductImage(img.id);
          }
          // Lưu lại ảnh mới nếu có
          // if (newImageUrls.length > 0) {
          //   await createProductVariantImages({
          //     productVariantId: editingVariant.id,
          //     images: newImageUrls,
          //     thumbnail: thumbnailUrl,
          //   });
          // }
          const newlyAddedImages = newImageUrls.filter(
            (url) => !oldImageUrls.includes(url)
          );

          if (thumbnailUrl) {
            console.log("Hello", thumbnailUrl);
            console.log("editting", editingVariant.id);
            await setThumbnailImage({
              VariantId: editingVariant.id,
              thumbnailUrl,
            });
          }
          if (newlyAddedImages.length > 0) {
            await createProductVariantImages({
              productVariantId: editingVariant.id,
              images: newlyAddedImages,
              // thumbnail: thumbnailUrl,
            });

            if (thumbnailUrl) {
              await setThumbnailImage({
                productVariantId: editingVariant.id,
                thumbnailUrl,
              });
            }
          }
        }

        message.success("Cập nhật biến thể thành công!");
      } else {
        // Thêm mới
        const variantRes = await createVariant(newVariant);
        const variantId = variantRes.id || variantRes.insertId;
        if (fileList.length > 0) {
          await createProductVariantImages({
            productVariantId: variantId,
            images: fileList.map((file) => file.url || file.name),
            thumbnail:
              thumbnailIndex !== null && fileList[thumbnailIndex]
                ? fileList[thumbnailIndex].url || fileList[thumbnailIndex].name
                : null,
          });
        }
        message.success("Thêm biến thể thành công!");
      }
      setModalOpen(false);
      setEditingVariant(null);
      form.resetFields();

      // Refetch lại danh sách biến thể
      const data = await getAllVariants();
      setVariants(data);
    } catch (err) {
//      message.error(err.message);
      console.error(err)
      message.error(
      err.message ||
    (editingVariant
      ? "Không thể cập nhật biến thể!"
      : "Không thể thêm biến thể mới!")
);
    }
  };

  const handleView = async (variant) => {
    try {
      const images = await getImagesByVariantId(variant.id);
      setViewingVariant({ ...variant, images });
    } catch {
      setViewingVariant({ ...variant, images: [] });
    }
  };

  const DeleteVariant = async (id) => {
    try {
      const image = await getImagesByVariantId(id);
      console.log(image);
      if (image.length > 0) await deleteProductImageByVariantID(id);

      await deleteVariant(id);
      setVariants(variants.filter((cat) => cat.id !== id));
      message.success("Xoá thành công biến thể");
    } catch (error) {
      message.error("Không thể xoá biến thể này");
    }
  };

  const handleRemoveImage = async (file) => {
    // Nếu ảnh có id (tức là ảnh cũ trong DB), thì gọi API xoá luôn
    if (file.uid) {
      try {
        await deleteProductImage(file.uid); // mày đã có API này rồi
        console.log("Hello");
      } catch (err) {
        message.error("Không thể xoá ảnh khỏi server");
        return false; // Ngăn Ant xoá ảnh khỏi fileList nếu backend fail
      }
    }

    // Nếu ảnh hiện là thumbnail → reset thumbnailIndex
    const index = fileList.findIndex((f) => f.uid === file.uid);
    if (thumbnailIndex === index) {
      setThumbnailIndex(null); // hoặc gán ảnh khác làm thumbnail
    }

    // Xoá ảnh khỏi fileList
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));

    return true; // Cho Ant biết là ảnh đã được xoá
  };

  const columns = [
    { title: "Tên biến thể", dataIndex: "name", key: "name" },
    // {
    //   title: "Tên sản phẩm",
    //   dataIndex: "Name",
    //   render: (id) => products.find((p) => p.id === id)?.Name || "",
    // },
    { title: "Màu", dataIndex: "color", key: "color" },
    {
      title: "Dung lượng",
      dataIndex: "storage_capacity",
      key: "storage_capacity",
    },
    {
      title: "Giá (VNĐ)",
      dataIndex: "price",
      key: "price",
      render: (price) =>
        Number(price).toLocaleString("vi-VN", { minimumFractionDigits: 0 }) +
        " đ",
    },
    //    { title: "Số lượng", dataIndex: "stock_quantity", key: "stock_quantity" },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      render: (active) => (active ? "✅" : "❌"),
    },
    // { title: "Thông số kỹ thuật", dataIndex: "specification", key: "specification" },
    { title: "Kích thước", dataIndex: "size", key: "size" },
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail_url",
      key: "thumbnail_url",
      render: (url) =>
        url ? <img src={url} alt="Ảnh chính" width={100} /> : "—",
    },
    // {
    //   title: "Hành động",
    //   key: "actions",
    //   render: (_, record) => (
    //     <div className="flex gap-2">
    //       <Button
    //         icon={<EditOutlined />}
    //         className="bg-blue-500 text-white hover:bg-blue-600"
    //         onClick={() => handleEdit(record)}
    //       >
    //         Sửa
    //       </Button>
    //       <Popconfirm
    //         title="Xoá danh mục này?"
    //         onConfirm={() => DeleteVariant(record.id)}
    //         okText="Xoá"
    //         cancelText="Huỷ"
    //       >
    //         <Button
    //           danger
    //           icon={<DeleteOutlined />}
    //           className="hover:bg-red-600 text-white bg-red-500"
    //         >
    //           Xoá
    //         </Button>
    //       </Popconfirm>
    //     </div>
    //   ),
    // },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleView(record)}
            className="bg-gray-500 text-white hover:bg-gray-600"
          >
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xoá danh mục này?"
            onConfirm={() => DeleteVariant(record.id)}
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
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Biến thể sản phẩm</h2>
        <Button type="primary" onClick={handleAdd}>
          Thêm biến thể
        </Button>
      </div>
      <Table dataSource={variants} columns={columns} rowKey="id" />

      <Modal
        title={
          editingVariant ? "Sửa biến thể sản phẩm" : "Thêm biến thể sản phẩm"
        }
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          setEditingVariant(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          onValuesChange={handleFormValuesChange}
        >
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ flex: 1 }}>
              {/* Cột trái */}
              <Form.Item
                name="product_id"
                label="Sản phẩm"
                rules={[{ required: true }]}
              >
                <Select placeholder="Chọn sản phẩm" optionLabelProp="label">
                  {products.map((p) => (
                    <Option key={p.Id} value={p.Id} label={p.Name}>
                      {p.Name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="color" label="Màu" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item
                name="storage_capacity"
                label="Dung lượng"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="warranty_period"
                label="Thời hạn bảo hành"
                rules={[{ required: true, message: "Chọn thời hạn bảo hành" }]}
              >
                <Select placeholder="Chọn thời hạn">
                  {[6, 12, 18, 24, 30, 36].map((m) => (
                    <Option key={`warranty-${m}`} value={m}>
                      {m} tháng
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="name" label="Tên biến thể">
                <Input
                  placeholder="Nhập tên biến thể (nếu không nhập sẽ tự động tạo)"
                  onChange={() => {
                    variantNameEdited.current = true;
                  }}
                />
              </Form.Item>
            </div>
            <div style={{ flex: 1 }}>
              {/* Cột phải */}
              <Form.Item name="size" label="Kích thước">
                <Input placeholder="Nhập kích thước" />
              </Form.Item>
              <Form.Item
                name="stock_quantity"
                label="Số lượng tồn kho"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="price"
                label="Giá (VNĐ)"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>
              <Form.Item
                name="isActive"
                label="Kích hoạt"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item name="specification" label="Thông số kỹ thuật">
                <Input.TextArea rows={2} placeholder="Nhập thông số kỹ thuật" />
              </Form.Item>
            </div>
          </div>
          <Form.Item label="Hình ảnh">
            <Upload
              listType="picture-card"
              fileList={fileList}
              customRequest={handleCustomRequest}
              onChange={handleUploadChange}
              onRemove={handleRemoveImage}
              multiple
              maxCount={10}
              accept="image/*"
            >
              {fileList.length >= 10 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            <div className="text-xs text-gray-400">Tối đa 10 hình ảnh</div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {fileList.map((file, idx) => (
                <div
                  key={file.uid}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    border:
                      thumbnailIndex === idx
                        ? "2px solid #faad14"
                        : "1px solid #eee",
                    borderRadius: 4,
                    padding: 4,
                    background: "#fafafa",
                  }}
                >
                  <img
                    src={file.thumbUrl || ""}
                    alt=""
                    width={48}
                    height={48}
                    style={{ objectFit: "cover", borderRadius: 4 }}
                  />
                  <Button
                    size="small"
                    type={thumbnailIndex === idx ? "primary" : "default"}
                    icon={
                      thumbnailIndex === idx ? <StarFilled /> : <StarOutlined />
                    }
                    style={{ marginTop: 4 }}
                    onClick={() => setThumbnailIndex(idx)}
                  >
                    {thumbnailIndex === idx ? "Ảnh chính" : "Đặt làm ảnh chính"}
                  </Button>
                </div>
              ))}
            </div>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Chi tiết biến thể"
        open={!!viewingVariant}
        onCancel={() => setViewingVariant(null)}
        footer={<Button onClick={() => setViewingVariant(null)}>Đóng</Button>}
      >
        {viewingVariant && (
          <div>
            <Descriptions
              column={1}
              bordered
              size="small"
              style={{ marginBottom: 16 }}
            >
              <Descriptions.Item label="Tên biến thể">
                {viewingVariant.name}
              </Descriptions.Item>
              <Descriptions.Item label="Màu">
                {viewingVariant.color}
              </Descriptions.Item>
              <Descriptions.Item label="Dung lượng">
                {viewingVariant.storage_capacity}
              </Descriptions.Item>
              <Descriptions.Item label="Kích thước">
                {viewingVariant.size}
              </Descriptions.Item>
              <Descriptions.Item label="Giá">
                {Number(viewingVariant.price).toLocaleString("vi-VN")} đ
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                {viewingVariant.isActive ? "Đang bán" : "Ngừng bán"}
              </Descriptions.Item>
              <Descriptions.Item label="Thông số kỹ thuật">
                {viewingVariant.specification}
              </Descriptions.Item>
              <Descriptions.Item label="Giá đang áp dụng khuyến mãi">
                {Number(viewingVariant.final_price).toLocaleString("vi-VN")} đ
              </Descriptions.Item>
            </Descriptions>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>Hình ảnh:</div>
            {viewingVariant.images && viewingVariant.images.length > 0 ? (
              <Carousel
                dots
                arrows
                style={{ maxWidth: 300, margin: "auto", marginBottom: 12 }}
                prevArrow={<LeftOutlined />}
                nextArrow={<RightOutlined />}
              >
                {viewingVariant.images.map((img, idx) => {
                  const url = img.imageUrl || img.url || "";
                  const fullUrl = /^http/.test(url)
                    ? url
                    : `http://localhost:3000/${url.replace(/^\/+/, "")}`;
                  const isThumb = img.is_thumbnail || img.isThumbnail;
                  return (
                    <div
                      key={img.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: 240,
                        borderRadius: 8,
                        border: isThumb ? "2px solid gold" : "1px solid #333",
                        padding: 10,
                        position: "relative",
                      }}
                    >
                      <img
                        src={fullUrl}
                        alt=""
                        style={{
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          borderRadius: 6,
                          border: isThumb ? "2px solid gold" : "1px solid #666",
                          boxShadow: isThumb
                            ? "0 0 6px 2px rgba(255, 215, 0, 0.6)"
                            : "0 1px 3px rgba(255,255,255,0.1)",
                        }}
                      />
                      {isThumb && (
                        <div
                          style={{
                            position: "absolute",
                            top: 8,
                            left: 8,
                            background: "gold",
                            color: "#222",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 600,
                            fontSize: 13,
                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <StarFilled style={{ color: "#faad14" }} /> Ảnh chính
                        </div>
                      )}
                    </div>
                  );
                })}
              </Carousel>
            ) : (
              <div style={{ color: "#888" }}>Không có hình ảnh</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
