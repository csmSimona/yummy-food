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
	userList: {}
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.CHANGE_AVATAR:
			return state.set('files', action.files);
		case actionTypes.SAVE_USER_LIST:
			return state.set('userList', action.information);
		default:
			return state;
	}
};
