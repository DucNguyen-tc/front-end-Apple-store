// PromotionMapping.jsx
import { useState, useEffect } from "react";
import { Card, Checkbox, Input, List, Typography, Select, message } from "antd";
import dayjs from "dayjs";
import { GiftOutlined, TagsOutlined } from "@ant-design/icons";
import { getAllVariants } from "../../Api/variantApi";
import { getAllProducts } from "../../Api/productApi";
import { getAllProductCategories } from "../../Api/productCategoryApi";
import { getAllPromotions } from "../../Api/promotionApi";
import {
  getAllProductPromotion,
  createProductPromotion,
  deleteProductPromotion,
} from "../../Api/productPromotion";

const { Option } = Select;

export default function ProductPromotion() {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [mapping, setMapping] = useState({});
  const [filterCategory, setFilterCategory] = useState(null);
  const [searchName, setSearchName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllProductCategories();
        setCategories(data);
      } catch (error) {
        message.error("Không thể tải danh mục sản phẩm");
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        message.error("Không thể tải danh sách sản phẩm");
      }
    };

    const fetchVariants = async () => {
      try {
        const data = await getAllVariants();
        setVariants(data);
      } catch (error) {
        message.error("Không thể tải danh sách biến thể");
      }
    };

    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        setPromotions(data);
      } catch (error) {
        message.error("Không thể tải danh sách biến thể");
      }
    };

    const fetchMapping = async () => {
      try {
        const data = await getAllProductPromotion();
        setMapping(data);
      } catch (err) {
        message.error("Không thể tải dữ liệu gán khuyến mãi");
      }
    };

    fetchCategories();
    fetchProducts();
    fetchVariants();
    fetchPromotions();
    fetchMapping();
  }, []);

  // Lọc biến thể theo category và search
  const filteredVariants = variants.filter((variant) => {
    let matchCategory = true;
    if (filterCategory) {
      const product = products.find((p) => p.Id === variant.product_id);
      matchCategory = product?.ProductCategory_Id === filterCategory;
    }

    let matchSearch = true;
    if (searchName.trim())
      matchSearch = variant.name
        .toLowerCase()
        .includes(searchName.trim().toLowerCase());

    return matchCategory && matchSearch;
  });

  // Nếu biến thể đang chọn không còn trong filteredVariants thì chọn lại
  const currentSelected = filteredVariants.find(
    (v) => v.id === selectedVariant?.id
  )
    ? selectedVariant
    : filteredVariants[0] || null;

  // const togglePromotion = (promoId) => {
  //   setMapping((prev) => {
  //     const currentPromos = prev[selectedVariant.id] || [];
  //     const newPromos = currentPromos.includes(promoId)
  //       ? currentPromos.filter((id) => id !== promoId)
  //       : [...currentPromos, promoId];

  //     return {
  //       ...prev,
  //       [selectedVariant.id]: newPromos,
  //     };
  //   });
  // };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Biến thể */}
      <Card
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <TagsOutlined /> Danh sách biến thể
          </div>
        }
        className="rounded-2xl shadow-md"
      >
        <div className="flex gap-2 mb-3">
          <Select
            allowClear
            placeholder="Lọc theo danh mục"
            style={{ minWidth: 140 }}
            value={filterCategory}
            onChange={setFilterCategory}
          >
            {categories.map((category) => (
              <Option key={category.id} value={category.id}>
                {category.name}
              </Option>
            ))}
          </Select>
          <Input.Search
            allowClear
            placeholder="Tìm kiếm tên biến thể"
            style={{ minWidth: 180 }}
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>
        <List
          dataSource={filteredVariants}
          bordered
          renderItem={(item) => (
            <List.Item
              onClick={() => setSelectedVariant(item)}
              className={`cursor-pointer transition-all ${
                currentSelected?.id === item.id
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : ""
              }`}
            >
              {item.name}
              <span className="ml-2 text-xs text-gray-400">
                {item.categoryName}
              </span>
            </List.Item>
          )}
        />
      </Card>

      {/* Khuyến mãi */}
      <Card
        title={
          <div className="flex items-center gap-2 text-lg font-semibold">
            <GiftOutlined /> Khuyến mãi áp dụng
          </div>
        }
        className="rounded-2xl shadow-md"
      >
        {currentSelected ? (
          <>
            <Typography.Text strong>
              Biến thể đang chọn:{" "}
              <span className="text-blue-600">{currentSelected.name}</span>
            </Typography.Text>
            {promotions
  .filter((promo) => {
    const now = dayjs();
    return (
      promo.isActive &&
      dayjs(promo.start_date).isBefore(now) &&
      dayjs(promo.end_date).isAfter(now)
    );
  })
  .map((promo) => (
    <div
      key={promo.id}
      className="flex items-start gap-3 border p-3 rounded-xl hover:shadow-md transition-all"
    >
      <Checkbox
        checked={mapping[currentSelected.id]?.includes(promo.id)}
        onChange={async () => {
          const productVariantId = currentSelected.id;
          const promotionId = promo.id;
          const isSelected = mapping[productVariantId]?.includes(promotionId);

          try {
            if (isSelected) {
              await deleteProductPromotion({ productVariantId, promotionId });
            } else {
              await createProductPromotion({ productVariantId, promotionId });
            }

            setMapping((prev) => {
              const currentPromos = prev[productVariantId] || [];
              const newPromos = isSelected
                ? currentPromos.filter((id) => id !== promotionId)
                : [...currentPromos, promotionId];
              return {
                ...prev,
                [productVariantId]: newPromos,
              };
            });

            message.success(
              isSelected ? "Đã gỡ khuyến mãi" : "Đã gắn khuyến mãi"
            );
          } catch (err) {
            console.error(err);
            message.error("Có lỗi xảy ra");
          }
        }}
      />
      <div>
        <div className="font-semibold">{promo.name}</div>
        <div className="text-gray-500 text-sm">{promo.description}</div>
      </div>
    </div>
))}

          </>
        ) : (
          <Typography.Text type="secondary">
            Không có biến thể nào phù hợp.
          </Typography.Text>
        )}
      </Card>
    </div>
  );
}
