// src/components/ProductCard.jsx
export default function ProductCard({ product }) {
  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-lg transition">
      {/* <img src={product.image} alt={product.name} className="h-40 w-full object-cover mb-2" /> */}
      <h3 className="text-lg font-semibold">{product.Name}</h3>
      {/* <p className="text-gray-500">{product.category}</p>
      <p className="text-red-500 font-bold">{product.price.toLocaleString()}₫</p> */}
      <button className="mt-2 bg-black text-white px-4 py-1 rounded">Xem chi tiết</button>
    </div>
  )
}
