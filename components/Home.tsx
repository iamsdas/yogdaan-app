import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import * as React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import tw from 'twrnc';
import { payEmi } from '../utils/helper';
import { useQueryClient } from '@tanstack/react-query';
import {
  useUser,
  useUserBalance,
  useUserEMIs,
  useUserLoanAmount,
} from '../utils/queries';
const cardBoxStyle = tw`flex flex-col items-center justify-center p-3 my-3 border border-gray-200 rounded-2xl bg-white`;

export default function Home({ navigation }: NativeStackScreenProps<any>) {
  const connection = useWalletConnect();
  const client = useQueryClient();
  const { data: user } = useUser(connection.accounts[0]);
  const { data: loanAmt, isLoading: personalLoading } = useUserLoanAmount(
    user?.id
  );
  const { data: balance } = useUserBalance(connection.accounts[0]);
  const { data: emis, isLoading: emiLoading } = useUserEMIs(user);

  if (personalLoading)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  const details = [
    { id: 1, key: 'pending loan amount', val: `₹${loanAmt}` },
    {
      id: 2,
      key: 'current balance',
      val: `₹${balance}`,
    },
  ];

  const personal_details = (
    <>
      <Text style={tw`text-2xl p-4 py-6 text-gray-700 font-medium`}>
        Hi {user.name.split(' ')[0]}
      </Text>
      {details.map((detail) => (
        <View style={cardBoxStyle} key={detail.id}>
          <Text style={tw`text-2xl text-gray-700 capitalize`}>
            {detail.key}
          </Text>
          <Text style={tw`text-4xl text-gray-600 py-3 font-semibold`}>
            {detail.val}
          </Text>
        </View>
      ))}
    </>
  );

  const emi_details = (
    <>
      <Text style={tw`text-2xl p-4 py-6 text-gray-700 font-medium`}>
        Upcomming EMIs
      </Text>
      <View style={tw`flex items-center justify-center rounded-xl`}>
        {emiLoading ? (
          <View style={tw`py-6`}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : emis?.length ? (
          emis?.map((emi) => (
            <View
              style={tw`w-full flex flex-row jusitfy-between items-center px-2 py-3 bg-white my-2 rounded-xl`}
              key={emi.lid}>
              <View style={tw`flex-1 px-1`}>
                <Text style={tw`text-sm font-bold text-gray-500`}>
                  Loan #{emi.lid}
                </Text>
                <Text style={tw`text-xl text-gray-800`}>₹{emi.value}</Text>
              </View>
              <TouchableOpacity
                style={tw`p-4 bg-blue-300 rounded-xl`}
                onPress={async () => {
                  await payEmi(connection, user.id, emi.lid, emi.value);
                  client.invalidateQueries(['loans']);
                }}>
                <Text style={tw`text-white text-lg`}>₹Pay</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View
            style={tw`py-18  bg-white w-full rounded-xl flex justify-center items-center`}>
            <Text style={tw`text-lg text-gray-700`}>
              Hurray! No EMIs to pay this month
            </Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <ScrollView contentContainerStyle={tw`p-4 h-full`}>
      {personal_details}
      {emi_details}
      <TouchableOpacity
        style={tw`bg-blue-400 m-1 absolute right-2 bottom-2 rounded-full h-[75px] w-[75px]`}
        onPress={() => {
          navigation.navigate('SHGs Nearby');
        }}>
        <Text
          style={tw`text-gray-50 relative text-4xl rounded-full text-center my-auto`}>
          +
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
