import http from './http';

export const sendComment = (data) => http.post('/inform/sendComment', data);

export const getRecipeComment = (recipeId) => http.post('/inform/getRecipeComment', recipeId);

export const getDynamicComment = (dynamicId) => http.post('/inform/getDynamicComment', dynamicId);

export const deleteComment = (commentId) => http.post('/inform/deleteComment', commentId);

export const addCommentInform = (data) => http.post('/inform/addCommentInform', data);

export const getUnreadCommentNumber = (id) => http.post('/inform/getUnreadCommentNumber', id);

export const getUnreadComment = (id) => http.post('/inform/getUnreadComment', id);

export const getCommentDetail = (data) => http.post('/inform/getCommentDetail', data);

export const getUnreadFanNumber = (id) => http.post('/inform/getUnreadFanNumber', id);

export const getUnreadFan = (id) => http.post('/inform/getUnreadFan', id);

export const getUnreadCollectNumber = (id) => http.post('/inform/getUnreadCollectNumber', id);

export const getUnreadCollect = (id) => http.post('/inform/getUnreadCollect', id);

export const getUnreadLikeNumber = (id) => http.post('/inform/getUnreadLikeNumber', id);

export const getUnreadLike = (id) => http.post('/inform/getUnreadLike', id);

