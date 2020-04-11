import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	selectedTab: 'home',
	unReadNumber: 0,
	unReadCollectNumber: 0,
	unReadCommentNumber: 0,
	unReadLikeNumber: 0,
	unReadFanNumber: 0,
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.SAVE_SELECTED_TAB:
			return state.set('selectedTab', action.information);
		case actionTypes.SAVE_UNREAD_NUMBER:
			return state.set('unReadNumber', action.information);
		case actionTypes.SAVE_UNREAD_COLLECT_NUMBER:
			return state.set('unReadCollectNumber', action.information);
		case actionTypes.SAVE_UNREAD_COMMENT_NUMBER:
			return state.set('unReadCommentNumber', action.information);
		case actionTypes.SAVE_UNREAD_FAN_NUMBER:
			return state.set('unReadFanNumber', action.information);
		case actionTypes.SAVE_UNREAD_LIKE_NUMBER:
			return state.set('unReadLikeNumber', action.information);
		default:
			return state;
	}
};
