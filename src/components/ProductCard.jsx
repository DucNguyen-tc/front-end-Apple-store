
import { useEffect, useState } from "react";
import { getVariantById } from "../Api/variantApi";

const Card = ({ name, price, thumbnail_url, storage_capacity, color }) => {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition" style={{ width: "250px", height: "350px" }}>
      <img
        src={thumbnail_url}
        alt={name}
        className="w-full h-2/3 object-cover"
        onError={e => { e.target.src = "https://via.placeholder.com/150"; }}
      />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-500">{storage_capacity} - {color}</p>
      <p className="text-red-500 font-bold">{price?.toLocaleString()}₫</p>
    </div>
  );
};

const ProductCard = ({ variantId }) => {
  const [variant, setVariant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!variantId) return;
    const fetchVariant = async () => {
      try {
        const data = await getVariantById(variantId);
        setVariant(data);
      } catch (error) {
        setVariant(null);
        console.error("Lỗi khi lấy biến thể:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVariant();
  }, [variantId]);

  if (loading) return <div>Đang tải...</div>;
  if (!variant) return <div>Không tìm thấy biến thể</div>;

  return (
    <Card
      name={variant.name }
      price={variant.price}
      final_price={variant.final_price}
      thumbnail_url={variant.thumbnail_url}
      storage_capacity={variant.storage_capacity}
      color={variant.color}
    />
  );
};

export default ProductCard;