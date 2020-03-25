import http from './http';

export const createDynamic = (dynamicList) => http.post('/dynamic/createDynamic', dynamicList);

export const getDynamic = () => http.get('/dynamic/getDynamic');

export const addLikeDynamic = (data) => http.post('/dynamic/addLikeDynamic', data);

export const getDynamicDetail = (id) => http.post('/dynamic/getDynamicDetail', id);
