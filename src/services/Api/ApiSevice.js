import axios from 'axios';
import { ClearUserData, GetUserDetails } from '../Storage/LocalStorage';
import { ROUTE_PATHS } from '../../routesConfig';
import { GetHashedLoginPath } from '../Auth/Auth';
import {  GetAppConfig } from '../config/appConfig.ts';

// Create an Axios instance
let appConfig = await GetAppConfig()

const api = axios.create({

    baseURL: appConfig.useAzureFunctions ? appConfig.azureFunctionsBaseUrl : appConfig.azureFunctionsBaseUrl, // Set your base URL here or from env
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Add any custom headers, such as auth tokens
        const userDetails = GetUserDetails()
        let token = userDetails?.token ?? ""
        let userId = userDetails?.userId ?? ""
        if (token) {
           // config.headers["ChakramToken"] = `${token}`;
            config.headers["Authorization"] = `Bearer ${token}`;
            config.headers["UserId"] = `${userId}`;
        }
        return config;
    },
    (error) => {
        // Handle request errors
        return Promise.reject(error);
    }
);

// Response Interceptor
api.interceptors.response.use(
    (response) => {
        // Process the response if needed
        return response;
    },
    (error) => {
        // Handle response errors, like unauthorized access
        if (error.response && error.response.status === 401) {
            ClearUserData();
            window.location.href = GetHashedLoginPath()
        }
        return Promise.reject(error);
    }
);

export default api;


export const apiRequest = async (method, url, data = null, config = {}) => {
    try {
        const response = await api({
            method,
            url,
            data,
            ...config, 
        });
        return response.data;
    } catch (error) {
        console.error(`Error in API Request - ${method.toUpperCase()} ${url}:`, error);
        throw error;
    }
};
