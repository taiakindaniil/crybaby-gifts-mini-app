/**
 * Конфигурация окружения
 * Использует переменные окружения Vite с fallback значениями
 */

// Vite требует префикс VITE_ для переменных окружения в клиентском коде
export const API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || 
  'https://upright-mighty-colt.ngrok-free.app';

export const PROXY_SERVER = 
  import.meta.env.VITE_PROXY_SERVER || 
  'https://upright-mighty-colt.ngrok-free.app/proxy/image/';

// Для отладки можно проверить текущее окружение
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const mode = import.meta.env.MODE;

