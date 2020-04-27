import http from './http';

export const createRecipes = (recipesList) => http.post('/recipes/createRecipes', recipesList);

export const saveRecipesDraft = (recipesList) => http.post('/recipes/saveRecipesDraft', recipesList);

export const getRecipes = () => http.get('/recipes/getRecipes');

export const getRecipesById = (id) => http.post('/recipes/getRecipesById', id);

export const addCollectRecipes = (data) => http.post('/recipes/addCollectRecipes', data);

export const getRecipesDetail = (id) => http.post('/recipes/getRecipesDetail', id);

export const uploadVideo = (video) => http.post('/recipes/uploadVideo', video);

export const findRecipesByUseId = (userId) => http.post('/recipes/findRecipesByUseId', userId);

export const getCollectRecipesList = (data) => http.post('/recipes/getCollectRecipesList', data);

export const addFollowRecipes = (data) => http.post('/recipes/addFollowRecipes', data);

export const deleteRecipes = (id) => http.post('/recipes/deleteRecipes', id);

export const updateRecipes = (data) => http.post('/recipes/updateRecipes', data);

export const findRecipesDraftByUseId = (id) => http.post('/recipes/findRecipesDraftByUseId', id);

export const deleteRecipesDraft = (id) => http.post('/recipes/deleteRecipesDraft', id);
