import { combineReducers } from 'redux-immutable';
import {reducer as centerReducer} from '../views/center/store';
import {reducer as homeReducer} from '../views/home/store';
import {reducer as tabReducer} from '../views/tabBar/store';

const reducer = combineReducers({
  center: centerReducer,
  home: homeReducer,
  tab: tabReducer
});

export default reducer;
