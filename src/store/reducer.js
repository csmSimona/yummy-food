import { combineReducers } from 'redux-immutable';
import {reducer as loginReducer} from '../views/login/store';
import {reducer as centerReducer} from '../views/center/store';
import {reducer as homeReducer} from '../views/home/store';

const reducer = combineReducers({
  login: loginReducer,
  center: centerReducer,
  home: homeReducer,
});

export default reducer;
