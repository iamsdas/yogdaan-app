import { useQuery } from '@tanstack/react-query';
import {
  fetchBalance,
  fetchUserDetails,
  fetchUserLoanAmount,
  hasAccount,
  web3,
} from './helper';

export const useLogin = (address: string) =>
  useQuery(['login'], () => hasAccount(address));

export const useUser = (address: string) =>
  useQuery(['user'], () => fetchUserDetails(address));

export const useUserLoanAmount = (userId: number) =>
  useQuery(['loanAmt'], () => fetchUserLoanAmount(userId), {
    enabled: !!userId,
  });

export const useUserBalance = (address: string) =>
  useQuery(['balance'], () => fetchBalance(address));
