import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page content */}
      <main className="flex-1 bg-gray-50 px-6 py-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;