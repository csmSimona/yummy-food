import http from './http';

export const getUser = () => http.get('/user/getUser');

export const addUser = (user) => http.post('/user/addUser', user);

export const getVerificationCode = (data) => http.post('/user/getVerificationCode', data);

export const verifyCode = (data) => http.post('/user/verifyCode', data);

export const weChatLogin = () => http.get('/user/wechat_login', );
