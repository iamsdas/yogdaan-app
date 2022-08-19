import * as React from 'react';
import { Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export default function SignUp() {
  return (
    <ScrollView
      contentContainerStyle={tw`h-full flex flex-col items-center justify-start p-4 py-5`}>
      <TextInput
        style={tw`bg-white p-2 my-2 w-full rounded-lg`}
        placeholder='name'
        keyboardType='default'
      />
      <TextInput
        style={tw`bg-white p-2 my-2 w-full rounded-lg`}
        placeholder='mobile'
        keyboardType='number-pad'
      />
      <TextInput
        style={tw`bg-white p-2 my-2 w-full rounded-lg`}
        placeholder='state'
        keyboardType='default'
      />
      <TextInput
        style={tw`bg-white p-2 my-2 w-full rounded-lg`}
        placeholder='district'
        keyboardType='default'
      />
      <TouchableOpacity
        style={tw`bg-blue-300 px-3 py-2 my-2 rounded-full w-full`}
        onPress={() => {}}>
        <Text style={tw`text-white text-lg text-center`}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
