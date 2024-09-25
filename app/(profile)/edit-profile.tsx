import { View, Text, ScrollView, TextInput, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import * as ImagePicker from 'expo-image-picker'
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker'
import { createStackNavigator } from '@react-navigation/stack';

import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_SR } from '@/firebaseConfig'
import CustomButton from '@/components/CustomButton'
import tw from '@/twrnc-config'
import { FontAwesome } from '@expo/vector-icons'

const Stack = createStackNavigator();

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

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(userData.dob ? new Date(userData.dob): undefined)

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

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  // handle image picker
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
        // check for new image to upload
        let profilePictureUrl = userData.profilePicture;

        if (imageUri){
          const imageRef = ref(FIREBASE_SR, `profilePictures/${user.uid}`)

          // upload to storage
          const response = await fetch(imageUri);
          const blob = await response.blob();

          await uploadBytes(imageRef, blob);

          // get download url of the image
          profilePictureUrl = await getDownloadURL(imageRef);
        }

        // update user data
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid)
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

  // handle insert and change date
  const onChange = (event: any, selectedDate?: Date) =>{
    setShowDatePicker(false);
    if (selectedDate){
      setDate(selectedDate);
      setUserData({...userData, dob: selectedDate.toISOString().split('T')[0]})
    }
  }

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full flex-1`}>
      <View style={tw`bg-primary py-4 px-4 flex-row items-center mb-4`}>
        <TouchableOpacity onPress={() => router.back()} style={tw`mr-3`}>
          <FontAwesome name='arrow-left' size={24} color='white' />
        </TouchableOpacity>
        <Text style={tw`text-white text-3xl font-bold`}>Edit Profile</Text>
      </View>


      <ScrollView contentContainerStyle={tw`p-4`}>
        <View>
          {/* profile picture */}
        <TouchableOpacity onPress={handleImagePick} style={tw`items-center mb-4`}>
          <View style={tw`relative`}>
          <Image
            source={{
              uri: imageUri || userData.profilePictureUrl || 'https://via.placeholder.com/150'
            }}
            style={tw`w-35 h-35 rounded-full bg-gray-300`}
          />
          <View style={tw`absolute bottom-0 right-0 bg-gray-700 p-1 rounded-full`}>
            <FontAwesome name='camera' size={20} color='white'/>
          </View>
          </View>
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

        <TouchableOpacity style={tw`bg-white px-4 py-2 rounded-md mb-4 w-full`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-black`}>
            {userData.dob ? userData.dob : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>
        
        {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              mode={'date'}
              display="default"  
              onChange={onChange}
              maximumDate={new Date()}  // prevents selecting future dates
            />
          )}

        <View style={tw`bg-white rounded-md mb-4 w-full`}>
          <Picker selectedValue={userData.gender}
           onValueChange={(itemValue) => setUserData({...userData, gender: itemValue})}
           style={tw`px-4 py-2`}
          >
            <Picker.Item label='Select Gender' value=''/>
            <Picker.Item label='Male' value='Male'/>
            <Picker.Item label='Female' value='Female'/>
          </Picker>
        </View>

        <CustomButton
          title='Save'
          handlePress={handleSave}
          containerStyles='bg-secondary-100 px-35 mt-5 rounded-xl min-h-[62px] justify-center items-center'
          textStyles='text-primary font-bold text-lg'
        />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditProfile