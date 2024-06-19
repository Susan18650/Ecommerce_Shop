import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProductsByCategory } from '../actions/product.action';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'react-toastify/dist/ReactToastify.css';

import ProductRelated from '../components/ProductDetails/productRelated';
import ProductDescription from '../components/ProductDetails/productDescription';
import ProductDetail from '../components/ProductDetails/productDetail';
import Cursor from '../components/Cursor/cursor';
import { Footer } from '../components/Footer/footer';
import Breadcrumb from '../components/BreadCrumb/breadCrumb';
import GoToTop from '../components/scroll-to-top';
import NavbarSection from '../components/navbar/navbar';

const ProductInformation = () => {
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const dispatch = useDispatch();
    const [product, setProduct] = useState(null);
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
                    // console.error('Error fetching product:', data);
                }
            } catch (error) {
                // console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    const breadcrumbItems = [
        { name: "Home", url: "/" },
        { name: "All Product", url: "/products" },
        { name: product ? product?.name : 'Product', url: `/products/${productId}` }
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (product && product?.category) {
            product.category.forEach(category => {
                dispatch(fetchProductsByCategory(category.name));
            });
        }
    }, [product && product?.category]);
    
    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItemsCount(storedItems.length);
    }, []);
    const handleAddToCart = (count) => {
        setCartItemsCount(count);
    };

    return (
        <div className=''>
            <NavbarSection />
            <Breadcrumb items={breadcrumbItems} />
            <ProductDetail onAddToCart={handleAddToCart} />
            <ProductDescription />
            <ProductRelated />
            <GoToTop/>
            <Cursor/>
            <Footer />
        </div>
    )
}
export default ProductInformation;