import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import { Header, Sidebar } from "./components";
import Dashboard from "./pages/HomePage/Dashboard";
import { useContext } from "react";
import DataContext from "./DataContext/DataContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import ProductUploadPage from "./pages/ProductUploadPage/ProductUploadPage";
import CategoryUploadPage from "./pages/CategoryUploadPage/CategoryUploadPage";
import CategoriesPage from "./pages/CategoriesPage/CategoriesPage";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductEditPage from "./pages/ProductEditPage/ProductEditPage";
import SubCategoriesPage from "./pages/SubCategoriesPage/SubCategoriesPage";
import SubCategoriesListPage from "./pages/SubCategoriesListPage/SubCategoriesListPage";
import ProductSizePage from "./pages/ProductSizePage/ProductSizePage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";
import BannerUploadPage from "./pages/BannerUploadPage/BannerUploadPage";
import BannerListPage from "./pages/BannerListPage/BannerListPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import UserListPage from "./pages/UserListPage/UserListPage";
function App() {
  const { isSideBarOpen, headerFooterShow } = useContext(DataContext);
  return (
    <>
      {headerFooterShow && <Header />}
      <div className="main d-flex">
        {headerFooterShow && (
          <div
            className={`sidebarWrapper ${
              isSideBarOpen === true ? "toggle" : ""
            }`}
          >
            <Sidebar />
          </div>
        )}
        <div
          className={`content ${headerFooterShow !== true && "full"} ${
            isSideBarOpen === true ? "toggle" : ""
          }`}
        >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/productupload" element={<ProductUploadPage />} />
            <Route path="/productlist" element={<ProductListPage />} />
            <Route path="/product/edit/:id" element={<ProductEditPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/category/add" element={<CategoryUploadPage />} />
            <Route path="/subcategories/add" element={<SubCategoriesPage />} />
            <Route path="/subcategories" element={<SubCategoriesListPage />} />
            <Route path="/productsize/add" element={<ProductSizePage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/banner/create" element={<BannerUploadPage />} />
            <Route path="/bannerList" element={<BannerListPage />} />
            <Route path="/account/:id" element={<AccountPage />} />
            <Route path="/userlist" element={<UserListPage />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
