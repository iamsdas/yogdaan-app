import { useWalletConnect } from '@walletconnect/react-native-dapp';
import * as React from 'react';
import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import tw from 'twrnc';
import { useUser, useUserBalance, useUserLoanAmount } from '../utils/queries';

const cardBoxStyle = tw`border-2 p-4 my-3 rounded-xl border-gray-400`;

export default function Home() {
  const connection = useWalletConnect();
  const { data: user } = useUser(connection.accounts[0]);
  const { data: loanAmt, isLoading } = useUserLoanAmount(user?.id);
  const { data: balance } = useUserBalance(connection.accounts[0]);

  if (isLoading)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <Text>loading</Text>
      </View>
    );

  const details = [
    { id: 0, key: 'name', val: user?.name },
    { id: 1, key: 'pending loan amount', val: `₹${loanAmt}` },
    {
      id: 2,
      key: 'current balance',
      val: `₹${balance}`,
    },
  ];

  return (
    <ScrollView contentContainerStyle={tw`p-4`}>
      <View style={cardBoxStyle}>
        <Text style={tw`text-xl font-bold`}>Personal Details</Text>
        {details.map((detail) => (
          <Text style={tw`text-lg`} key={detail.id}>
            <Text style={tw`font-medium text-gray-800 capitalize`}>
              {detail.key}
            </Text>{' '}
            : {detail.val}
          </Text>
        ))}
      </View>
      <View style={cardBoxStyle}>
        <Text style={tw`text-xl font-bold`}>Upcomming EMIs</Text>
      </View>
    </ScrollView>
  );
}
