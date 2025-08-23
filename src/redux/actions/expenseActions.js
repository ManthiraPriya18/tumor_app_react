import * as types from './actionTypes';
export function setExpenseData(value) {
    return {
        type: types.EXPENSE_DATA,
        value: value
    }
}
