import apiClient from './apiClient';

// const api = axios.create({
//     baseURL: 'https://upright-mighty-colt.ngrok-free.app', // адрес твоего FastAPI
//     headers: {
//       "ngrok-skip-browser-warning": "true",
//     }
// });

export const fetchGifts = async () => {
    const res = await apiClient.get('/proxy/changes-tg/gifts', {
        responseType: 'json', // гарантируем, что axios попытается распарсить JSON
    })
    return res.data
}

export const fetchModels = async (giftName: string) => {
    const res = await apiClient.get(`/proxy/changes-tg/models/${encodeURIComponent(giftName)}`)
    return res.data
}

export const fetchBackgrounds = async () => {
    const res = await apiClient.get('/proxy/changes-tg/backdrops?sort=asc')
    return res.data
}

export const fetchPatterns = async (giftName: string) => {
    const res = await apiClient.get(`/proxy/changes-tg/patterns/${encodeURIComponent(giftName)}`)
    return res.data
}
  