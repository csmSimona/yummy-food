import * as actionTypes from './actionTypes';

export const saveRecipesList = (information) => ({
	type: actionTypes.SAVE_RECIPES_LIST,
	information
});

export const saveLeftData = (information) => ({
	type: actionTypes.SAVE_LEFT_DATA,
	information
});

export const saveRightData = (information) => ({
	type: actionTypes.SAVE_RIGHT_DATA,
	information
});

export const saveDynamicList = (information) => ({
	type: actionTypes.SAVE_DYNAMIC_LIST,
	information
});

export const saveLeftDynamic = (information) => ({
	type: actionTypes.SAVE_LEFT_DYNAMIC,
	information
});

export const saveRightDynamic = (information) => ({
	type: actionTypes.SAVE_RIGHT_DYNAMIC,
	information
});