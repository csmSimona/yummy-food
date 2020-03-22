import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	recipesList: [],
	leftData: [],//左边的数据
	rightData: [],//右边的数据
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.SAVE_RECIPES_LIST:
			console.log('redux recipesList', action.recipesList);
			return state.set('recipesList', action.recipesList);
		case actionTypes.SAVE_LEFT_DATA:
			console.log('redux leftData', action.leftData);
			return state.set('leftData', action.leftData);
		case actionTypes.SAVE_RIGHT_DATA:
			console.log('redux rightData', action.rightData);
			return state.set('rightData', action.rightData);
		default:
			console.log('no')
			return state;
	}
};
