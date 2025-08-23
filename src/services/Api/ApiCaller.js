import { GetChakramAIBaseUrl, supabase } from "../../supabase/SupabaseClient.ts";
import { ExpenseDetailsTableDetails, ExpenseOptionsTableDetails, SupabaseFunctionsConstants } from "../../supabase/SupabaseConstants.ts";
import { GetAppConfig } from "../config/appConfig.ts";
import { GetExpenseOptionsFromLocal, GetUserDetails, SetExpenseOptionsInLocal, SetUserDetails } from "../Storage/LocalStorage";
import { CHAKRAM_STATUS_CODE, ENDPOINTS, HTTP_VERBS } from "./ApiHelpers";
import { apiRequest } from "./ApiSevice";

const CheckForUsingSupabase = async () => {
    let config = await GetAppConfig();
    return !config.useAzureFunctions
}

export const LoginUser = async (userId, password) => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await LoginUserSupabase(userId, password)
    }
    return await LoginUserAzFunc(userId, password)
}

const LoginUserSupabase = async (userId, password) => {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userId, // Supabase uses email as the login ID
            password,
        });
        if (error) {
            return { success: false }
        }
        let resp = {
            "userId": data?.user?.id,
            "userName": data?.user?.email,
            "expirationTimeIST": new Date(data.session.expires_at * 1000).toISOString(),
            "token": data.session.access_token
        }
        SetUserDetails(resp)
        return { success: true, data: resp };
    }
    catch (err) {
        return { success: false }

    }
}

