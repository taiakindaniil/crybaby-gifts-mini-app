/**
 * Генерирует deeplink для шейринга профиля пользователя
 * @param userId - Telegram ID пользователя
 * @returns URL для шейринга профиля в формате t.me/crybaby_gifts_bot/app?startapp=profile_{userId}
 */
export function generateProfileShareLink(userId: number): string {
  // Используем формат: t.me/crybaby_gifts_bot/app?startapp=profile_{userId}
  const botUsername = import.meta.env.VITE_BOT_USERNAME || 'giftoutfit_bot';
  
  // Для openTelegramLink нужен полный URL с протоколом
  return `https://t.me/${botUsername}/app?startapp=profile_${userId}`;
}

