import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';

import cartItemImage from '../assets/images/website/cartEmpty.png'
import '../styles/pages/cartPage.css'
import NavbarSection from '../components/navbar/navbar';
import Cursor from '../components/Cursor/cursor';
import { Footer } from '../components/Footer/footer';
import Breadcrumb from '../components/BreadCrumb/breadCrumb';
import CartItems from '../components/ProductCart/cartItem';
import PaymentModal from '../components/Modal/Payment/PaymentModal';

const CartPage = () => {
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const [discount, setDiscount] = useState(0);
    const [inputVoucher, setInputVoucher] = useState('');
    const [voucherCode, setVoucherCode] = useState('');
    const [subTotal, setSubTotal] = useState(0);
    const [shippingFee, setShippingFee] = useState(20);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "Cart", url: "/Cart" }
    ];

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItemsCount(storedItems.length);
        updateTotalPrice(storedItems);
    }, []);

    const updateTotalPrice = (items) => {
        let total = 0;
        items.forEach(item => {
            total += item.quantity * item.promotionPrice;
        });
        setTotalPrice(total + shippingFee);
        setSubTotal(total); // Cập nhật giá trị tổng ban đầu
    };

    const handleRedeemVoucher = async () => {
        if (!inputVoucher) {
            toast.warn('Please enter a voucher code', { autoClose: 3000, theme: "dark" });
            return;
        }
        try {
            const response = await axios.post(`${gBASE_URL}/voucher/use/${inputVoucher}`);
            if (response.status === 200) {
                setDiscount(response.data.data.discount);
                setTotalPrice((subTotal - subTotal * (response.data.data.discount / 100)) + shippingFee);  // Tính toán giá trị sau khi giảm giá
                setVoucherCode(response.data.data.code)
            }
        } catch (error) {
            const errorMessage = error.response && error.response.data && error.response.data.message
                ? error.response.data.message
                : 'Voucher not found';

            toast.error(errorMessage, { autoClose: 3000, theme: "dark" });
        }
    };


    let cartItemContent;
    const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    if (storedItems.length > 0) {
        cartItemContent = (
            <>
                <table className="product-table">
                    <tbody>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>QTY</th>
                            <th>Unit Price</th>
                        </tr>
                        <CartItems updateTotalPrice={updateTotalPrice} setTotalPrice={setTotalPrice} discount={discount} />
                    </tbody>
                </table>
                <div className="total-price">
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <TextField
                                        margin="dense"
                                        id="input-voucher"
                                        name="input-voucher"
                                        label="Enter Your Voucher"
                                        type="text"
                                        fullWidth
                                        variant="standard"
                                        value={inputVoucher}
                                        onChange={(e) => setInputVoucher(e.target.value)}
                                    />
                                </td>
                                <td><button className="btn-redeem-voucher" onClick={handleRedeemVoucher}>Redeem</button></td>
                            </tr>
                            <tr>
                                <td>Subtotal</td>
                                <td className="sub-total-price">${subTotal}</td>
                            </tr>
                            <tr>
                                <td>Coupon</td>
                                <td className="coupon">{discount}%</td>
                            </tr>
                            <tr>
                                <td>Discount</td>
                                <td className="discount">${subTotal * (discount / 100)}</td>
                            </tr>
                            <tr>
                                <td>Shipping + Handling</td>
                                <td className="shipping-handling">$20</td>
                            </tr>
                            <tr className="final-total-text">
                                <td>Total</td>
                                <td className="final-total">${totalPrice}</td>
                            </tr>
                            <tr>
                                <td><button type="button" className="btn-checkout" id="btn-checkout" onClick={() => setShowModal(true)}>Check Out</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        );
    } else {
        cartItemContent = (
            <>
                <br />
                <div className='d-flex justify-content-center flex-col items-center' style={{ color: "#676767a7" }}>
                    <img src={cartItemImage} style={{ width: "180px" }} alt="Empty Cart" />
                    <h6>Your cart does not contain any products. Buy things <span><Link to="/products" style={{ color: "rgb(238, 77, 45)", textDecoration: "none" }}>Here</Link></span>.</h6>
                </div>
                <br />
            </>
        );
    }
    return (
        <div className=''>
            <NavbarSection />
            <Breadcrumb items={breadcrumbItems} />

            <div className="container cart-page">
                <>
                    {cartItemContent}
                </>
            </div>
            <Cursor />
            <PaymentModal isOpen={showModal} onClose={() => setShowModal(false)} totalPrice={totalPrice} voucherCode={voucherCode} />
            <ToastContainer />
            <Footer />
        </div>
    )
}

export default CartPage;
