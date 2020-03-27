import * as actionTypes from './actionTypes';
// import { fromJS } from 'immutable';

export const saveUserList = (information) => ({
	type: actionTypes.SAVE_USER_LIST,
	information
});

export const saveRecipesList = (information) => ({
	type: actionTypes.SAVE_RECIPES_LIST,
	information
});

export const saveDynamicList = (information) => ({
	type: actionTypes.SAVE_DYNAMIC_LIST,
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


export const saveLeftDynamic = (information) => ({
	type: actionTypes.SAVE_LEFT_DYNAMIC,
	information
});

export const saveRightDynamic = (information) => ({
	type: actionTypes.SAVE_RIGHT_DYNAMIC,
	information
});

export const logout = () => ({
	type: actionTypes.LOGOUT
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