// useApi.ts
import { useEffect } from 'react';
import { initDataRaw as _initDataRaw, useSignal } from '@telegram-apps/sdk-react';
import { setInitData } from '../apiClient';
import apiClient from '../apiClient';

export const useApi = () => {
  const initDataRaw = useSignal(_initDataRaw);

  useEffect(() => {
    setInitData(initDataRaw);
    return () => setInitData(undefined);
  }, [initDataRaw]);

  return apiClient;
};

export default useApi;
