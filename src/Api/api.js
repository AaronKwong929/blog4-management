export const login = `/auth/login`;

export const getArticleIndex = `/admin/article/index`;

export const newArticle = `/admin/article`;

export const changeArticleStatus = `/admin/article`;

export const deleteArticle = `/admin/article`;

export const getDraft = `/admin/article`;

export const updateDraft = `/admin/draft`;

export const changePassword = `/admin/password`;

export const adminGetComment = (id, index) => {
    return `/admin/comment?articleId=${id}&pageIndex=${index}`;
};

export const adminChangeCommentStatus = `/admin/comment`;

export const adminDeleteComment = `/admin/comment?commentId=`;

export const adminGetEventTrack = `/admin/eventTrack`;

export const adminStatus = `/admin/status`;
