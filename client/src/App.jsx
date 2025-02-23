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

function App() {
  return (
    <BrowserRouter>
      <Navbaar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:productID" element={<Details />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/cancel" element={<CancelPage />} />
        <Route path="/purchases" element={<PurchaseProduct />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
