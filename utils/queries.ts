import { useQuery } from '@tanstack/react-query';
import {
  fetchAllLoans,
  fetchBalance,
  fetchEMIs,
  fetchUserDetails,
  fetchUserLoanAmount,
  findShgs,
  hasAccount,
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

export const useUserEMIs = (user: any) =>
  useQuery(['loans'], () => fetchEMIs(user?.user_id, user?.loan_ids), {
    enabled: !!user,
  });

export const useSHGs = (district: string) =>
  useQuery(['shgs'], () => findShgs(district), { enabled: !!district });

export const useLoans = (userid: string) =>
  useQuery(['loans'], () => fetchAllLoans(userid), { enabled: !!userid });
