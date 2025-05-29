import { Route, Routes } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Home from "../pages/Customer/Home";
import Login from "../pages/Customer/Login";

function CustomerRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default CustomerRoutes;
