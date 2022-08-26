import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import tw from 'twrnc';
import { useUser } from '../utils/queries';
import { makeRequest } from '../utils/helper';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

const Request = ({ navigation, route }: NativeStackScreenProps<any>) => {
  const client = useQueryClient();
  const shg = route.params?.shg;
  const connection = useWalletConnect();
  const { data: user, isLoading } = useUser(connection.accounts[0]);
  const [amount, setAmount] = useState('');
  const [time, setTime] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (isLoading || loading)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  return (
    <View style={tw`h-full p-4 flex flex-col justify-between`}>
      <View>
        <Text style={tw`capitalize text-2xl font-semibold text-gray-600 mb-4`}>
          Request loan from {shg.name}
        </Text>
        <TextInput
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
          style={tw`bg-white text-xl p-3 my-3 rounded-lg`}
        />
        <TextInput
          placeholder='Loan Time'
          keyboardType='number-pad'
          value={time}
          onChangeText={setTime}
          style={tw`bg-white text-xl p-3 my-3 rounded-lg`}
        />
        <TextInput
          placeholder='Amount (₹)'
          keyboardType='number-pad'
          value={amount}
          onChangeText={setAmount}
          style={tw`bg-white text-xl p-3 my-3 rounded-lg`}
        />
      </View>
      <TouchableOpacity
        style={tw`bg-blue-400 px-3 py-2 my-2 rounded-full w-full`}
        onPress={async () => {
          setLoading(true);
          try {
            await makeRequest(
              shg.id,
              user.id,
              amount,
              description,
              time,
              connection
            );
            client.invalidateQueries(['requests']);
          } catch (e) {
            alert('Network error');
          } finally {
            navigation.navigate({ name: 'SHG Details', params: { shg } });
            setLoading(false);
          }
        }}>
        <Text style={tw`text-white text-lg text-center`}>Send Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Request;
