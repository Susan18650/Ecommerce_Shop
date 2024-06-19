import React from 'react';
import { Card, CardTitle, CardText, CardBody, Button } from "reactstrap";
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const handleGoShop = () => {
        navigate(`/products/${product._id}`);
    };

    const imageUrl = product.imageUrls[0].startsWith('http') || product.imageUrls[0].startsWith('https') ? product.imageUrls[0] : `${gBASE_URL}/image/${product.imageUrls[0]}`;

    return (
        <Card className="shadowProp mx-2 my-2" style={{ width: '18rem' }}>
            <img 
                src={imageUrl} 
                alt={product.name} 
                className='rounded pt-2' 
                style={{ width: '265px', height: '215px', objectFit: 'container'}}
            />
            <div className="badge bg-dark text-white position-absolute" style={{ top: '1em', right: '1em' }}>-{product.percentDiscount.toFixed(0)}%</div>
            <CardBody>
                <CardTitle className=" mt-4"><b className="product-name">{product.name}</b></CardTitle>
                <CardText className="text-secondary product-description" style={{ maxHeight: '3.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.description}</CardText>
                <CardText className="">
                    <b className="text-secondary product-price text-decoration-line-through">${product.buyPrice}</b>
                    <b className="text-success mx-1 product-promo-price">${product.promotionPrice}</b>
                </CardText>
                <Button color="primary" size="1g" outline style={{ borderRadius: 20 }} onClick={handleGoShop}>Go Shop</Button>
            </CardBody>
        </Card>
    );
}

export {ProductCard};
