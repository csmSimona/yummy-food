import * as actionTypes from './actionTypes';

export const saveSelectedTab = (information) => ({
	type: actionTypes.SAVE_SELECTED_TAB,
	information
});

export const saveUnReadNumber = (information) => ({
	type: actionTypes.SAVE_UNREAD_NUMBER,
	information
});

export const saveUnReadCollectNumber = (information) => ({
	type: actionTypes.SAVE_UNREAD_COLLECT_NUMBER,
	information
});

export const saveUnReadCommentNumber = (information) => ({
	type: actionTypes.SAVE_UNREAD_COMMENT_NUMBER,
	information
});

export const saveUnReadFanNumber = (information) => ({
	type: actionTypes.SAVE_UNREAD_FAN_NUMBER,
	information
});

export const saveUnReadLikeNumber = (information) => ({
	type: actionTypes.SAVE_UNREAD_LIKE_NUMBER,
	information
});
