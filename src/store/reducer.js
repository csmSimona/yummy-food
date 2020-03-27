import { combineReducers } from 'redux-immutable';
import {reducer as centerReducer} from '../views/center/store';
import {reducer as homeReducer} from '../views/home/store';

const reducer = combineReducers({
  center: centerReducer,
  home: homeReducer,
});

export default reducer;
