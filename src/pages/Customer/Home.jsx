// src/pages/customer/Home.jsx
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { getAllVariants } from "../../Api/variantApi";
import { useLocation } from "react-router-dom";

export default function Home() {
  const [variantId, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllVariants();
        setProducts(data);
        console.log("Sản phẩm mới:", data); 
      } catch (err) {
        console.error("Lỗi khi fetch sản phẩm:", err);
      }
    };

    fetchData();
  }, []);

  // Lấy search term từ query string
  const params = new URLSearchParams(location.search);
  const searchTerm = params.get("search")?.toLowerCase() || "";

  // Lọc sản phẩm theo searchTerm
  const filteredVariants = variantId.filter((item) =>
    item.name?.toLowerCase().includes(searchTerm)
  );

  // Sắp xếp các sản phẩm có tên chứa searchTerm lên đầu
  const sortedVariants = [...filteredVariants].sort((a, b) => {
    const aMatch = a.name?.toLowerCase().includes(searchTerm);
    const bMatch = b.name?.toLowerCase().includes(searchTerm);
    if (aMatch === bMatch) return 0;
    return aMatch ? -1 : 1;
  });

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-8 mb-6">
        <div className="flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
            alt="Logo"
            className="h-12 w-12 drop-shadow-lg"
          />
          <h2 className="text-3xl font-bold tracking-wide">APPLE</h2>
        </div>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedVariants.map((item) => (
          <ProductCard key={item.id} variantId={item.id} />
        ))}
      </div>
      {sortedVariants.length === 0 && searchTerm && (
        <div className="text-center text-red-500 text-lg py-8">
          Không tìm thấy sản phẩm "{searchTerm}"
        </div>
      )}
    </div>
  );
}
