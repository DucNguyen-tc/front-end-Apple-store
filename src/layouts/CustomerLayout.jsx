import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

function CustomerLayout() {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] p-4">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default CustomerLayout;
