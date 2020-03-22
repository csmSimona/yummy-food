import http from './http';

export const createDynamic = (dynamicList) => http.post('/dynamic/createDynamic', dynamicList);
