import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignUp from './Signup';

const Drawer = createDrawerNavigator();

export default function AuthStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name='Sign Up' component={SignUp} />
    </Drawer.Navigator>
  );
}
