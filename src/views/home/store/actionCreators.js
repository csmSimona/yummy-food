import * as actionTypes from './actionTypes';

export const saveRecipesList = (recipesList) => ({
	type: actionTypes.SAVE_RECIPES_LIST,
	recipesList
});

export const saveLeftData = (leftData) => ({
	type: actionTypes.SAVE_LEFT_DATA,
	leftData
});

export const saveRightData = (rightData) => ({
	type: actionTypes.SAVE_RIGHT_DATA,
	rightData
});