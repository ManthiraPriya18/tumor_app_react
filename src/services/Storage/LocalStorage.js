export const USER_DETAILS = "USER_DETAILS"
export const USER_ID = "USER_ID"
export const USER_PASSWORD = "USER_PASSWORD"
export const EXPENSE_OPTIONS = "EXPENSE_OPTIONS"
export function GetUserDetails() {
    let userDetails = localStorage.getItem(USER_DETAILS)
    if (userDetails != null) {
        return JSON.parse(userDetails)
    }
    return null;
}
export function SetUserDetails(userDetails) {
    localStorage.setItem(USER_DETAILS, JSON.stringify(userDetails))
}


export function ClearUserData() {
    localStorage.removeItem(USER_DETAILS)
}

export function setUserIdInLocalStorage(userId) {
    localStorage.setItem(USER_ID, userId)
}

export function GetUserIdFromLocalStorage() {
    return localStorage.getItem(USER_ID)
}
export function setUserPasswordInLocalStorage(userPassword) {
    localStorage.setItem(USER_PASSWORD, userPassword)
}

export function GetUserPasswordFromLocalStorage() {
    return localStorage.getItem(USER_PASSWORD)
}

export function GetExpenseOptionsFromLocal(userId){
    // Let the expense options can be fetched everytime
    return null;
    let data = localStorage.getItem(userId+EXPENSE_OPTIONS)
    if(data!=null){
        return JSON.parse(data)
    }
    return null
}

export function SetExpenseOptionsInLocal(userId,expenseOptions ){
    localStorage.setItem(userId+EXPENSE_OPTIONS,JSON.stringify(expenseOptions))
}