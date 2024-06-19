import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import prevIcon from "../../assets/icon-previous.svg";
import nextIcon from "../../assets/icon-next.svg";
import closeIcon from "../../assets/icon-close.svg";
import QuantityAlertModal from '../Modal/cartModal/quantityAlert';


const ProductDetail = ({ onAddToCart }) => {

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [modal, setModal] = useState(true);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAmountModal, setShowAmountModal] = useState(false);
    const { productId } = useParams();

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${gBASE_URL}/product/${productId}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data.data);
                } else {
                    console.error('Error fetching product:', data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    // add to cart
    const handleAddToCart = () => {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const existingItemIndex = cartItems.findIndex(item => item._id === product._id);

        if (existingItemIndex !== -1) {
            // Check if the new quantity exceeds the product amount
            if (cartItems[existingItemIndex].quantity + quantity > product.amount) {
                // Show the QuantityAlertModal
                setShowAmountModal(true);
                return;
            }
            cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Check if the new quantity exceeds the product amount
            if (quantity > product.amount) {
                // Show the QuantityAlertModal
                setShowAmountModal(true);
                return;
            }
            cartItems.push({ ...product, quantity });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        localStorage.setItem('cartUpdated', Date.now());
        onAddToCart(cartItems.length);
        toast.success('Product added to cart successfully', { autoClose: 3000, theme: "dark" });
    };


    // modal 
    const toggleModal = useCallback(() => {
        setModal(prev => !prev);
    }, []);

    const goBack = useCallback(() => {
        setSelectedImageIndex(prev => (prev === 0 ? product.imageUrls.length - 1 : prev - 1));
    }, [product]);

    const goForward = useCallback(() => {
        setSelectedImageIndex(prev => (prev === product.imageUrls.length - 1 ? 0 : prev + 1));
    }, [product]);

    const selectImage = useCallback((idx) => {
        setSelectedImageIndex(idx);
    }, []);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [product]);

    const imageUrl = product?.imageUrls[selectedImageIndex].startsWith('http') || product?.imageUrls[selectedImageIndex].startsWith('https') ? product?.imageUrls[selectedImageIndex] : `http://localhost:8000/api/image/${product?.imageUrls[selectedImageIndex]}`;

    const cssString = `
        .modal-preview{
            z-index: 9999;
        }
        `
    return (
        <section className="py-5">
            <div className="container px-4 px-lg-5 my-5">
                <div className="main-wrapper flex flex-col md:flex-row md:px-[100px] md:py-[100px] relative">
                    <div className="image md:basis-1/2 md:flex md:flex-col md:justify-between">
                        <div className="hidden md:block large-image">
                            <img
                                onClick={toggleModal}
                                className="object-cover cursor-pointer rounded-xl w-[500px] h-[500px]"
                                src={imageUrl}
                                alt="product-preview"
                            />
                        </div>
                        <div className="md:hidden large-image">
                            <img
                                onClick={goBack}
                                className="bg-white rounded-full p-4 absolute top-[15%] left-0 cursor-pointer"
                                src={prevIcon}
                                alt="go-back"
                            />
                            <img
                                className="w-[100%] h-[300px] object-cover"
                                src={imageUrl}
                                alt="product-preview"
                            />
                            <img
                                onClick={goForward}
                                className="bg-white rounded-full p-4 absolute top-[15%] right-0 cursor-pointer"
                                src={nextIcon}
                                alt="go-forward"
                            />
                        </div>
                        <div className="small-images hidden md:flex mt-7 justify-start w-[400px]">
                            {product && product.imageUrls.map((imgUrl, idx) => (
                                <div key={idx} className="single-image" style={{ marginRight: '10px' }}>
                                    <img
                                        onClick={() => selectImage(idx)}
                                        className="w-[80px] h-[80px] cursor-pointer rounded-xl transition-all hover:opacity-25 hover:border-[3px] border-orange"
                                        src={imgUrl.startsWith('http') || imgUrl.startsWith('https') ? imgUrl : `${gBASE_URL}/image/${imgUrl}`}
                                        alt={`product-${idx}`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    <style>{cssString}</style>
                    <div
                        className={`${modal ? "hidden" : "md:block"
                            } fixed inset-0 bg-lightBlack modal-preview`}
                    >
                        <div
                            className={
                                "basis-1/2 flex flex-col justify-between absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]"
                            }
                        >
                            <div className="large-image">
                                <img
                                    className="h-[490px] rounded-xl cursor-pointer"
                                    src={imageUrl}
                                    alt="product-preview"
                                />
                                <img
                                    onClick={toggleModal}
                                    className="w-[20px] h-[20px] absolute -top-8 left-[95%] transition-all cursor-pointer hover:scale-150"
                                    src={closeIcon}
                                    alt="close-icon"
                                />
                                <img
                                    onClick={goBack}
                                    className="bg-white p-4 rounded-full absolute top-[36%] -translate-x-[20px] cursor-pointer transition-all hover:scale-150"
                                    src={prevIcon}
                                    alt="previous"
                                />
                                <img
                                    onClick={goForward}
                                    className="bg-white p-4 rounded-full absolute top-[36%] left-[95%] cursor-pointer transition-all hover:scale-150"
                                    src={nextIcon}
                                    alt="next"
                                />
                            </div>
                            <div className="small-images flex mt-7 justify-start w-[400px]">
                                {product && product.imageUrls.map((imgUrl, idx) => (
                                    <div key={idx} className="single-image" style={{ marginRight: '10px' }}>
                                        <img
                                            onClick={() => selectImage(idx)}
                                            className="w-[80px]  h-[80px] cursor-pointer rounded-xl transition-all hover:opacity-25 hover:border-[3px] border-orange"
                                            src={imgUrl.startsWith('http') || imgUrl.startsWith('https') ? imgUrl : `${gBASE_URL}/image/${imgUrl}`}
                                            alt={`product-${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* desc */}
                    <div className="description p-6 md:basis-1/2 md:py-[40px]">
                        <p className="text-[14px] tracking-widest uppercase font-[700] mb-6">
                            {product?.category.name}
                        </p>
                        <h1 className="display-5 fw-bolder product-name" style={{ fontFamily: "Unknown Font, monospace" }}>{product?.name}</h1>
                        <p className="my-7">{product?.description}</p>
                        <div className="price flex items-center">
                            <span className="text-3xl font-[700] mr-4">${product?.promotionPrice}</span>
                            <p className="md:hidden line-through text-grayishBlue font-[700] translate-x-[-10px]">
                                ${product?.buyPrice}
                            </p>
                            <span className="bg-paleOrange text-orange font-[700] py-1 px-2 rounded-lg">
                                -{product?.percentDiscount}%
                            </span>

                        </div>
                        <p className="hidden md:block line-through text-grayishBlue font-[700] mt-2">
                            ${product?.buyPrice}
                        </p>

                        <div className="d-flex mt-8">
                            <input className="form-control text-center me-3" id="inputQuantity" type="number"
                                value={quantity}
                                min='1'
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                style={{ width: '4rem' }} />
                            <button className="btn btn-outline-dark flex-shrink-0" type="button" onClick={handleAddToCart}>
                                <i className="bi-cart-fill me-1" />
                                Add to cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <QuantityAlertModal open={showAmountModal} handleClose={() => setShowAmountModal(false)} />
            <ToastContainer />
        </section>
    );
};

export default ProductDetail;
