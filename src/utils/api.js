import http from './http';

export const getUser = () => http.get('/user/getUser');

export const addUser = (user) => http.post('/user/addUser', user);