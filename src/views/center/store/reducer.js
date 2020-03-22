import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	files: [{
		url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
		id: '2121'
    }],
    value: 1,
    tagSelected: true,
	selectedList: ['无'],
	userList: {},
	recipesList: [],
	leftData: [], //左边的数据
	rightData: [], //右边的数据
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.CHANGE_AVATAR:
			return state.set('files', action.files);
		case actionTypes.SAVE_USER_LIST:
			return state.set('userList', action.information);
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
			return state;
	}
};
