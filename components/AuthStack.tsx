import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignUp from './Signup';
import { useLogin } from '../utils/queries';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { View, Text } from 'react-native';
import tw from 'twrnc';
import Home from './Home';

const Drawer = createDrawerNavigator();

export default function AuthStack() {
  const connection = useWalletConnect();
  const { data: login, isLoading } = useLogin(connection.accounts[0]);

  if (isLoading)
    return (
      <View style={tw`flex flex-col items-center justify-center`}>
        <Text>Loading</Text>
      </View>
    );
  return (
    <Drawer.Navigator>
      {login ? (
        <Drawer.Screen name='home' component={Home} />
      ) : (
        <Drawer.Screen name='Sign Up' component={SignUp} />
      )}
    </Drawer.Navigator>
  );
}
