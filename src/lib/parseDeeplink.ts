/**
 * Парсит start_param из Telegram deeplink и извлекает ID пользователя
 * @param startParam - значение tgWebAppStartParam из launch params
 * @returns ID пользователя или null, если не найден
 */
export function parseProfileUserIdFromStartParam(startParam: string | undefined | null): number | null {
  if (!startParam) {
    return null;
  }

  // Формат: "profile_123456789" или просто "123456789"
  if (startParam.startsWith('profile_')) {
    const userId = parseInt(startParam.replace('profile_', ''), 10);
    return isNaN(userId) ? null : userId;
  }

  // Fallback: попытка распарсить как число напрямую
  const userId = parseInt(startParam, 10);
  return isNaN(userId) ? null : userId;
}

