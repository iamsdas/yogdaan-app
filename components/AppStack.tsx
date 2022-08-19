import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWalletConnect } from '@walletconnect/react-native-dapp';

import NotConnected from './Connect';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient,
  persister: asyncStoragePersister,
});

export default function AppStack() {
  const connection = useWalletConnect();
  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {connection.connected ? (
            <Stack.Screen name='Home' component={AuthStack} />
          ) : (
            <Stack.Screen name='Connection' component={NotConnected} />
          )}
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
