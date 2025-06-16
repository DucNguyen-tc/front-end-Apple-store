import { Route, Routes } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Home";
import Login from "../pages/Customer/Login";
import ProductPage from "../pages/Customer/Product";
import Cart from "../pages/Customer/Cart";

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:name/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
      </Route>
    </Routes>
  );
}

export default CustomerRoutes;
