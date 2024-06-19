import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../../styles/components/productDescription.css';

const ProductDescription = () => {
    const [expanded, setExpanded] = useState(false);
    const [product, setProduct] = useState(null);
    const { productId } = useParams();
    const [imageUrl, setImageUrl] = useState(null);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${gBASE_URL}/product/${productId}`);
                const data = await response.json();
                if (response.ok) {
                    setProduct(data.data);
                    fetchImage(data.data.imageUrls[0]);
                } else {
                    console.error('Error fetching product:', data);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [productId]);

    const fetchImage = async (imageIdOrUrl) => {
        if (imageIdOrUrl.startsWith('http') || imageIdOrUrl.startsWith('https')) {
            setImageUrl(imageIdOrUrl);
        } else {
            try {
                const response = await fetch(`${gBASE_URL}/image/${imageIdOrUrl}`);
                const blob = await response.blob();
                setImageUrl(URL.createObjectURL(blob));
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        }
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        setExpanded(false);
    }, [product]);

    return (
        <div className={`description-container ${expanded ? 'expanded' : ''}`}>
            <div className="row">
                <div className="col-md-6 text-center mb-5 mb-md-0">
                    <img className="card-img-top rounded-4" style={{ width: '80%' }} src={imageUrl} alt={product?.name} />
                </div>
                <div className="col-md-6">
                    <h3>{product?.name}</h3>
                    <hr />
                    {product?.description}
                </div>
            </div>
            <div className='prompt'>
                {!expanded && <a className="button style-1" onClick={toggleExpand}>Read More</a>}
            </div>
        </div>
    );
};

export default ProductDescription;
