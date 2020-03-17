import TabBar from './views/tabBar';
import Home from './views/home';
import Shop from './views/shop';
import Release from './views/release';
import Message from './views/message';
import Center from './views/center';
import Login from './views/login';
import PhoneRegister from './views/login/phoneRegister';
import SmsCheck from './views/login/smsCheck';
import PersonInfo from './views/center/personInfo';
import CreateRecipes from './views/release/createRecipes';
import CreateDynamic from './views/release/createDynamic';

const routes = [
    {
        path: '/tab',
        component: TabBar,
        redirect: '/tab/home',
        // exact: true,
        children: [
            {
                path: '/tab/home',
                component: Home
            },
            {
                path: '/tab/shop',
                component: Shop
            },
            {
                path: '/tab/release',
                component: Release
            },
            {
                path: '/tab/message',
                component: Message
            },
            {
                path: '/tab/center',
                component: Center
            }
        ]
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/phoneRegister',
        component: PhoneRegister
    },
    {
        path: '/smsCheck',
        component: SmsCheck
    },
    {
        path: '/personInfo',
        component: PersonInfo
    },
    {
        path: '/createRecipes',
        component: CreateRecipes
    },
    {
        path: '/createDynamic',
        component: CreateDynamic
    },
];
 
export {routes}