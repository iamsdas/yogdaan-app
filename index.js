const { Platform } = require('react-native');
if (Platform.OS !== 'web') {
  require('./global');
}
const { registerRootComponent, scheme } = require('expo');
const { default: App } = require('./components/App');
const {
  default: AsyncStorage,
} = require('@react-native-async-storage/async-storage');
const { withWalletConnect } = require('@walletconnect/react-native-dapp');

registerRootComponent(
  withWalletConnect(App, {
    redirectUrl:
      Platform.OS === 'web' ? window.location.origin : `${scheme}://`,
    storageOptions: {
      asyncStorage: AsyncStorage,
    },
  })
);
