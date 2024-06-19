import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AOS from "aos";

import "aos/dist/aos.css";
import Homepage from './pages/HomePage';
import ProductList from './pages/productList';
import ProductInformation from './pages/productInfo';
import CartPage from './pages/cartPage';
import MyAccount from './pages/MyAccount';
import { CheckOrder } from './pages/CheckOrder';
import { Contact } from './pages/contactForm';
import LoginRegister from './pages/LoginRegister';
import ForgotPassword from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { VerifyResetTokenPassword } from './pages/verifyResetPassword';
import { TokenError } from './pages/TokenError';

export default function App() {
    React.useEffect(() => {
        AOS.init({
          offset: 100,
          duration: 800,
          easing: "ease-in-sine",
          delay: 100,
        });
        AOS.refresh();
      }, []);
    return (
        <Routes>
            <Route path="*" element={<Homepage />} />
            <Route path="my-account" element={<MyAccount />} />
            <Route path="products" element={<ProductList />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="check-order" element={<CheckOrder />} />
            <Route path="contact" element={<Contact />} />
            <Route path="products/:productId" element={<ProductInformation />} />
            <Route path="login-register" element={<LoginRegister />} />
            <Route path="redirect-to-login-register" element={<Navigate to="/login-register" />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="verify-reset-token/:id/:token" element={<VerifyResetTokenPassword />} />
            <Route path="reset-password/:id/:token" element={<ResetPassword />}></Route>
            <Route path="token-error" element={<TokenError />}></Route>
        </Routes>
    );
}
