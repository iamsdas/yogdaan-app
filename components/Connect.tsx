import { useWalletConnect } from '@walletconnect/react-native-dapp';
import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function NotConnected() {
  const connection = useWalletConnect();
  return (
    <View style={tw`h-full flex flex-col items-center justify-center`}>
      <TouchableOpacity
        style={tw`bg-blue-400 px-4 py-2 rounded-full`}
        onPress={() => {
          connection.connect();
        }}>
        <Text style={tw`text-white text-lg`}>Connect to Wallet</Text>
      </TouchableOpacity>
    </View>
  );
}
