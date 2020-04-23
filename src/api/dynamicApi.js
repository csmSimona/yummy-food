import http from './http';

export const createDynamic = (dynamicList) => http.post('/dynamic/createDynamic', dynamicList);

export const getDynamic = () => http.get('/dynamic/getDynamic');

export const addLikeDynamic = (data) => http.post('/dynamic/addLikeDynamic', data);

export const getDynamicDetail = (id) => http.post('/dynamic/getDynamicDetail', id);

export const findDynamicByUseId = (userId) => http.post('/dynamic/findDynamicByUseId', userId);

export const getLikeDynamicList = (data) => http.post('/dynamic/getLikeDynamicList', data);

export const editDynamic = (data) => http.post('/dynamic/editDynamic', data);

export const deleteDynamic = (id) => http.post('/dynamic/deleteDynamic', id);

export const getDynamicDetailByUserId = (id) => http.post('/dynamic/getDynamicDetailByUserId', id);

export const getDynamicById = (id) => http.post('/dynamic/getDynamicById', id);

export const getDynamicByTag = (tag) => http.post('/dynamic/getDynamicByTag', tag);