const LoginUserAzFunc = async (userId, password) => {
    try {
        let loginEndpointData = ENDPOINTS.LOGIN
        let payload = {
            "userId": userId,
            "password": password
        }
        const data = await apiRequest(loginEndpointData.VERB, loginEndpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS) {
            SetUserDetails((data?.chakramResponse))
            return {
                success: true,
                data: data?.chakramResponse ?? {}
            }
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

export const GetExpenseOptions = async () => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await GetExpenseOptionsSupabase()
    }
    return await GetExpenseOptionsAzFunc()
}

const GetExpenseOptionsSupabase = async () => {
    try {
        const { data, error } = await supabase
            .from(ExpenseOptionsTableDetails.TableName)
            .select('*');

        if (error || !(data?.length > 0)) {
            return {
                success: false
            }
        }
        let options = data[0]
        options.expenseGroup = options?.ExpenseGroup?.toString().split(",") ?? []
        options.expensePaidBy = options?.ExpensePaidBy?.toString().split(",") ?? []

        return {
            success: true,
            data: options
        }
    }
    catch {
        return {
            success: false
        }
    }
}

const GetExpenseOptionsAzFunc = async () => {
    try {
        let endpointData = ENDPOINTS.GET_EXPENSE_OPTIONS
        let payload = {}
        let userDetails = GetUserDetails();
        if (userDetails?.userId) {
            let expenseOptionsFromLocal = GetExpenseOptionsFromLocal(userDetails?.userId)
            if (expenseOptionsFromLocal != null) {
                return expenseOptionsFromLocal
            }
        }
        const data = await apiRequest(endpointData.VERB, endpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS &&
            data?.chakramResponse?.length > 0
        ) {
            let expenseOptionsData = {
                success: true,
                data: {
                    expenseGroup: data?.chakramResponse[0]?.expenseGroup ?? [],
                    expensePaidBy: data?.chakramResponse[0]?.expensePaidBy ?? []
                }
            }
            SetExpenseOptionsInLocal(data?.chakramResponse[0]?.userId, expenseOptionsData)
            return expenseOptionsData
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

export const GetExpense = async (payload) => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await GetExpenseSupabase(payload)
    }
    return await GetExpenseAzFunc(payload)
}

const GetExpenseAzFunc = async (payload) => {
    try {
        let endpointData = ENDPOINTS.GET_EXPENSE

        const data = await apiRequest(endpointData.VERB, endpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS) {
            return {
                success: true,
                data: data?.chakramResponse ?? []
            }
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

const GetExpenseSupabase = async (payload) => {
    try {
        let query = supabase
            .from(ExpenseDetailsTableDetails.TableName)
            .select("*");

        // 1. Amount filter
        if (payload.AmountStartRange !== undefined && payload.AmountEndRange !== undefined) {
            query = query.gte(ExpenseDetailsTableDetails.ItemCost_ColName, payload.AmountStartRange)
                .lte(ExpenseDetailsTableDetails.ItemCost_ColName, payload.AmountEndRange);
        }

        // 2. Spend DateTime range filter
        if (payload.SpendFilterStartDateTimeInUtc && payload.SpendFilterEndDateTimeInUtc) {
            query = query.gte(ExpenseDetailsTableDetails.SpendDateTime_ColName, payload.SpendFilterStartDateTimeInUtc)
                .lte(ExpenseDetailsTableDetails.SpendDateTime_ColName, payload.SpendFilterEndDateTimeInUtc);
        }

        // 3. Entry DateTime range filter
        if (payload.EntryFilterStartDateTimeInUtc && payload.EntryFilterEndDateTimeInUtc) {
            query = query.gte(ExpenseDetailsTableDetails.EntryDateTime_ColName, payload.EntryFilterStartDateTimeInUtc)
                .lte(ExpenseDetailsTableDetails.EntryDateTime_ColName, payload.EntryFilterEndDateTimeInUtc);
        }

        // 4. ItemGroup filter
        if (payload.ItemGroupList && payload.ItemGroupList.length > 0) {
            query = query.in(ExpenseDetailsTableDetails.ItemGroup_ColName, payload.ItemGroupList);
        }

        // 5. PaidBy filter
        if (payload.PaidByList && payload.PaidByList.length > 0) {
            query = query.in(ExpenseDetailsTableDetails.PaidBy_ColName, payload.PaidByList);
        }

        // 6. Keywords filter
        if (payload.Keywords && payload.Keywords.length > 0) {
            const keywords = payload.Keywords.map((keyword) => keyword.toLowerCase());
            query = query.or(
                keywords
                    .map(
                        (keyword) =>
                            `${ExpenseDetailsTableDetails.ItemName_ColName}.ilike.%${keyword}%` +
                            `,${ExpenseDetailsTableDetails.Notes_ColName}.ilike.%${keyword}%`
                    )
                    .join(",")
            );
        }
        query = query.order(ExpenseDetailsTableDetails.SpendDateTime_ColName, { ascending: false })
        // Execute the query
        const { data, error } = await query;
        if (error) {
            return {
                success: false
            }
        }
        return {
            success: true,
            data: data
        }

    }
    catch {
        return {
            success: true,
            data: []
        }
    }
}

export const DeleteExpense = async (payload) => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await DeleteExpenseSupabase(payload)
    }
    return await DeleteExpenseAzFunc(payload)
}

const DeleteExpenseSupabase = async (payload) => {
    try {
        const { error } = await supabase
            .from(ExpenseDetailsTableDetails.TableName)
            .delete()
            .eq(ExpenseDetailsTableDetails.Id_ColName, payload?.ResourceId ?? "");
        if (error) {
            return { success: false }
        }
        return { success: true }
    }
    catch {
        return { success: false }

    }
}

const DeleteExpenseAzFunc = async (payload) => {
    try {
        let endpointData = ENDPOINTS.DELETE_EXPENSE

        const data = await apiRequest(endpointData.VERB, endpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS) {
            return {
                success: true,
                data: data?.chakramResponse ?? []
            }
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

export const UpdateExpense = async (payload) => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await UpdateExpenseSupabase(payload)
    }
    return await UpdateExpenseAzFunc(payload)
}

const UpdateExpenseSupabase = async (payload) => {
    try {
        let supabasePayload = {}
        if (payload?.ItemName) {
            supabasePayload[ExpenseDetailsTableDetails.ItemName_ColName] = payload?.ItemName
        }
        if (payload?.ItemCost) {
            supabasePayload[ExpenseDetailsTableDetails.ItemCost_ColName] = payload?.ItemCost
        }
        if (payload?.Notes) {
            supabasePayload[ExpenseDetailsTableDetails.Notes_ColName] = payload?.Notes
        }
        if (payload?.ItemGroup) {
            supabasePayload[ExpenseDetailsTableDetails.ItemGroup_ColName] = payload?.ItemGroup
        }
        if (payload?.PaidBy) {
            supabasePayload[ExpenseDetailsTableDetails.PaidBy_ColName] = payload?.PaidBy
        }
        if (payload?.SpendDateTimeInUtc) {
            supabasePayload[ExpenseDetailsTableDetails.SpendDateTime_ColName] = payload?.SpendDateTimeInUtc
        }
        const { error } = await supabase
            .from(ExpenseDetailsTableDetails.TableName)
            .update(supabasePayload)
            .eq(ExpenseDetailsTableDetails.Id_ColName, payload?.ResourceId);
        if (error) {
            return {
                success: false
            }
        }

        return {
            success: true
        }
    }
    catch {
        return {
            success: false
        }
    }
}

const UpdateExpenseAzFunc = async (payload) => {
    try {
        let endpointData = ENDPOINTS.UPDATE_EXPENSE

        const data = await apiRequest(endpointData.VERB, endpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS) {
            return {
                success: true,
                data: data?.chakramResponse ?? []
            }
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

export const AddExpense = async (payload) => {
    let canUseSupabase = await CheckForUsingSupabase()
    if (canUseSupabase) {
        return await AddExpenseSupabase(payload)
    }
    return await AddExpenseAzFunc(payload)
}

const AddExpenseSupabase = async (payload) => {
    try {
        let userDetails = GetUserDetails()
        if (userDetails == null || (userDetails?.userId == null)) {
            return {
                success: false
            }
        }
        let supabasePayload = {
            [ExpenseDetailsTableDetails.UserId_ColName]: userDetails?.userId,
            [ExpenseDetailsTableDetails.ItemName_ColName]: payload?.ItemName ?? "",
            [ExpenseDetailsTableDetails.Notes_ColName]: payload?.Notes ?? "",
            [ExpenseDetailsTableDetails.ItemCost_ColName]: payload?.ItemCost ?? "",
            [ExpenseDetailsTableDetails.PaidBy_ColName]: payload?.PaidBy ?? "",
            [ExpenseDetailsTableDetails.ItemGroup_ColName]: payload?.ItemGroup ?? "",
            [ExpenseDetailsTableDetails.SpendDateTime_ColName]: payload?.SpendDateTimeInUtc ?? "",
            // Adding ExpenseDetailsTableDetails.SpendDateTimeZ_ColName(spendDateTimeZ) as a column to store the UTC date,
            // Since when opening the expense details SpendDateTime is converting to IST
            // Leads to overriding, Hence storing UTC date as well -> In future can use this to update
            // When the proper version implemented
            [ExpenseDetailsTableDetails.SpendDateTimeZ_ColName]: payload?.SpendDateTimeInUtc ?? ""
        }
        const { error } = await supabase
            .from(ExpenseDetailsTableDetails.TableName)
            .insert([
                supabasePayload
            ]);

        if (error) {
            return {
                success: false
            }
        }

        return {
            success: true
        }
    }
    catch {
        return {
            success: false
        }
    }
}

const AddExpenseAzFunc = async (payload) => {
    try {
        let endpointData = ENDPOINTS.ADD_EXPENSE

        const data = await apiRequest(endpointData.VERB, endpointData.PATH, payload);
        if (data?.chakramStatusCode === CHAKRAM_STATUS_CODE.SUCCESS) {
            return {
                success: true,
                data: data?.chakramResponse ?? []
            }
        }

        return {
            success: false
        }
    }
    catch (ex) {
        return {
            success: false
        }
    }
}

export const CreateExpenseObjectByAI = async (payload) => {
    try {
        payload = {
            ...payload,
            "userId": GetUserDetails()?.userId ?? ""
        }
        const { data, error } = await supabase.functions.invoke(SupabaseFunctionsConstants.CHAKRAM_AI_ENDPOINT, {
            body: payload
        });
        console.log("AI Response from Supabase:", data, error);
        let resp = data?.data ?? [];
        if (resp?.length !== 7) {
            return {
                success: false,
                error: error?.message || "Length of AI response is not 7, something went wrong"
            }
        }
        let createObj = {
            "userId": resp[0],
            "itemName": resp[1],
            "itemCost": parseInt(resp[3], 10),
            "spendDateTime": resp[6].replace('Z', '').trim(),
            "paidBy": resp[4],
            "itemGroup": resp[5],
            "notes": resp[2]
        }

        return {
            success: true,
            data: createObj
        }

    }
    catch (ex) {
        return {
            success: false,
            error: ex?.message || "Error while calling AI function"
        }
    }


}