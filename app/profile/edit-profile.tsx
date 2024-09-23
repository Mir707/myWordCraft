import { View, Text, ScrollView, TextInput, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_SR } from '@/firebaseConfig'
import CustomButton from '@/components/CustomButton'
import tw from '@/twrnc-config'
import { FontAwesome } from '@expo/vector-icons'


const EditProfile = () => {
  // state to hold data
  const [userData, setUserData] = useState<any>({
    username: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    profilePicture: '',
  });

  const [imageUri, setImageUri] = useState<string | null>(null); // state for holding image
  const auth = FIREBASE_AUTH;
  const router = useRouter();

  // fetch user data
  const fetchUserData = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        // check the user details if exist
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // handle image pciker
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      setImageUri(pickedUri);
    }
  }
  
  // handle update user data
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        let profilePictureUrl = userData.profilePicture;

        // if a new img is picked, upload to storage
        if (imageUri){
          const response = await fetch(imageUri);
          const blob = await response.blob();

          const storageRef = ref(FIREBASE_SR, 'profilePictures/${user.uid}');
          await uploadBytes(storageRef, blob);

          // get download url of the image
          profilePictureUrl = await getDownloadURL(storageRef);
        }

        // update user data
        const userDocRef = doc(FIREBASE_DB, 'user', user.uid)
        await updateDoc(userDocRef, {
          username: userData.username,
          phone: userData.phone,
          dob: userData.dob,
          gender: userData.gender,
          profilePictureUrl: profilePictureUrl
        });

        Alert.alert('Succes', "Profile updated succesfully!");
        router.back(); // go back to profile page
      }
    } catch (error) {
      console.error('Error updating user data: ', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.')
    }
  }

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full flex-1`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <View style={tw`flex-row items-center mb-5`}>
          <Text style={tw`text-3xl font-bold`}>Edit Profile</Text>
        </View>

        {/* profile picture */}
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={{
              uri: imageUri || userData.profilePicture || 'https://via.placeholder.com/150'
            }}
            style={tw`w-35 h-35 rounded-full bg-gray-300 mb-4`}
          />
          <Text style={tw`text-sm text-gray-500 mt-2 text-center`}>
            Tap to change profile picture
          </Text>
        </TouchableOpacity>
          
        {/* profile fields */}
        <TextInput
          style={tw`bg-white px-4 py-2 rounded-md mb-4`}
          placeholder='Username'
          value={userData.username}
          onChangeText={(text) => setUserData({ ...userData, username: text})}
        />

        <TextInput
          style={tw`bg-white px-4 py-2 rounded-md mb-4`}
          placeholder='Phone'
          value={userData.phone}
          onChangeText={(text) => setUserData({ ...userData, phone: text})}
        />

        <TextInput
          style={tw`bg-white px-4 py-2 rounded-md mb-4`}
          placeholder='Date of Birth'
          value={userData.dob}
          onChangeText={(text) => setUserData({ ...userData, dob: text})}
        />

        <TextInput
          style={tw`bg-white px-4 py-2 rounded-md mb-4`}
          placeholder='Gender'
          value={userData.gender}
          onChangeText={(text) => setUserData({ ...userData, gender: text})}
        />

        <CustomButton
          title='Save'
          handlePress={handleSave}
          containerStyles='bg-secondary-100 px-35 mt-5 rounded-xl min-h-[62px] justify-center items-center'
          textStyles='text-primary font-bold text-lg'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile