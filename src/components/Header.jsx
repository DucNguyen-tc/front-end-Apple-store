import { UserOutlined } from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../stores/UserContext";
import { getAllProductCategories } from "../Api/productCategoryApi";
import CartIcon from "./CartIcon";

function Header() {
  const { user, logout } = useContext(UserContext);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Gọi API lấy categories
    const fetchCategories = async () => {
      try {
        const data = await getAllProductCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error); // lỗi khi gọi API
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  // Lấy search term từ query string
  const params = new URLSearchParams(location.search);
  const querySearchTerm = params.get("search")?.toLowerCase() || "";

  return (
    <div className="w-full relative z-[200]">
      {/* Top Header */}
      <header className="backdrop-blur-md bg-green-200 shadow-lg rounded-b-2xl border-b border-gray-200 relative z-[150]">
        <div className="flex items-center justify-between h-20 px-10">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-4 outline-0">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg"
              alt="Logo"
              className="h-10 w-10 drop-shadow-lg"
            />
            <h1 className="font-extrabold text-2xl text-gray-800 tracking-tight drop-shadow-sm">
              Apple Store
            </h1>
          </Link>
          {/* Search */}
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg">
              <form
                onSubmit={handleSearch}
                className="flex shadow-md rounded-xl overflow-hidden bg-white/80"
              >
                <input
                  type="text"
                  placeholder="Hôm nay bạn muốn tìm kiếm gì?"
                  className="w-full px-5 py-3 bg-transparent text-base focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-green-700 text-white px-6 font-semibold hover:bg-green-500 transition-all rounded-lg shadow-md"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>
          </div>
          {/* Actions */}
          <div>
            <div className="flex items-center space-x-8">
              <div
                className="relative z-[160]"
                onMouseEnter={() => setShowAdminMenu(true)}
                onMouseLeave={() => setShowAdminMenu(false)}
              >
                <Link
                  to="/login"
                  className="flex items-center text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  <UserOutlined className="text-2xl mr-2" />
                  {user ? (
                    <span className="hidden md:inline">
                      Chào, {user.fullName}
                    </span>
                  ) : (
                    <span className="hidden md:inline">Tài khoản</span>
                  )}
                </Link>
                {/* Dropdown menu */}
                {user && showAdminMenu && (
                  <div className="absolute left-0 top-full bg-white border border-gray-200 rounded-xl shadow-2xl z-[200] min-w-[180px] py-2 px-2 flex flex-col gap-1 animate-fade-in">
                    {(user.role === "ADMIN" || user.role === "admin") && (
                      <button
                        className="w-full text-left text-sm px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                        onClick={() => navigate("/admin")}
                      >
                        Chuyển tới trang admin
                      </button>
                    )}
                    <button
                      className="w-full text-left text-sm px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                      onClick={() => {
                        logout();
                        navigate("/login");
                      }}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
              <CartIcon />
            </div>
          </div>
        </div>
      </header>
      {/* Apple Menu */}
      <div className="w-full bg-white/80 backdrop-blur-md shadow-sm rounded-b-xl z-[100]">
        <nav className="flex justify-center">
          <ul className="flex flex-wrap gap-6 font-semibold text-base md:text-lg py-3">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/category/${category.name}/${category.id}`}
                  className="hover:text-blue-500 transition-colors px-3 py-1 rounded-lg hover:bg-blue-50"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default Header;