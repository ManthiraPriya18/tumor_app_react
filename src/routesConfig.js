
import { HomePage } from "./components/HomePage/HomePage";
import { LandingPage } from "./components/LandingPage/LandingPage";
import { LoginPage } from "./components/LoginPage/LoginPage";
export const ROUTE_PATHS = {
    EXPENSE_TRACKER: '/expense-tracker',
    NOTES: '/notes',
    LOGIN: '/login',
    HOME: '/home',
    LANDING: '/',
    NOT_FOUND: '*',
};

const routesConfig = [
    {
        path: ROUTE_PATHS.NOT_FOUND,
        component: LoginPage,
        protected: false,
    },
    {
        path: ROUTE_PATHS.LOGIN,
        component: LoginPage,
        protected: false,
    },
    {
        path: ROUTE_PATHS.HOME,
        component: HomePage,
        protected: false,
    },
    {
        path: ROUTE_PATHS.LANDING,
        component: LandingPage,
        protected: false,
    }

];

export default routesConfig;

