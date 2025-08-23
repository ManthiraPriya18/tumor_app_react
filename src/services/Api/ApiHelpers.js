export const HTTP_VERBS = {
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
    GET: "get"
}

export const ENDPOINTS = {
    LOGIN: {
        VERB: HTTP_VERBS.POST,
        PATH: "/Login"
    },
    GET_EXPENSE_OPTIONS: {
        VERB: HTTP_VERBS.GET,
        PATH: "/GetExpenseOptions"
    },
    GET_EXPENSE: {
        VERB: HTTP_VERBS.POST,
        PATH: "/GetExpense"
    },
    DELETE_EXPENSE: {
        VERB: HTTP_VERBS.DELETE,
        PATH: "/DeleteExpense"
    }
    ,
    UPDATE_EXPENSE: {
        VERB: HTTP_VERBS.PATCH,
        PATH: "/UpdateExpense"
    },
    
    ADD_EXPENSE: {
        VERB: HTTP_VERBS.POST,
        PATH: "/AddExpense"
    }
}

export const CHAKRAM_STATUS_CODE = {
    SUCCESS: 60100
}