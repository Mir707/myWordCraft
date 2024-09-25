import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { sendPasswordResetEmail } from 'firebase/auth'

import tw from '@/twrnc-config'
import { FIREBASE_AUTH } from '@/firebaseConfig'
import FormField from '../../components/FormField';
import CustomButton from '@/components/CustomButton'

const ForgotPassword = () => {
  const [email, setEmail] = useState<string>('');

  // handle password reset
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.')
      return;
    }

    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      Alert.alert('Password Reset Email Sent',
        'Please check your email to reset your password.'
      )
    } catch (error: any) {
      console.error('Error resetting password: ', error);
      Alert.alert('Error', 'Failed to send reset email. Please try again.');
    }
  }

  return (
    <SafeAreaView style={tw`bg-primary h-full`}>
      <ScrollView contentContainerStyle={tw`flex-1 justify-center px-4`}>
        <Text style={tw`text-2xl text-white font-semibold mb-6 text-center`}>
          Reset Password
        </Text>

        {/* Email Input Field using FormField component */}
        <FormField
          title="Email"
          value={email}
          handleChangeText={(text) => setEmail(text)}
          otherStyles="mb-4"
          keyboardType="email-address"
          placeholder="Enter your email address"
        />

        <CustomButton
          title="Send Reset Email"
          handlePress={handlePasswordReset}
          containerStyles="mt-4"
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default ForgotPassword