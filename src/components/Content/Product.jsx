import React, { useState, useEffect } from 'react';
import { ProductCard } from './Card';
import { Container, Row, Col } from "reactstrap";
import axios from 'axios';

const ProductHomepage = () => {

    const [products, setProducts] = useState([]);
    const [visible, setVisible] = useState(8); // Số lượng sản phẩm hiển thị ban đầu

    const gBASE_URL = process.env.REACT_APP_API_PRODUCT_DATABASE_URL;

    const handleViewMore = () => {
        setVisible((prevValue) => prevValue + 8); // Hiển thị thêm 8 sản phẩm mỗi lần nhấn
    };

    const getProducts = async () => {
        try {
            const response = await axios.get(`${gBASE_URL}/product?limit=unlimit`);
            if (response.status === 200) {
                const activeProducts = response.data.data.filter(product => !product.isDeleted);
                return activeProducts;
            } else {
                console.error('Error while fetching products:', response.status, response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Error while fetching products:', error);
            return [];
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const data = await getProducts();
            setProducts(data);
        };
        fetchData();
    }, []);

    return (
        <Container className="px-0 my-5">
            <div>
                <Row className="d-flex flex-wrap justify-content-evenly">
                    {products.slice(0, visible).map((product) => (
                        <ProductCard key={product?._id} product={product} />
                    ))}
                </Row>
                {visible < products.length && (
                    <Row className="justify-content-center">
                        <Col xs="auto">
                            <button onClick={handleViewMore} className="btn" style={{ backgroundColor: "rgb(238, 77, 45)", color: "white" }}>View More</button>
                        </Col>
                    </Row>
                )}
            </div>
        </Container>
    );
};

export { ProductHomepage };
