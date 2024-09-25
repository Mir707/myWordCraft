import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';

import tw from '../../twrnc-config';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';

const SignIn = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const auth = FIREBASE_AUTH;
  const router = useRouter();

  const submit = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      Alert.alert('Welcome!', 'You have successfully logged in.');
      router.push('/(tabs)/home');
    } catch (error: any) {
      console.log(error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={tw`bg-primary h-full`}>
      <ScrollView>
        <View style={tw`w-full justify-center min-h-[85vh] px-4 my-2`}>
          <Image
            source={images.logo}
            resizeMode="contain"
            style={tw`w-[150px] h-[60px]`}
          />

          <Text
            style={tw`text-2xl text-white font-semibold mt-10 mb-4 font-semibold`}
          >
            Log in to WordCraft
          </Text>

          {/* Fields used to login for user */}
          <FormField
            title="Email"
            value={email}
            handleChangeText={(text) => setEmail(text)}
            otherStyles="mt-5"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={(text) => setPassword(text)}
            otherStyles="mt-5"
          />

          <CustomButton
            title="Log In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          {/* Forgot your password link */}
          <View style={tw`justify-center pt-5 flex-row gap-2`}>
            <Text style={tw`text-lg text-gray-100 font-pregular`}>
              Forgot your password?
            </Text>

            <Link href="../(profile)/forgot-password" asChild>
              <Text style={tw`text-lg font-semibold text-secondary-100`}>
                Reset Password
              </Text>
            </Link>
          </View>

          <View style={tw`justify-center pt-5 flex-row gap-2`}>
            <Text style={tw`text-lg text-gray-100 font-pregular`}>
              Don't have an account?
            </Text>

            <Link href="/sign-up" asChild>
              <Text style={tw`text-lg font-semibold text-secondary-100`}>
                Sign Up
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
