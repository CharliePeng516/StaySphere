import httpRequest from "./request";

export function getUserInfo(params) {
    return httpRequest({
        url: "/client/article/getArticleByType",
        params,
    });
}