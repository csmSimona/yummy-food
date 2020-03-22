import { fromJS } from 'immutable';
import * as actionTypes from './actionTypes';

const defaultState = fromJS({
	login: false
});

export default (state = defaultState, action) => {
	switch(action.type) {
		case actionTypes.CHANGE_LOGIN:
			return state.set('login', action.value);
		case actionTypes.LOGOUT:
			return state.set('login', action.value);
		default:
			return state;
	}
};

// const defaultState = {
//     files: [{
//         url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
//         id: '2121'
//     }],
//     value: 1,
//     tagSelected: true,
//     selectedList: ['无']
// };

// export default (state = defaultState, action) => {
//     if (action.type === 'change_avatar') {
//         return {
//             files: action.files
//         }
//     }
//     return state;
// }