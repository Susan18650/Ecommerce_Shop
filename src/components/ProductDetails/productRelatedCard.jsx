import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductRelatedCard = ({ products }) => {
    const navigate = useNavigate();

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const handleSeeDetails = (productId) => {
        navigate(`/products/${productId}`);
        window.scrollTo(0, 0);
    };

    return (
        <section className="py-5 bg-light">
            <div className="container px-4 px-lg-5 mt-5">
                <p className="text-center mb-50 text-4xl">- Related products -</p>
                <div className="row gx-4 gx-lg-5 row-cols-xs-1 row-cols-sm-1 row-cols-md-2 row-cols-lg-2 row-cols-xl-4 justify-content-center">
                    {products?.map(product => {
                        const imageUrl = product.imageUrls[0].startsWith('http') || product.imageUrls[0].startsWith('https') ? product.imageUrls[0] : `${gBASE_URL}/image/${product.imageUrls[0]}`;
                        return(
                        <div key={product._id} className="col mb-5">
                            <div className="card rounded-pill text-center overflow-hidden border-0 shadow m-5" style={{ maxWidth: '18rem' }}>
                                <img
                                    src={imageUrl}
                                    alt={product.name} className="card-img-top"
                                    style={{
                                        height: '180px',
                                        objectFit: 'cover',
                                    }}
                                />
                                <div className="card-body bg-dark text-white">
                                    <h5 className="card-title fw-bold" style={{ height: "2.5em", overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h5>
                                    <p className="card-text" style={{ maxHeight: '3.3em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.description}</p>

                                    <a onClick={() => handleSeeDetails(product._id)} className="btn btn-light px-3 rounded-pill">Buy Now</a>
                                    <div className='flex justify-center'>
                                        <p className="mt-3 text-lg text-decoration-line-through">${product.buyPrice}</p>
                                        <p className="mt-3 font-semibold">${product.promotionPrice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>
        </section>
    );
};

export default ProductRelatedCard;


{/* <div className="card h-100">
    <div className="badge bg-dark text-white position-absolute" style={{ top: '0.5rem', right: '0.5rem' }}>Sale</div>
    <img
        className="card-img-top rounded"
        src={product.imageUrls[0]}
        alt={product.name}
        style={{
            height: '145.33px',
            objectFit: 'cover',
        }}
    />
    <div className="card-body p-4">
        <div className="text-center">
            <h5 className="fw-bolder">{product.name}</h5>
            <span className="text-muted text-decoration-line-through">${product.buyPrice}</span>
            ${product.promotionPrice}
        </div>
    </div>
    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
        <div className="text-center">
            <button className="btn btn-outline-dark mt-auto" onClick={() => handleSeeDetails(product._id)}>See Details</button>
        </div>
    </div>
</div> */}