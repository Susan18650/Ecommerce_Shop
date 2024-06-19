import React from 'react';
import { useSelector } from 'react-redux';
import ProductRelatedCard from './productRelatedCard';

const ProductRelated = () => {
    const relatedProducts = useSelector(state => state?.dataReducer?.relatedProduct);

    const limitedProducts = relatedProducts.slice(0, 8);

    return (
        <>
            <ProductRelatedCard products={limitedProducts} />
        </>
    );
};

export default ProductRelated;
