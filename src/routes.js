import TabBar from './views/tabBar';
import Home from './views/home';
import Information from './views/information';
import Release from './views/release';
import Message from './views/message';
import Center from './views/center';
import Login from './views/login';
import PhoneRegister from './views/login/phoneRegister';
import SmsCheck from './views/login/smsCheck';
import PersonInfo from './views/center/personInfo';
import CreateName from './views/release/createName';
import CreateRecipes from './views/release/createRecipes';
import CreateDynamic from './views/release/createDynamic';
import Recommend from './views/home/pages/recommendPage/recommend';
import Find from './views/home/pages/findPage/find';
import Concern from './views/home/pages/concernPage/concern';
import MenuClass from './views/home/menuClass';
import RecipesDetail from './views/home/pages/recommendPage/recipesDetail';
import DynamicDetail from './views/home/pages/findPage/dynamicDetail';
import MyRecipes from './views/center/pages/myRecipesPage/myRcipes';
import MyDynamic from './views/center/pages/myDynamicPage/myDynamic';
import MyCollect from './views/center/pages/myCollectPage/myCollect';
import MyLike from './views/center/pages/myLikePage/myLike';
import Setting from './views/center/setting';
import UserList from './views/center/userList';
import EditRecipesDraft from './views/release/editRecipesDraft';
import Search from './views/home/pages/searchPage';
import SearchDetail from './views/home/pages/searchPage/searchDetail';
import Inform from './views/message/inform';
import NewFanList from './views/message/newFanList';
import NewLikeList from './views/message/newLikeList';
import NewCollectList from './views/message/newCollectList';
import NewCommentList from './views/message/newCommentList';
import SituationDetail from './views/information/situationDetail';
import IngredientDetail from './views/home/pages/searchPage/ingredientDetail';
import TagDynamic from './views/home/pages/findPage/tagDynamic';

const routes = [
    {
        path: '/tab',
        component: TabBar,
        children: [
            {
                path: '/tab/home',
                component: Home,
                // redirect: '/tab/home/recommend',
                children: [
                    {
                        path: '/tab/home/recommend',
                        component: Recommend
                    },
                    {
                        path: '/tab/home/find',
                        component: Find
                    },
                    {
                        path: '/tab/home/concern',
                        component: Concern
                    }
                ]
            },
            {
                path: '/tab/information',
                component: Information
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
                component: Center,
                // redirect: '/tab/center/myRecipes',
                children: [
                    {
                        path: '/tab/center/myRecipes',
                        component: MyRecipes
                    },
                    {
                        path: '/tab/center/myDynamic',
                        component: MyDynamic
                    },
                    {
                        path: '/tab/center/myCollect',
                        component: MyCollect
                    },
                    {
                        path: '/tab/center/myLike',
                        component: MyLike
                    }
                ]
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
        path: '/createName',
        component: CreateName
    },{
        path: '/createRecipes',
        component: CreateRecipes
    },
    {
        path: '/createDynamic',
        component: CreateDynamic
    },
    {
        path: '/menuClass',
        component: MenuClass
    },
    {
        path: '/recipesDetail/:id',
        component: RecipesDetail
    },
    {
        path: '/dynamicDetail/:id',
        component: DynamicDetail
    },
    {
        path: '/setting',
        component: Setting
    },
    {
        path: '/userList',
        component: UserList
    },
    {
        path: '/editRecipesDraft',
        component: EditRecipesDraft
    },
    {
        path: '/search',
        component: Search
    },
    {
        path: '/searchDetail',
        component: SearchDetail
    },
    {
        path: '/inform',
        component: Inform
    },
    {
        path: '/newFanList',
        component: NewFanList
    },
    {
        path: '/newLikeList',
        component: NewLikeList
    },
    {
        path: '/newCollectList',
        component: NewCollectList
    },
    {
        path: '/newCommentList',
        component: NewCommentList
    },
    {
        path: '/situationDetail',
        component: SituationDetail
    },
    {
        path: '/ingredientDetail',
        component: IngredientDetail
    },
    {
        path: '/tagDynamic',
        component: TagDynamic
    }
];
 
export {routes}