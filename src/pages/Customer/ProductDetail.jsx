import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProductById } from "../../Api/productApi";
import { getVariantByProductId } from "../../Api/variantApi";
import { useCartStore } from "../../stores/cartStore";
import { UserContext } from "../../stores/UserContext";

export default function ProductDetail() {
  const { id } = useParams(); // id của sản phẩm
  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchData = async () => {
      const prod = await getProductById(id);
      const vars = await getVariantByProductId(id);
      setProduct(prod);
      setVariants(vars);
      // Chọn mặc định: dung lượng và màu đầu tiên
      if (vars.length > 0) {
        setSelectedStorage(vars[0].storage_capacity);
        setSelectedColor(vars[0].color);
      }
    };
    fetchData();
  }, [id]);

  // Khi chọn dung lượng, cập nhật lại danh sách màu phù hợp
  useEffect(() => {
    if (!selectedStorage) return;
    const colors = variants
      .filter((v) => v.storage_capacity === selectedStorage)
      .map((v) => v.color);
    setColorOptions([...new Set(colors)]);
    // Nếu màu hiện tại không còn trong options, chọn màu đầu tiên
    if (!colors.includes(selectedColor) && colors.length > 0) {
      setSelectedColor(colors[0]);
    }
  }, [selectedStorage, variants]);

  // Khi chọn màu hoặc dung lượng, cập nhật variant được chọn
  useEffect(() => {
    if (!selectedColor || !selectedStorage) return;
    const found = variants.find(
      (v) => v.color === selectedColor && v.storage_capacity === selectedStorage
    );
    setSelectedVariant(found || null);
  }, [selectedColor, selectedStorage, variants]);

  const handleAddToCart = async () => {
    if (!user || !user.id) {
      alert("Bạn cần đăng nhập để thêm vào giỏ hàng!");
      return;
    }
    if (selectedVariant) {
      await addItem(user.id, selectedVariant.id, 1);
      alert("Đã thêm vào giỏ hàng!");
    }
  };

  if (!product || !selectedVariant) return <div>Đang tải...</div>;

  // Lấy danh sách dung lượng duy nhất
  const uniqueStorages = [...new Set(variants.map((v) => v.storage_capacity))];

  return (
    <div className="container mx-auto px-4 py-10 text-gray-800">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hình ảnh */}
        <img
          src={selectedVariant.thumbnail_url}
          alt={product.name}
          className="w-full object-contain rounded-xl shadow"
        />

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="mb-4 text-gray-600">{product.description}</p>

          {/* Lựa chọn dung lượng */}
          <div className="mb-4">
            <label className="font-medium block mb-1">Dung lượng:</label>
            <div className="flex gap-2 flex-wrap">
              {uniqueStorages.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`border rounded px-3 py-1 min-w-[60px] text-center transition-all duration-150 ${
                    selectedStorage === storage
                      ? "bg-black text-white border-black"
                      : "hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {storage}
                </button>
              ))}
            </div>
          </div>

          {/* Lựa chọn màu sắc */}
          <div className="mb-4">
            <label className="font-medium block mb-1">Màu sắc:</label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`border rounded px-3 py-1 min-w-[60px] text-center transition-all duration-150 ${
                    selectedColor === color
                      ? "bg-black text-white border-black"
                      : "hover:bg-gray-200 border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Hiển thị giá sản phẩm giống ProductCard */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-red-600">
              {(parseFloat(selectedVariant.total_discount) > 0
                ? parseFloat(selectedVariant.final_price)
                : parseFloat(selectedVariant.price)
              ).toLocaleString()}₫
            </span>
            {parseFloat(selectedVariant.total_discount) > 0 && (
              <span className="text-gray-400 line-through text-lg">
                {parseFloat(selectedVariant.price).toLocaleString()}₫
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition"
          >
            Thêm vào giỏ hàng
          </button>

          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-1">Thông số kỹ thuật</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {selectedVariant.specification}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
