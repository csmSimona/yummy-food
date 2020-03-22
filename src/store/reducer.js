import { combineReducers } from 'redux-immutable';
import {reducer as loginReducer} from '../views/login/store';
import {reducer as centerReducer} from '../views/center/store';

const reducer = combineReducers({
  login: loginReducer,
  center: centerReducer
});

export default reducer;
