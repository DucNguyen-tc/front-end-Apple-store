import React, { useContext, useState } from "react";
import { UserContext } from "../stores/UserContext";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  TeamOutlined,
  FileTextOutlined,
  ShopOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import "./Sidebar.css";

const { Sider } = Layout;

function Sidebar() {
  const { user } = useContext(UserContext);
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState(["products"]);

  // Define menu items
  const menuItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Main Dashboard</Link>,
    },
    {
      key: "products",
      icon: <AppstoreOutlined />,
      label: "Quản lý sản phẩm",
      children: [
        {
          key: "/admin/products",
          label: <Link to="/admin/products">Danh sách sản phẩm</Link>,
        },
        {
          key: "/admin/variants",
          label: <Link to="/admin/variants">Biến thể sản phẩm</Link>,
        },
        {
          key: "/admin/categories",
          label: <Link to="/admin/categories">Danh mục sản phẩm</Link>,
        },
      ],
    },
    {
      key: "/admin/orders",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
    },
    {
      key: "/admin/users",
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: "/admin/articles",
      icon: <FileTextOutlined />,
      label: <Link to="/admin/articles">Quản lý bài viết</Link>,
    },
    {
      key: "/admin/stores",
      icon: <ShopOutlined />,
      label: <Link to="/admin/stores">Quản lý cửa hàng</Link>,
    },
    {
      key: "promotions",
      icon: <TagsOutlined />,
      label: <Link to="/admin/promotions">Quản lý khuyến mãi</Link>,
      children: [
        {
          key: "/admin/promotions",
          label: <Link to="/admin/promotions">Danh sách khuyến mãi</Link>,
        },
        {
          key: "/admin/variants",
          label: (
            <Link to="/admin/product-promotions">Sản phẩm khuyến mãi</Link>
          ),
        },
      ],
    },
  ];

  return (
    <Sider
      width={240}
      style={{
        background: "#fff",
        minHeight: "100vh",
        boxShadow: "2px 0 8px #f0f1f2",
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="font-bold text-xl pl-6 pt-8 pb-4 text-blue-900 tracking-wide">
        <span className="font-normal text-gray-400">Hello </span>
        {user ? user.fullName : "Guest"}
      </div>

      <Menu
        mode="inline"
        defaultOpenKeys={openKeys}
        selectedKeys={[location.pathname]}
        className="custom-sidebar-menu"
        style={{ fontSize: 16, background: "#fff", flex: 1 }}
        items={menuItems}
      />

      <div style={{ marginTop: "auto", paddingLeft: 40, borderTop: "1px solid #f0f0f0", paddingTop: 24 }}>
        <Link to="/" className="text-blue-600 hover:underline">
          <DashboardOutlined style={{ marginRight: 8 }} />
          Về trang khách hàng
        </Link>
      </div>
    </Sider>
  );
}

export default Sidebar;
