import React from 'react';
import styled from "styled-components";
import { CircularProgress } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import { useSelector } from "react-redux";

import NavbarSection from '../components/navbar/navbar';
import { Footer } from '../components/Footer/footer';
import Breadcrumb from '../components/BreadCrumb/breadCrumb';
import GoToTop from '../components/scroll-to-top';
import Cursor from '../components/Cursor/cursor';
import { ProductNotFound } from '../components/NotFound/ProductNotFound';

import { ProductContainerShop } from '../components/Product/ProductContainerShop';
import ProductFilter from '../components/Product/ProductFilter';

const ProductList = () => {

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "All Product", url: "/products" }
  ];

  const handleFetchError = useSelector(state => state?.dataReducer?.error);
  const productList = useSelector(state => state?.dataReducer?.items);
  const pending = useSelector(state => state?.dataReducer?.pending);

  return (
    <Wrapper>
      <NavbarSection />
      <Breadcrumb items={breadcrumbItems} />
      <div className='product-filter-list container grid grid-filter-column gap-6'>
        <div className="product-filter d-flex justify-center">
          <ProductFilter />
        </div>
        <section className="bg-light" style={{ borderRadius: '15px' }}>
          {productList.length === 0 || handleFetchError ? <ProductNotFound /> : (pending ? <CircularProgress /> : <ProductContainerShop />)}
        </section>
      </div>
      <GoToTop />
      <Cursor />
      <Footer />
    </Wrapper>
  );
}
const Wrapper = styled.section`
  .grid-filter-column {
    grid-template-columns: 0.2fr 1fr;
  }

  @media (max-width:768px) {
    .grid-filter-column {
      grid-template-columns: 1fr;
    }
  }
`;
export default ProductList;
