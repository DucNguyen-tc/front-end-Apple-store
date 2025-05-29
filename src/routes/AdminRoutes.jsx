// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import Products from "../pages/Admin/Product";
import Users from "../pages/Admin/User";
import { useContext } from "react";
import { UserContext } from "../stores/UserContext";
import ProductCategories from "../pages/Admin/ProductCategories";
import Variants from "../pages/Admin/Variants";
import Promotion from "../pages/Admin/Promotion";
import Stores from "../pages/Admin/Stores";
import Article from "../pages/Admin/Article";

export default function AdminRoutes() {
  const { user, loading } = useContext(UserContext);
  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (user.role !== "ADMIN") {
    return <Navigate to="/" />;
  }
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="categories" element={<ProductCategories />} />
        <Route path="variants" element={<Variants />} />
        <Route path="promotions" element={<Promotion />} />
        <Route path="stores" element={<Stores />} />
        <Route path="articles" element={<Article />} />
        <Route path="users" element={<Users />} />
      </Route>
    </Routes>
  );
}
