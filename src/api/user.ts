import apiClient from './apiClient';

export interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  bio?: string;
  subscription_active?: boolean;
  view_count?: number;
  unique_view_count?: number;
}

export const updateBio = async (bio: string) => {
    const res = await apiClient.put(`/me/bio`, { bio });
    return res.data;
};

export const getUser = async (userId: number): Promise<TelegramUser> => {
    const res = await apiClient.get(`/users/${userId}`);
    return res.data;
};

/**
 * Отправляет событие просмотра профиля пользователя
 * @param userId - ID пользователя, чей профиль был просмотрен
 */
export const trackProfileView = async (userId: number): Promise<void> => {
    await apiClient.post(`/users/${userId}/views`);
};

