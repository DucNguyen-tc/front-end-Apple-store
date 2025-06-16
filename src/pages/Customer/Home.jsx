// src/pages/customer/Home.jsx
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { getAllVariants } from "../../Api/variantApi";

export default function Home() {
  const [products, setProducts] = useState([]);

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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Sản phẩm mới</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </div>
  );
}
