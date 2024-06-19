import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import QuantityAlertModal from '../Modal/cartModal/quantityAlert';

const CartItems = ({ updateTotalPrice, setTotalPrice, discount }) => {
    const [cartItems, setCartItems] = useState([]);
    const [showAmountModal, setShowAmountModal] = useState(false);

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (storedItems.length > 0) {
            setCartItems(storedItems);
        }
    }, []);

    const handleRemoveItem = (index) => {
        const updatedItems = [...cartItems];
        updatedItems.splice(index, 1);
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        localStorage.setItem('cartUpdated', Date.now());
        updateTotalPrice(updatedItems);

        // Calculate the new total price after discount
        let total = 0;
        updatedItems.forEach(item => {
            total += item.quantity * item.promotionPrice;
        });
        setTotalPrice(total - total * (discount / 100) + 20);
    };


    const handleQuantityChange = (index, newQuantity) => {
        const updatedItems = [...cartItems];
        const item = updatedItems[index];

        // Parse the new quantity to an integer
        let quantity = parseInt(newQuantity);

        // If the new quantity is not a number, use 1 as the default value
        if (isNaN(quantity)) {
            quantity = 1;
        }

        if (quantity > item.amount) {
            setShowAmountModal(true);
            return;
        }

        item.quantity = quantity;
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
        updateTotalPrice(updatedItems);

        // Calculate the new total price after discount
        let total = 0;
        updatedItems.forEach(item => {
            total += item.quantity * item.promotionPrice;
        });
        setTotalPrice(total - total * (discount / 100) + 20);
    };

    const truncateTitle = (title) => {
        const words = title.split(' ');
        if (words.length > 3) {
            return words.slice(0, 2).join(' ') + '...';
        }
        return title;
    };


    return (
        <>
            {cartItems.length > 0 && cartItems.map((item, index) => {
                const imageUrl = item.imageUrls[0].startsWith('http') || item.imageUrls[0].startsWith('https') ? item.imageUrls[0] : `${gBASE_URL}/image/${item.imageUrls[0]}`;
                return (
                    <tr key={index}>
                        <td>
                            <div className="cart-info">
                                <img className='rounded-1 max-[600px]:w-13 max-[600px]:h-13 md:w-20 md:h-20' src={imageUrl} alt={item.name} />
                                <div>
                                    <p className="product-title">{truncateTitle(item.name)}</p>
                                    <button className="btn-remove" onClick={() => handleRemoveItem(index)}>Remove</button>
                                </div>
                            </div>
                        </td>
                        <td className="price">${item.quantity * item.promotionPrice}</td>
                        <td>
                            <div className="input-container">
                                <button className="btn-decrement" onClick={() => handleQuantityChange(index, Math.max(1, item.quantity - 1))}>-</button>
                                <input
                                    className="input-quanlity"
                                    type="number"
                                    value={item.quantity}
                                    min="1"
                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 1)}
                                />
                                <button className="btn-increment" onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
                            </div>
                        </td>
                        <td className="unit-price">${item.promotionPrice}</td>
                        <QuantityAlertModal open={showAmountModal} handleClose={() => setShowAmountModal(false)} />
                    </tr>
                );
            })}

        </>
    )
}

export default CartItems;