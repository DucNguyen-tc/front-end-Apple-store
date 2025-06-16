import { useEffect, useState } from "react";
import { getVariantById } from "../Api/variantApi";

const Card = ({ name, price, final_price, total_discount, thumbnail_url, storage_capacity, color }) => {
  const isDiscounted = parseFloat(total_discount) > 0;

  return (
    <div className="bg-[#3f3c3c] text-white p-4 rounded-xl shadow-md  w-full max-w-xs mx-auto transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <img
        src={thumbnail_url}
        alt={name}
        className="w-full h-56 object-contain mb-4"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />

      <h3 className="text-lg font-semibold text-center mb-1">{name}</h3>
      <p className="text-center text-sm text-gray-400 mb-2">
        {color} - {storage_capacity}
      </p>

      <div className="flex justify-center items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold text-white">
          {(isDiscounted ? final_price : price).toLocaleString()}₫
        </span>
        {isDiscounted && (
          <span className="text-gray-400 line-through text-sm">
            {parseFloat(price).toLocaleString()}₫
          </span>
        )}
      </div>

      <button
        onClick={() => console.log("Đã thêm vào giỏ")}
        className="block w-full bg-transparent border border-white text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
      >
        Thêm vào giỏ hàng
      </button>
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

  if (loading) return <div className="text-black">Đang tải...</div>;
  if (!variant) return <div className="text-red-400">Không tìm thấy biến thể</div>;

  return (
    <Card
      name={variant.name}
      price={parseFloat(variant.price)}
      final_price={parseFloat(variant.final_price)}
      total_discount={variant.total_discount}
      thumbnail_url={variant.thumbnail_url}
      storage_capacity={variant.storage_capacity}
      color={variant.color}
    />
  );
};

export default ProductCard;
