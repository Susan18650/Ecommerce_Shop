import {
    PRODUCT_FETCH_SUCCESS,
    PRODUCT_FETCH_ERROR,
    PRODUCT_FETCH_PENDING,
    PAGE_CHANGE,
    FILTER_PAGE_CHANGE,
    RELATED_PRODUCT_FETCH_SUCCESS,
    RELATED_PRODUCT_FETCH_ERROR
} from "../constants/constant";
import axios from "axios";

//Get all products
export const getDataItem = (page, limit) => {
    return async (dispatch) => {
        try {
            await dispatch({
                type: PRODUCT_FETCH_PENDING,
            });
            const vQueryString = new URLSearchParams();
            vQueryString.append("limit", limit);
            vQueryString.append("page", page);
            const response = await axios(
                process.env.REACT_APP_API_PRODUCT_DATABASE_URL +
                "/product?" +
                vQueryString.toString(),
            );

            const data = await response.data.data;
            const validProduct = await data.filter((product) => product.isDeleted != true);
            return dispatch({
                type: PRODUCT_FETCH_SUCCESS,
                totalPage: response.data.totalPage,
                items: validProduct,
            });
        } catch (error) {
            return dispatch({
                type: PRODUCT_FETCH_ERROR,
                error: error,
            });
        }
    };
};

export const fetchProductsByCategory = (category) => {
    return async (dispatch) => {
        try {

            const apiUrl = `${process.env.REACT_APP_API_PRODUCT_DATABASE_URL}/product?category=${category}`;

            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && Array.isArray(data.data)) {
                dispatch({
                    type: RELATED_PRODUCT_FETCH_SUCCESS,
                    relatedProduct: data.data
                });
            } else {
                console.error('Invalid data structure:', data);
                dispatch({ type: RELATED_PRODUCT_FETCH_ERROR, error: 'Invalid data structure' });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            dispatch({ type: RELATED_PRODUCT_FETCH_ERROR, error: 'Error fetching data' });
        }
    };
};

export const PageChange = (page) => {
    return {
        type: PAGE_CHANGE,
        page: page,
    };
};
export const PageChangeFilter = (page) => {
    return {
        type: FILTER_PAGE_CHANGE,
        page: page,
    };
};
