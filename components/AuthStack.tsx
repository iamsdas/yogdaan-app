import 'react-native-gesture-handler';
import SignUp from './Signup';
import { useLogin } from '../utils/queries';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import Home from './Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SHGNear from './SHGNear';
import Details from './Details';
import Request from './Request';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const connection = useWalletConnect();
  const { data: login, isLoading } = useLogin(connection.accounts[0]);

  if (isLoading)
    return (
      <View style={tw`flex flex-col items-center justify-center`}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  return (
    <Stack.Navigator initialRouteName='Yogdaan'>
      {login ? (
        <>
          <Stack.Screen name='Yogdaan' component={Home} />
          <Stack.Screen name='SHGs Nearby' component={SHGNear} />
          <Stack.Screen name='SHG Details' component={Details} />
          <Stack.Screen name='Request' component={Request} />
        </>
      ) : (
        <>
          <Stack.Screen
            name='Sign Up'
            component={SignUp}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
