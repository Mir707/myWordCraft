import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Link, Href, router } from 'expo-router';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc }  from 'firebase/firestore';

import tw from '../../twrnc-config';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';


const SignUp = () => {
  // states
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const auth = FIREBASE_AUTH;
  const router = useRouter(); // nagivagte to other pages

  // function to submit the data to firebase auth
  const submit = async () => {
    setIsSubmitting(true); // start loading state
    try {
      // Firebase sign-up
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // update profile with username
      if (user) {
        await updateProfile(user, {
          displayName: username,
        });
      }

      // create firestore document
      const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
      await setDoc(userDocRef, {
        username: username,
        email: email,
        phone: '',
        dob: '',
        gender:'',
        profilePicture: '',
        createdAt: new Date().toISOString(),
        userId: user.uid
      });

      // message to succesfully create
      Alert.alert('Success', 'Account successfully created!');
      console.log('User account created', user);
      router.push('/(tabs)/home');

    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred.');
      console.error('Error', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={tw`bg-primary h-full`}>
      <ScrollView>
        <View style={tw`w-full justify-center min-h-[85vh] px-4 my-2`}>
          <Image
            source={images.logo}
            resizeMode='contain'
            style={tw`w-[150px] h-[60px]`}
          />

          <Text style={tw`text-2xl text-white font-semibold mt-10 mb-4 font-semibold`}>
            Sign Up to WordCraft
          </Text>

          {/* Fields used to sign up for user */}
          <FormField
            title="Username"
            value={username}
            handleChangeText={setUsername}
            otherStyles="mt-5"
          />

          <FormField
            title="Email"
            value={email}
            handleChangeText={setEmail}
            otherStyles="mt-5"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={password}
            handleChangeText={setPassword}
            otherStyles="mt-5"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View style={tw`justify-center pt-5 flex-row gap-2`}>
            <Text style={tw`text-lg text-gray-100 font-pregular`}>
              Have an account already?
            </Text>

            <Link href="/sign-in" asChild>
              <Text style={tw`text-lg font-semibold text-secondary-100`}>
                Log In
              </Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
