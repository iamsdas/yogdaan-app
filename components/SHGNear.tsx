import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useSHGs, useUser } from '../utils/queries';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { ScrollView } from 'react-native-gesture-handler';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

const SHGNear = ({ navigation }: NativeStackScreenProps<any>) => {
  const connection = useWalletConnect();
  const { data: user } = useUser(connection.accounts[0]);
  const { data: shgs, isLoading, error } = useSHGs(user?.location?.district);
  if (error) console.log(error);

  if (isLoading)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  if (!shgs || shgs.length == 0)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <Text style={tw`text-xl text-gray-400`}>No SHGs near you</Text>
      </View>
    );

  return (
    <ScrollView>
      {shgs.map((shg) => (
        <TouchableOpacity
          key={shg.id}
          style={tw`border-b-2 p-4 border-gray-300`}
          onPress={() => {
            navigation.navigate({
              name: 'SHG Details',
              params: { shg },
            });
          }}>
          <Text style={tw`text-xl`}>{shg.name}</Text>
          <Text style={tw`text-sm font-semibold capitalize text-gray-600`}>
            {shg.location.district} ({shg.location.state})
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default SHGNear;
