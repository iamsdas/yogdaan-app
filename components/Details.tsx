import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useLoans, useRequests, useUser } from '../utils/queries';
import { ScrollView } from 'react-native-gesture-handler';

const Details = ({ navigation, route }: NativeStackScreenProps<any>) => {
  const shg = route.params?.shg;
  const connection = useWalletConnect();
  const { data: user } = useUser(connection.accounts[0]);
  const { data: loans, isLoading: loanLoading } = useLoans(user?.id);
  const { data: requests, isLoading: requestLoadin } = useRequests(user?.id);

  const details = [
    { key: 'Name', value: shg.name },
    { key: 'Date of Formation', value: shg.dateOfFormation },
    { key: 'Base Interest Rate', value: shg.baseInterest },
    { key: 'State', value: shg.location.state },
    { key: 'District', value: shg.location.district },
    { key: 'Block', value: shg.location.blockName },
    { key: 'Panchayat', value: shg.location.panchayatName },
    { key: 'Village', value: shg.location.panchayatName },
  ];

  const loan_details = (
    <>
      <Text style={tw`text-2xl p-4 py-6 text-gray-700 font-medium`}>
        Loan History
      </Text>
      <View
        style={tw`flex items-center justify-center bg-white border border-gray-200 rounded-xl`}>
        {loanLoading ? (
          <View style={tw`py-6`}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : loans?.length ? (
          loans
            .filter((loan) => loan.lenderId === shg.id)
            ?.map((loan) => (
              <Text style={tw`text-center`}>
                {loan.date}
                {loan.amount}
              </Text>
            ))
        ) : (
          <Text style={tw`py-18 text-lg text-gray-700`}>
            No past history with this SHG
          </Text>
        )}
      </View>
    </>
  );
  const request_details = (
    <>
      <Text style={tw`text-2xl p-4 py-6 text-gray-700 font-medium`}>
        Pending Requests
      </Text>
      <View
        style={tw`flex items-center justify-center bg-white border border-gray-200 rounded-xl`}>
        {requestLoadin ? (
          <View style={tw`py-6`}>
            <ActivityIndicator size={'large'} />
          </View>
        ) : requests?.length ? (
          requests
            .filter((req) => req.SHGId === shg.id)
            ?.map((req) => (
              <Text style={tw`text-center`}>
                {req.description}
                {req.amount}
              </Text>
            ))
        ) : (
          <Text style={tw`py-18 text-lg text-gray-700`}>
            No past requests for this SHG
          </Text>
        )}
      </View>
    </>
  );
  return (
    <View style={tw`h-full p-4 flex flex-col justify-between`}>
      <ScrollView>
        <Text style={tw`text-2xl text-gray-700 my-4 font-medium`}>
          SHG Details
        </Text>
        <View style={tw`p-4 border-2 border-gray-200 bg-white rounded-xl`}>
          {details.map((detail, idx) => (
            <View style={tw`flex w-full flex-row mb-1`} key={idx}>
              <Text style={tw`text-xl text-gray-800 font-semibold`}>
                {detail.key}:{' '}
              </Text>
              <Text style={tw`text-xl text-gray-700 capitalize`}>
                {detail.value}
              </Text>
            </View>
          ))}
        </View>
        {loan_details}
        {request_details}
      </ScrollView>
      <TouchableOpacity
        style={tw`bg-blue-400 px-3 py-2 my-3 rounded-full w-full`}
        onPress={() => {
          navigation.navigate({ name: 'Request', params: { shg } });
        }}>
        <Text style={tw`text-white text-lg text-center`}>Create Request</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
