import http from './http';

export const getClassification = () => http.get('/search/getClassification');

export const searchRecipes = (data) => http.post('/search/searchRecipes', data);

export const getSituationList = () => http.get('/search/getSituationList');
