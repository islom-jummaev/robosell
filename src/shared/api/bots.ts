import { httpGet, httpPost } from "@core/httpClient";


export const fetchBotsList = async () => {
    return await httpGet({
        url: `/bot/list`
    });
};

export const createBot = async (botToken: any) => {
    return await httpPost({
        url: `/bot/create-bot`,
        data: {
            token: botToken
        }
    });
};
