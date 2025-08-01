import Navbaar from "./components/Navbaar/Navbaar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Details from "./pages/details";
import SignIn from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import Cart from "./pages/cart";
import SuccessPage from "./pages/payment/success";
import CancelPage from "./pages/payment/cancel";
import PurchaseProduct from "./containers/PurchaseProduct/PurchaseProduct";
import AdminDashboard from "./admin/dashboard";
import HomeRouteGuard from "./containers/HomeLayout/HomeRouteGuard";
import AdminSidebar from "./admin/sidebar";
import { useState } from "react";
import UserList from "./admin/user/userList";
import CreateUser from "./admin/user/userCreate";
import ProductList from "./admin/product/productList";
import AddProduct from "./admin/product/addProduct";
import Orders from "./admin/order";

function App() {
  //Sidebar open state, default to true for desktop
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <BrowserRouter>
      <Navbaar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Routes>
        <Route path="/products/:productID" element={<Details />} />
        <Route
          path="/cart"
          element={
            <HomeRouteGuard>
              <Cart />
            </HomeRouteGuard>
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route
          path="/purchases"
          element={
            <HomeRouteGuard>
              <PurchaseProduct />
            </HomeRouteGuard>
          }
        />

        {/* public routes */}
        <Route
          path="/"
          element={
            <HomeRouteGuard>
              <Home />
            </HomeRouteGuard>
          }
        />

        {/*  admin routes */}
        <Route
          path="/admin/*"
          element={
            <AdminSidebar
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
            >
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UserList />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/products/add" element={<AddProduct />} />
                <Route path="/orders" element={<Orders />} />
              </Routes>
            </AdminSidebar>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
