import * as actionTypes from './actionTypes';

export const saveSelectedTab = (information) => ({
	type: actionTypes.SAVE_SELECTED_TAB,
	information
});
