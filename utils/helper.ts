import Constants from 'expo-constants';
import YogdaanAbis from './abis/Yogdaan.json';
import Web3 from 'web3';
import type WalletConnect from '@walletconnect/client';

const RPC_URL = Constants.manifest?.extra?.RPC_URL as string;

export const web3 = new Web3(RPC_URL);
export const contract = new web3.eth.Contract(
  YogdaanAbis.abi as any,
  YogdaanAbis.networks[80001].address
);

export const hasAccount = async (address: string): Promise<boolean> => {
  return await contract.methods?.login().call({ from: address });
};

const confirmTransaction = async (hash: string) => {
  return new Promise((resolve, reject) => {
    setInterval(async () => {
      const res = await web3.eth.getTransactionReceipt(hash);
      if (!!res) resolve(res);
    }, 100);
  });
};

const sendTransaction = async (txdata: any, connection: WalletConnect) => {
  return await connection.sendTransaction({
    data: txdata,
    from: connection.accounts[0],
    to: YogdaanAbis.networks[80001].address,
  });
};

export const signUp = async (
  name: string,
  aadhar: string,
  mobno: string,
  fatherName: string,
  gender: number,
  state: string,
  district: string,
  blockName: string,
  panchayatName: string,
  villageName: string,
  connection: WalletConnect
): Promise<void> => {
  const tx = await contract.methods
    .addUser(
      name,
      aadhar,
      mobno,
      fatherName,
      gender,
      state,
      district,
      blockName,
      panchayatName,
      villageName
    )
    .encodeABI();
  const hash = await sendTransaction(tx, connection);
  await confirmTransaction(hash);
};

export const fetchUserLoanAmount = async (userid: number) => {
  return await contract.methods.getUserLoanAmount(userid).call();
};

export const fetchUserDetails = async (address: string) => {
  const userId = await contract.methods.addressToUser(address).call();
  return await contract.methods.users(userId).call();
};

export const fetchBalance = async (address: string) => {
  return (
    parseFloat(
      await web3.utils.fromWei(await web3.eth.getBalance(address), 'ether')
    ) * 80
  ).toFixed(2);
};

export const fetchEMIs = async (user_id: number, loan_ids: string[]) => {
  const promises = [];
  for (const loan_id in loan_ids) {
    promises.push(contract.methods.getUserEMI(user_id, loan_id).call());
  }
  return await Promise.all(promises);
};

export const findShgs = async (district: string) => {
  const shgs: string[] = await contract.methods.shgsOfDistrict(district).call();
  const promises = [];
  for (const id of shgs) {
    promises.push(contract.methods.shgs(id).call());
  }
  return (await Promise.all(promises)).filter((shg) => shg.id !== '0');
};

export const fetchAllLoans = async (userid: string) => {
  const lids = await contract.methods.findAllLoans(userid).call();
  const promises = [];
  for (const id of lids) {
    promises.push(contract.methods.loans(id).call());
  }
  return await Promise.all(promises);
};

export const makeRequest = async (
  shgid: string,
  userid: string,
  amount: string,
  desc: string,
  time: string,
  connection: WalletConnect
) => {
  const tx = await contract.methods
    .makeRequest(shgid, userid, amount, desc, time)
    .encodeABI();
  const hash = await sendTransaction(tx, connection);
  await confirmTransaction(hash);
};

export const getUserRequests = async (userid: string) => {
  const lids = await contract.methods.getUserRequest(userid).call();
  const promises = [];
  for (const id of lids) {
    promises.push(contract.methods.userRequests(id).call());
  }
  return await Promise.all(promises);
};
