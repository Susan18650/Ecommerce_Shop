import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "./content.css"
import { useNavigate } from 'react-router-dom';
const Content = () => {
    const [products, setProducts] = useState([]);

    const navigate = useNavigate();

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PRODUCT_DATABASE_URL}/product`)
            .then(response => response.json())
            .then(data => {
                if (data && Array.isArray(data.data)) {
                    const validProducts = data.data.filter(product => !product.isDeleted);
                    const randomProducts = validProducts.sort(() => 0.5 - Math.random()).slice(0, 7);
                    setProducts(randomProducts);
                } else {
                    console.error('Invalid data structure:', data);
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleGoShop = (productId) => {
        navigate(`/products/${productId}`);
    };

    useEffect(() => {
        const nextButton = document.getElementById('next');
        const prevButton = document.getElementById('prev');
        const carousel = document.querySelector('.carousel');
        const listHTML = document.querySelector('.carousel .list');

        const showSlider = (type) => {
            let items = document.querySelectorAll('.carousel .list .item');
            if (items.length === 0) {
                return;
            }

            nextButton.style.pointerEvents = 'none';
            prevButton.style.pointerEvents = 'none';

            carousel.classList.remove('next', 'prev');
            if (type === 'next') {
                listHTML.appendChild(items[0]);
                carousel.classList.add('next');
            } else {
                listHTML.prepend(items[items.length - 1]);
                carousel.classList.add('prev');
            }
            clearTimeout(unAcceppClick);
            unAcceppClick = setTimeout(() => {
                nextButton.style.pointerEvents = 'auto';
                prevButton.style.pointerEvents = 'auto';
            }, 2000);
        };

        nextButton.onclick = () => showSlider('next');
        prevButton.onclick = () => showSlider('prev');

        let unAcceppClick;

        return () => {
            nextButton.onclick = null;
            prevButton.onclick = null;
        };
    }, []);

    return (
        <>
            <div className="carousel">
                <div className="list">
                    {products.map((product) => {
                        const imageUrl = product.imageUrls[0].startsWith('http') || product.imageUrls[0].startsWith('https') ? product.imageUrls[0] : `${gBASE_URL}/image/${product.imageUrls[0]}`;
                        return (
                            <div className="item" key={product._id}>
                                <img src={imageUrl} alt={product.name} />
                                <div className="introduce">
                                    <div className="title">{product.name}</div>
                                    <div className="topic">{product.category.name}</div>
                                    <div className="des">{product.description}</div>
                                    <button className="red_button" onClick={() => handleGoShop(product._id)}>shop now</button>
                                </div>
                            </div>
                        );
                    })}

                </div>
                <div className="arrows">
                    <button id="prev">&lt;</button>
                    <button id="next">&gt;</button>
                </div>
            </div>
        </>
    );
};

export { Content };
