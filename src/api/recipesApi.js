import http from './http';

export const createRecipes = (recipesList) => http.post('/recipes/createRecipes', recipesList);

export const saveRecipesDraft = (recipesList) => http.post('/recipes/saveRecipesDraft', recipesList);

export const getRecipes = () => http.get('/recipes/getRecipes');

export const addCollectRecipes = (data) => http.post('/recipes/addCollectRecipes', data);

export const getRecipesDetail = (id) => http.post('/recipes/getRecipesDetail', id);

export const uploadVideo = (video) => http.post('/recipes/uploadVideo', video);

export const findRecipesByUseId = (userId) => http.post('/recipes/findRecipesByUseId', userId);
