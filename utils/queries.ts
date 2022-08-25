import { useQuery } from '@tanstack/react-query';
import { hasAccount } from './helper';

export const useLogin = (address: string) =>
  useQuery(['login'], () => hasAccount(address));
