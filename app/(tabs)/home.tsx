// Home page of the app
import { View, Text, ScrollView, Image, TextInput, FlatList, TouchableOpacity, StatusBar, Modal, Alert, Keyboard } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useRouter } from 'expo-router'

import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import tw from '../../twrnc-config'
import { FontAwesome } from '@expo/vector-icons';

// definitions
interface Post {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  category: string;
  date: string;
  userId: string; // needed to identify the user
}

const Home = () => {
  // states for username, pfp, search bar, and articles
  const [username, setUsername] = useState<string>('');
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>('');
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const router = useRouter();
  const auth = FIREBASE_AUTH;

  // All categories list
  const categories = ['Inspiration', 'Learning & Development', 'Entertainment', 'Health & Wellness'];

  // fetch username and pfp
  const fetchUsername = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username);
          setProfilePictureUrl(userData.profilePictureUrl || '');
        } else {
          console.log('No such document.');
        }
      }
    } catch (error) {
      console.error('Error fetching username: ', error);
    }
  };

  // fetch all posts
  const fetchAllPosts = async () => {
    try {
      const userColtref = collection(FIREBASE_DB, 'users');
      const userSnapshot = await getDocs(userColtref);

      const allPosts: Post[] = [];
      for (const userDoc of userSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        const postsColtRef = collection(FIREBASE_DB, 'users', userId, 'posts');
        const postSnapshot = await getDocs(postsColtRef);

        postSnapshot.forEach((postDoc) => {
          const postData = postDoc.data();
          allPosts.push({
            id: postDoc.id,
            title: postData.title,
            author: userData.username || 'Unknown Author',
            imageUrl: postData.imageUrl,
            category: postData.category,
            date: postData.createdAt,
            userId: userId
          });
        });
      }
      setPosts(allPosts);
    } catch (error) {
      console.error('Error fetching all posts: ', error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchUsername();
      fetchAllPosts();
    }, [])
  );

  // Filtered articles based on the selected category and search
  const filteredPost = posts
      .filter(posts => 
       (!selectedCategory || posts.category === selectedCategory) &&
       (!search || posts.title.toLocaleLowerCase().includes(search.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // new artciles come up first on the list
  
  // handle logout functionality
  const handleLogout = () => {
    auth.signOut().then(() => {
      Alert.alert('Logged out', 'You have been logged out successfully.')
      setModalVisible(false);
      router.replace('/(auth)/sign-in');
    });
  };

  // Header component to show Welcome message, Search bar, and Category Slider
  const renderHeader = () => (
    <View style={tw`bg-primary px-4 pb-4`}>
      <View style={tw`flex-row justify-between items-center`}>

        {/* Welcome section */}
        <View style={tw`mt-5`}>
          <Text style={tw`text-gray-300 text-xl`}>Welcome Back!</Text>
          <Text style={tw`text-2xl font-bold text-white`}>{username || 'User'}</Text>
        </View>

        {/* Profile pic */}
        <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{
            uri: profilePictureUrl || 'https://via.placeholder.com/150',
          }}
          style={tw`w-15 h-15 rounded-full bg-gray-300 mr-3 mt-6`}
        />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={tw`flex-row items-center px-2 mt-6 bg-gray-200 rounded-full`}>
        <TextInput
          placeholder="Search"
          style={tw`flex-1 px-4 py-2 text-lg`}
          value={search}
          onChangeText={text => setSearch(text)}
          autoFocus={false}
          blurOnSubmit={false}
        />
        <FontAwesome name='search' size={20} color='gray' style={tw`mr-4`} />
      </View>
    </View>
  );

  // modal for account + log out
  const renderModal = () => (
    <Modal
      transparent={true}
      animationType='slide'
      visible={modalVisible}
      onRequestClose={()=> setModalVisible(false)}
    >
      {/* to close modal when clicking outside */}
      <TouchableOpacity style={tw`flex-1 justify-end`}
        activeOpacity={1} onPress={() => setModalVisible(false)}>
        <View style={tw`bg-gray-100 h-1/2 rounded-t-lg p-4 mr-2 ml-2`}>
          <Text style={tw`text-2xl font-bold mb-4`}>Menu</Text>

          {/* options */}
          <TouchableOpacity onPress={() => {
            setModalVisible(false);
            router.push('../(profile)/profile-info')
          }}
            style={tw`py-4 border-b border-gray-200 flex-row`}
          >
            <FontAwesome name='user' size={24} color='black' style={tw`mr-3`}/>
            <Text style={tw`text-lg`}>Account</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleLogout} style={tw`py-4 flex-row`}>
          <FontAwesome name='sign-out' size={24} color='red' style={tw`mr-3`}/>
            <Text style={tw`text-lg text-red-600`}>Logout</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  )

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full`}>
      {renderModal()}
      <FlatList
        data={filteredPost}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({
              pathname: '../(posts)/view-post', params:
                { postId: item.id, userId: item.userId }
            })}
          >
            <View style={tw`flex-row bg-white mx-4 p-4 rounded-lg mb-4 shadow-md`}>
              <Image
                source={{ uri: item.imageUrl }}
                style={tw`w-24 h-24 rounded-lg`}
              />
              <View style={tw`flex-1 ml-4 justify-center`}>
                <Text style={tw`text-base font-semibold`}>{item.title}</Text>
                <Text style={tw`text-sm text-gray-600`}>{item.author}</Text>
                <Text style={tw`text-sm text-gray-500`}>{item.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListHeaderComponent={() => (
          <>
            {renderHeader()}
            {/* Category Slider */}
            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={tw`px-4 py-2 rounded-full ${selectedCategory === item ? 'bg-purple' : 'bg-gray-300'} mx-2 mb-6`}
                  onPress={ () => {
                    if (selectedCategory === item) {
                      setSelectedCategory('');
                    } else {
                      setSelectedCategory(item);
                    }
                  }}
                >
                  <Text style={tw`${selectedCategory === item ? 'text-white' : 'text-black'} font-semibold`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={tw`mt-4 px-2`}
            />
          </>
        )}
        ListEmptyComponent={
          <Text style={tw`text-gray-600 mt-4 text-center`}>No articles available for this category.</Text>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      />
      <StatusBar backgroundColor="#161622" barStyle="light-content" />
    </SafeAreaView >
  )
}

export default Home