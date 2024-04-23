import { combineReducers } from "@reduxjs/toolkit";
import cart from "./cart";

const rootReducer = combineReducers({
  cart: cart,
});

export default rootReducer;
