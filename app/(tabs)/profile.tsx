// Creating and editing the user profile
import { View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useFocusEffect } from 'expo-router'
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore'
import { FontAwesome } from '@expo/vector-icons'

import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'
import tw from '../../twrnc-config'


const Profile = () => {
  // user data state
  const [userData, setUserData] = useState<any>({
    username: '',
    profilePictureUrl: '',
  });
  const [userPosts, setUserPosts] = useState<any[]>([]);

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

  // fetch user posts with real-time updates
  const fetchUserPosts = () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const postsColtRef = collection(FIREBASE_DB, 'users', user.uid, 'posts');

        // listener for a real-time updates
        const unsubscribe = onSnapshot(postsColtRef, (snapshot) => {
          const posts = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserPosts(posts);
        })

        // clean the listener when components unmounts
        return () => unsubscribe();
      }
    } catch (error) {
      console.error('Error fetching user posts: ', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      const unsubscribe = fetchUserPosts(); // set up listener
      return unsubscribe; // clean listener
    }, [])
  );

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full flex-1`}>
      {/* Profile header */}
      <View style={tw`flex-row justify-between items-center px-4 mt-4`}>
        <Text style={tw`text-3xl font-bold`}>My Profile</Text>
        <TouchableOpacity onPress={() => router.push('../(profile)/profile-info')}>
          <FontAwesome name='cog' size={28} color="primary" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* Profile image */}
        <View style={tw`items-center mt-4`}>
          <Image
            source={{
              uri: userData.profilePictureUrl || 'https://via.placeholder.com/150'
            }}
            style={tw`w-35 h-35 rounded-full bg-gray-300 mb-4`}
          />
        </View>

        {/* posts */}
        <Text style={tw`text-2xl font-bold mb-4`}>My Posts</Text>
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push({ pathname: '../(posts)/view-post', params:
              { postId: item.id, userId: auth.currentUser?.uid}})}
            >
              <View style={tw`flex-row bg-white p-4 rounded-lg mb-4 shadow-md`}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={tw`w-24 h-24 rounded-md mb-2`}
                />
                <View style={tw`flex-1 ml-4 justify-center`}>
                  <Text style={tw`text-lg font-bold`}>{item.title}</Text>
                  <Text style={tw`text-sm text-gray-600`}>{item.category}</Text>
                  <Text style={tw`text-sm text-gray-500`}>{item.createdAt}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={tw`text-gray-600 text-center`}>No posts available.</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Profile