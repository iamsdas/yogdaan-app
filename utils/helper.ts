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
  const hash = await connection.sendTransaction({
    data: txdata,
    from: connection.accounts[0],
    to: YogdaanAbis.networks[80001].address,
  });
  const interval = setInterval(function () {
    web3.eth.getTransactionReceipt(hash, function (err, rec) {
      if (rec) {
        clearInterval(interval);
      }
    });
  }, 500);
  await confirmTransaction(hash);
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
  return await sendTransaction(tx, connection);
};
