import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	recipesList: [],
	leftData: [], //左边的数据
	rightData: [], //右边的数据
	dynamicList: [],
	leftDynamic: [],
	rightDynamic: [],
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.SAVE_RECIPES_LIST:
			return state.set('recipesList', action.information);
		case actionTypes.SAVE_LEFT_DATA:
			return state.set('leftData', action.information);
		case actionTypes.SAVE_RIGHT_DATA:
			return state.set('rightData', action.information);
		case actionTypes.SAVE_DYNAMIC_LIST:
			return state.set('dynamicList', action.information);
		case actionTypes.SAVE_LEFT_DYNAMIC:
			return state.set('leftDynamic', action.information);
		case actionTypes.SAVE_RIGHT_DYNAMIC:
			return state.set('rightDynamic', action.information);
		case actionTypes.CLEAR_HOME_REDUX_DATA:
			return defaultState;
		default:
			return state;
	}
};
