import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import { getProductById } from "../../Api/productApi";
import { getVariantByProductId } from "../../Api/variantApi";
import { getImagesByVariantId } from "../../Api/productImageApi";
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
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const { user } = useContext(UserContext);
  const intervalRef = useRef();

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

  // Lấy danh sách ảnh của variant
  useEffect(() => {
    if (!selectedVariant) return;
    console.log('Selected variant for images:', selectedVariant);
    const fetchImages = async () => {
      try {
        const imgs = await getImagesByVariantId(selectedVariant.id);
        console.log('Images from API:', imgs);
        const imgUrls = imgs.map((img) => img.url || img.thumbnail_url || img.imageUrl);
        console.log('Image URLs:', imgUrls);
        setImages(imgUrls);
        setCurrentImage(0);
      } catch (e) {
        setImages([]);
      }
    };
    fetchImages();
  }, [selectedVariant]);

  // Tự động chuyển ảnh
  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [images]);

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };
  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

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
        <div className="relative flex flex-col items-center justify-top">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImage]}
                alt={product.name}
                style={{ width: "800px", height: "500px" }}
                className="object-cover rounded-xl shadow"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 shadow hover:bg-white"
                  >
                    &#8594;
                  </button>
                </>
              )}
              <div className="flex gap-2 mt-2 justify-center">
                {images.map((img, idx) => (
                  <span
                    key={idx}
                    className={`inline-block w-3 h-3 rounded-full ${
                      idx === currentImage ? "bg-black" : "bg-gray-300"
                    }`}
                  ></span>
                ))}
              </div>
            </>
          ) : (
            <img
              src={selectedVariant.thumbnail_url}
              alt={product.name}
              style={{ width: "800px", height: "500px" }}
              className="object-cover rounded-xl shadow"
            />
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          {/* {console.log('Product detail:', product)} */}
          <h1 className="text-3xl font-bold mb-2">{product.Name}</h1>
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
              ).toLocaleString()}
              ₫
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
