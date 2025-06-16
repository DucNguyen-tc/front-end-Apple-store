import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";
import { getProductByCategoryId } from "../../Api/productApi";
import { getVariantByProductId } from "../../Api/variantApi";

const ProductPage = () => {
  const { name ,id } = useParams(); 
  const categoryId = Number(id);
  console.log("id", id);
  const [variantIds, setVariantIds] = useState([]);
  const [loading, setLoading] = useState(true);


  // Lấy sản phẩm theo danh mục và lấy id các variant của từng sản phẩm
  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    const fetchVariants = async () => {
      try {
        const productList = await getProductByCategoryId(categoryId);
        console.log("Productlist:", productList);
        // Lấy id các variant cho từng sản phẩm
        let allVariantIds = [];
        for (const product of productList) {
          const variants = await getVariantByProductId(product.Id);
          console.log("variant data:", variants);
          if (Array.isArray(variants)) {
            allVariantIds = allVariantIds.concat(variants.map((v) => v.id));
          console.log("allvariant data:", allVariantIds);

          }
        }
        setVariantIds(allVariantIds);
      } catch (error) {
        setVariantIds([]);
        console.error("Lỗi lấy sản phẩm hoặc biến thể:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVariants();
  }, [categoryId]);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="bg-white px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-bold capitalize mb-8">
        {name ? name : "Không tìm thấy danh mục"}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {variantIds.map((variantId) => (
          <ProductCard key={variantId} variantId={variantId} />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;