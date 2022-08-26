import { useQuery } from '@tanstack/react-query';
import {
  fetchAllLoans,
  fetchBalance,
  fetchEMIs,
  fetchUserDetails,
  fetchUserLoanAmount,
  findShgs,
  getUserRequests,
  hasAccount,
} from './helper';

export const useLogin = (address: string) =>
  useQuery(['login'], () => hasAccount(address));

export const useUser = (address: string) =>
  useQuery(['user'], () => fetchUserDetails(address));

export const useUserLoanAmount = (userId: number) =>
  useQuery(['loanAmt'], () => fetchUserLoanAmount(userId), {
    enabled: !!userId,
    refetchInterval: 50000,
  });

export const useUserBalance = (address: string) =>
  useQuery(['balance'], () => fetchBalance(address), { refetchInterval: 3000 });

export const useUserEMIs = (user: any) =>
  useQuery(['loans'], () => fetchEMIs(user?.user_id, user?.loan_ids), {
    enabled: !!user,
    refetchInterval: 3000,
  });

export const useSHGs = (district: string) =>
  useQuery(['shgs'], () => findShgs(district), { enabled: !!district });

export const useLoans = (userid: string) =>
  useQuery(['loans'], () => fetchAllLoans(userid), {
    enabled: !!userid,
    refetchInterval: 2000,
  });

export const useRequests = (userid: string) =>
  useQuery(['requests'], () => getUserRequests(userid), { enabled: !!userid });
