import counterReducer from "./counterReducer";
import { combineReducers } from 'redux';
import expenseReducer from "./expenseReducer";

const rootReducer = combineReducers({
    counter: counterReducer,
    expenseTracker : expenseReducer
  });
  
  export default rootReducer;