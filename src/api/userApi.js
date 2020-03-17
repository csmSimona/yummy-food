import http from './http';

export const getUser = () => http.get('/user/getUser');

export const addUser = (user) => http.post('/user/addUser', user);

export const getVerificationCode = (data) => http.post('/user/getVerificationCode', data);

export const verifyCode = (data) => http.post('/user/verifyCode', data);

export const weChatLogin = () => http.get('/user/wechat_login');

export const get_wx_access_token = () => http.get('/user/get_wx_access_token');

export const checkUser = (data) => http.post('/user/checkUser', data);
