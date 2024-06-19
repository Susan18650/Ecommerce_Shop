import { combineReducers } from "redux";

import { dataReducer } from "./product.reducer";
import { locationReducer } from "./location.reducer";

const rootReducer = combineReducers({
    dataReducer,
    locationReducer
});

export default rootReducer;