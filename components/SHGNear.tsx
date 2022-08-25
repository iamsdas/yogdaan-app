import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useSHGs, useUser } from '../utils/queries';
import { View, ActivityIndicator, Text } from 'react-native';
import tw from 'twrnc';
import { ScrollView } from 'react-native-gesture-handler';

const SHGNear = () => {
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
        <Text>{shg.name}</Text>
      ))}
    </ScrollView>
  );
};

export default SHGNear;
