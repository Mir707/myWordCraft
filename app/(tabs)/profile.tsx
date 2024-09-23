// Creating and editing the user profile
import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'
import CustomButton from '../../components/CustomButton';
import tw from '../../twrnc-config'
import ProfileItem from '@/components/ProfileItem'
import { images } from '../../constants';

const Profile = () => {
  // user data state
  const [userData, setUserData] = useState<any>({
    username: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    profilePicture: '',
  });

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

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full flex-1`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Profile header */}
        <View style={tw`flex-row items-center mb-5`}>
        {/* <Image
            source={images.logoSmall}
            resizeMode='contain'
            style={tw`w-[100px] h-[50px]`}
          /> */}
          <Text style={tw`text-3xl font-bold`}>Profile</Text>
        </View>

        <View style={tw`items-center`}>
          <Image
            source={{
              uri: userData.profilePicture || 'https://via.placeholder.com/150'
            }}
            style={tw`w-35 h-35 rounded-full bg-gray-300 mb-4`}
          />

          {/* <Text style={tw`text-while text-xl mt-2 font-bold`}>
            {userData.username || 'Your Name'}
          </Text> */}

          <ProfileItem
            icon={<FontAwesome name='user' size={20} color='black'/>}
            value={userData.username || 'Your Name'}
          />

          <ProfileItem
            icon={<MaterialIcons name='email' size={20} color='black'/>}
            value={userData.email || 'Email not provided.'}
          />

          <ProfileItem
            icon={<FontAwesome name='phone' size={20} color='black'/>}
            value={userData.phone || 'Phone number not provided.'}
          />

          <ProfileItem
            icon={<FontAwesome name='birthday-cake' size={20} color='black'/>}
            value={userData.dob || 'Date of Birth not provided.'}
          />

          <ProfileItem
            icon={<FontAwesome name='venus-mars' size={20} color='black'/>}
            value={userData.gender || 'Gender not specified.'}
          />

          <CustomButton
            title="Edit Profile"
            handlePress={() => router.push('../profile/edit-profile')}
            containerStyles='bg-secondary-100 px-35 mt-5 rounded-xl min-h-[62px] justify-center items-center'
            textStyles='text-primary font-bold text-lg'
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile