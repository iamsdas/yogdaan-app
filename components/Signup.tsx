import { useState } from 'react';
import {
  Text,
  TextInput,
  ScrollView,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { useQueryClient } from '@tanstack/react-query';
import tw from 'twrnc';
import { signUp } from '../utils/helper';

export default function SignUp() {
  const [name, setName] = useState('');
  const [mobno, setMobno] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [blockName, setBlockName] = useState('');
  const [panchatName, setPanchayatName] = useState('');
  const [villageName, setVillageName] = useState('');
  const [gender, setGender] = useState(0);
  const [loading, setLoading] = useState(false);

  const connection = useWalletConnect();
  const queryClient = useQueryClient();

  const onSubmitHandler = async () => {
    try {
      setLoading(true);
      await signUp(
        name,
        aadhar,
        mobno,
        fatherName,
        gender,
        state,
        district,
        blockName,
        panchatName,
        villageName,
        connection
      );
      queryClient.invalidateQueries(['login']);
    } catch (e) {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={tw`h-full flex flex-col items-center justify-center`}>
        <ActivityIndicator size={'large'} />
      </View>
    );

  return (
    <KeyboardAvoidingView>
      <ScrollView
        contentContainerStyle={tw`flex flex-col items-center justify-start p-4 py-5`}>
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='name'
          keyboardType='default'
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='mobile'
          keyboardType='number-pad'
          value={mobno}
          onChangeText={setMobno}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='aadhar'
          keyboardType='default'
          value={aadhar}
          onChangeText={setAadhar}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='fathers name'
          keyboardType='default'
          value={fatherName}
          onChangeText={setFatherName}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='state'
          keyboardType='default'
          value={state}
          onChangeText={setState}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='district'
          keyboardType='default'
          value={district}
          onChangeText={setDistrict}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='block'
          keyboardType='default'
          value={blockName}
          onChangeText={setBlockName}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='panchayat'
          keyboardType='default'
          value={panchatName}
          onChangeText={setPanchayatName}
        />
        <TextInput
          style={tw`bg-white p-2 my-2 w-full rounded-lg`}
          placeholder='village'
          keyboardType='default'
          value={villageName}
          onChangeText={setVillageName}
        />
        <TouchableOpacity
          style={tw`bg-blue-400 px-3 py-2 my-2 rounded-full w-full`}
          onPress={onSubmitHandler}>
          <Text style={tw`text-white text-lg text-center`}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
