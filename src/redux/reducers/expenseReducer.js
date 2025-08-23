import * as types from '../actions/actionTypes'

const expenseReducer = (state={}, action) => {
    switch (action.type) {
      case types.EXPENSE_DATA:
        return {...state,[types.EXPENSE_DATA]:action.value};
      default:
        return state;
    }
  };
  
  export default expenseReducer;
  