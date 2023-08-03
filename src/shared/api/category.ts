import api from "axios";

export const fetchCategoryList = async (id: string) => {
    return await api.get(`/category/list/${id}`);
};

export const createBot = async (botToken: any) => {
    return await api.post(`/bot/create-bot`, {
        token: botToken
    });
};
