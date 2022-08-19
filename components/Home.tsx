import * as React from 'react';
import { Text, View } from 'react-native';
import tw from 'twrnc';

export default function Home() {
  return (
    <View style={tw`h-full flex flex-col items-center justify-center`}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}
