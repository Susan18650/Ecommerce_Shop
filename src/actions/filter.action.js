import axios from "axios";
import {
    FETCH_FILTER_PRODUCT,
    FETCH_FILTER_DATA_ERROR,
    FETCH_FILTER_PENDING,
} from "../constants/constant";

export const fetchFilterData = (name, category, minPrice, maxPrice, pageFilter, limit) => {
    return async (dispatch) => {
        let apiUrl = `${process.env.REACT_APP_API_PRODUCT_DATABASE_URL}/product`;

        const queryParams = {
            name: name,
            category: Array.isArray(category) && category.length > 0 ? category.join('&category=') : null,
            minPrice: minPrice,
            maxPrice: maxPrice,
            page: pageFilter,
            limit: limit
        };

        const queryStrings = Object.entries(queryParams)
            .filter(([key, value]) => value !== undefined && value !== null && value !== '')
            .map(([key, value]) => `${key}=${value}`)
            .join('&');

        if (queryStrings) {
            apiUrl += `?${queryStrings}`;
        }

        try {
            await dispatch({
                type: FETCH_FILTER_PENDING,
            });
            const response = await axios(apiUrl);
            const data = await response.data.data;
            const validProduct = await data.filter((cus) => cus.isDeleted != true);
            await dispatch({
                type: FETCH_FILTER_PRODUCT,
                item: validProduct,
                totalFilterPage: response.data.totalFilterPage
            });
            dispatch({
                type: 'SAVE_FILTER_FIELDS',
                payload: { name, category, minPrice, maxPrice }
            });
        } catch (error) {
            return dispatch({
                type: FETCH_FILTER_DATA_ERROR,
                error: error,
            });
        }
    };
};
