import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ProductCard } from './Card';
import { Row, Col } from "reactstrap";
import { Pagination, Grid, Container } from "@mui/material";
import {CircularProgress} from '@mui/material';
import { PageChange, PageChangeFilter, getDataItem } from '../../actions/product.action';
import { fetchFilterData } from '../../actions/filter.action';

export const ProductPagination = () => {

    const dispatch = useDispatch();

    const { page, noPage, limit } = useSelector((reduxData) => reduxData?.dataReducer);

    const handlePageChange = (event, value) => {

        dispatch(PageChange(value));
        dispatch(getDataItem(value, limit));
        window.scrollTo(0, 0)

    };

    return (
        <Pagination
            shape="rounded"
            color="secondary"
            count={noPage}
            page={page}
            onChange={handlePageChange}
        />
    );
}

export const ProductPaginationFilter = () => {

    const dispatch = useDispatch();

    const { pageFilter, noPageFilter, limit, filterFields } = useSelector((reduxData) => reduxData?.dataReducer);

    const handlePageChange = (event, value) => {
        dispatch(PageChangeFilter(value));
        dispatch(fetchFilterData(filterFields.name, filterFields.category, filterFields.minPrice, filterFields.maxPrice, value, limit));
        window.scrollTo(0, 0)
    };

    return (
        <>
            <Pagination
                shape="rounded"
                color="secondary"
                count={noPageFilter}
                page={pageFilter}
                onChange={handlePageChange}
            ></Pagination>
        </>
    );
};

const ProductContainerShop = () => {

    const { items, noPageFilter, pending  } = useSelector(state => state?.dataReducer);

    return (
        <Container className="px-0 my-5">
            <React.Fragment>
                {pending ? (
                    <CircularProgress />
                ) : (
                    <>
                        <Row className="d-flex flex-wrap justify-content-evenly">
                            {items && items.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </Row>
                        <Row className="justify-content-center">
                            <Col xs="auto">
                                <Grid item lg={12} md={12} sm={12} xs={12} mt={5}>
                                    {items.length === 0 ? null : noPageFilter !== 0 ? <ProductPaginationFilter /> : <ProductPagination />}
                                </Grid>
                            </Col>
                        </Row>
                    </>
                )}
            </React.Fragment>
        </Container>
    );
};

export { ProductContainerShop };
