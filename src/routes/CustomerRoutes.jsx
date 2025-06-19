import { Route, Routes } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Home";
import Login from "../pages/Customer/Login";
import ProductPage from "../pages/Customer/Product";
import Cart from "../pages/Customer/Cart";
import Checkout from "../pages/Customer/Checkout";
import Orders from "../pages/Customer/Orders";

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/category/:name/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default CustomerRoutes;
