import { PAGE_CHANGE, FETCH_FILTER_PRODUCT, PRODUCT_FETCH_SUCCESS, PRODUCT_FETCH_PENDING, FILTER_PAGE_CHANGE, RESET_PAGE_FILTER, FETCH_FILTER_PENDING, FETCH_FILTER_DATA_ERROR, RELATED_PRODUCT_FETCH_SUCCESS, RELATED_PRODUCT_FETCH_ERROR } from "../constants/constant";

const initialState = {
    page: 1,
    noPage: 0,
    limit: 9,
    pending: false,
    error: null,
    items: [],
    itemsFilter: [],
    noPageFilter: 0,
    pageFilter: 1,
    filterFields: {
        name: null,
        category: null,
        minPrice: null,
        maxPrice: null
    },
    relatedProduct: []
};

// Control all product, page, filter product.
export const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case PRODUCT_FETCH_PENDING:
            state.pending = true;
            break;
        case PRODUCT_FETCH_SUCCESS:
            state.pending = false;
            state.noPage = action.totalPage;
            state.items = action.items;
            state.itemsFilter = []
            state.noPageFilter = 0
            state.error = null
            break;
        case RESET_PAGE_FILTER:
            state.pageFilter = action.pageFilter
            break
        case FETCH_FILTER_PENDING:
            return {
                ...state,
                pending: true,
            };
        case FETCH_FILTER_PRODUCT:
            state.pending = false;
            state.items = action.item
            state.itemsFilter = action.item
            state.noPageFilter = action.totalFilterPage;
            break
        case 'SAVE_FILTER_FIELDS':
            return {
                ...state,
                filterFields: action.payload
            };
        case PAGE_CHANGE:
            state.page = action.page;
            break;
        case FILTER_PAGE_CHANGE:
            state.pageFilter = action.page;
            break;
        case FETCH_FILTER_DATA_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error,
            };
        case RELATED_PRODUCT_FETCH_SUCCESS:
            return {
                ...state,
                relatedProduct: action.relatedProduct,
                pending: false,
            };
        case RELATED_PRODUCT_FETCH_ERROR:
            return {
                ...state,
                pending: false,
                error: action.error,
            };

        default:
            break;
    }

    return { ...state };
};
