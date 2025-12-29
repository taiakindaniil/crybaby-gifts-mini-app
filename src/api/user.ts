import apiClient from './apiClient';

export const updateBio = async (bio: string) => {
    const res = await apiClient.put(`/me/bio`, { bio });
    return res.data;
};

