import * as actionTypes from './actionTypes';
import { fromJS } from 'immutable';

export const changeAvatar = (files) => ({
	type: actionTypes.CHANGE_AVATAR,
  	// data: fromJS(files),
	value: files
});

export const saveUserList = (information) => ({
	type: actionTypes.SAVE_USER_LIST,
	information
});

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

// export const logout = () => ({
// 	type: actionTypes.LOGOUT,
// 	value: false
// });

// export const changeAvatar = (files) => {
// 	return (dispatch) => { 
// 		axios.get('/api/login.json?account=' + accout + '&password=' + password).then((res) => {
// 			const result = res.data.data;
// 			if (result) {
// 				dispatch(changeLogin())
// 			}else {
// 				alert('登陆失败')
// 			}
// 		})
// 	}
// };