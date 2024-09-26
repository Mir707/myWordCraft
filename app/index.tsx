import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Text, View, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {  Href, router, useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; 
import { GoogleSignin, User , statusCodes } from '@react-native-google-signin/google-signin';

import tw from '../twrnc-config';
import { images } from '../constants';
import { FIREBASE_AUTH } from '../firebaseConfig';
import CustomButton from '../components/CustomButton';

const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <SafeAreaView style={tw`bg-primary h-full`}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={tw`w-full items-center h-full px-4`}>
          <Image
            source={images.logo}
            style={tw`w-[250px] h-[80px]`}
            resizeMode='contain'
          />

          <Image
            source={images.cards}
            style={tw`max-w-[400px] w-full h-[350px]`}
            resizeMode='contain'
          />

          <View style={tw`relative mt-5`}>
            <Text style={tw`text-3xl text-white font-bold text-center`}>
              Share Your Most Beautiful Moments with{' '}
              <Text style={tw`text-secondary-100`}>WordCraft</Text>
            </Text>

            <Image
              source={images.path}
              style={tw`w-[150px] h-[30px] absolute -bottom-2 -right-4`}
              resizeMode='contain'
            />
          </View>

          <Text style={tw`text-sm font-pregular text-gray-100 mt-7 text-center`}>
            Unleash your creativity with WordCraft
            — Create, Connect, and Share your unforgettable moments
          </Text>

          {/* Continue with email button */}
          <CustomButton
            title="Continue with Email"
            handlePress={() => router.push('/sign-in' as Href)}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      {/* <StatusBar backgroundColor='#161622' style='light'/> */}
    </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default App;
