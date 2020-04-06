import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	selectedTab: 'home'
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.SAVE_SELECTED_TAB:
			return state.set('selectedTab', action.information);
		default:
			return state;
	}
};
