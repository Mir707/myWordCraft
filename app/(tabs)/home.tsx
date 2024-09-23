// Home page of the app
import { View, Text, ScrollView, Image, TextInput, FlatList, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FIREBASE_AUTH, FIREBASE_DB } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import tw from '../../twrnc-config'

// definitions
interface Article {
  id: string;
  title: string;
  author: string;
  imageUrl: string;
  category: 'Inspiration' | 'Learning & Development' | 'Entertainment' | 'Health & Wellness';
  date: string;
  readTime: string;
}

const Home = () => {
  // states for username, search bar, and articles
  const [username, setUsername] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [articles, setArticles] = useState<Article[]>([
    // dummy articles for now, later fetch using firebase/firestore 
    // user can 3 articles, then click on show more if want to read others
    {
      id: '1',
      title: 'How To Solve Cases As A Psychic',
      author: 'Shawn Spencer',
      imageUrl: 'https://ntvb.tmsimg.com/assets/p185254_b_h10_ae.jpg?w=1280&h=720',
      category: 'Learning & Development',
      date: 'Jan 20',
      readTime: '8 min read',
    },
    {
      id: '2',
      title: 'Because I Am The Strongest',
      author: 'Gojo Satoru',
      imageUrl: 'https://butwhytho.net/wp-content/uploads/2023/09/Gojo-Jujutsu-Kaisen-But-Why-Tho-2.jpg',
      category: 'Health & Wellness',
      date: 'Feb 14',
      readTime: '5 min read',
    },
    {
      id: '3',
      title: 'Plotting Revenge Like No Other',
      author: 'Moon Dong-Eun',
      imageUrl: 'https://static1.srcdn.com/wordpress/wp-content/uploads/2023/03/netflix-the-glory-true-story-1.jpg',
      category: 'Inspiration',
      date: 'Dec 30',
      readTime: '10 min read',
    },
    // add more article
  ]);

  // All categories list
  const categories = ['Inspiration', 'Learning & Development', 'Entertainment', 'Health & Wellness'];

  // fetch username
  const fetchUsername = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUsername(userData.username);
        } else {
          console.log('No such document.');
        }
      }
    } catch (error) {
      console.error('Error fetching username: ', error);
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  // Filtered articles based on the selected category
  const filteredArticles = articles
    .filter(article => article.category === selectedCategory)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // new artciles come up first on the list

  // Header component to show Welcome message, Search bar, and Category Slider
  const renderHeader = () => (
    <View style={tw `bg-primary px-4 pb-4`}>
      {/* Welcome section */}
      <View style={tw`mt-5`}>
        <Text style={tw`text-gray-300 text-xl`}>Welcome Back!</Text>
        <Text style={tw`text-2xl font-bold text-white`}>{username || 'User'}</Text>
      </View>

      {/* Search Bar */}
      <View style={tw`px-4 mt-4`}>
        <TextInput
          placeholder="Search"
          style={tw`bg-gray-200 rounded-full px-4 py-2 text-lg`}
          value={search}
          onChangeText={text => setSearch(text)}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full`}>
      <FlatList
        data={filteredArticles}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={tw`flex-row bg-white mx-4 p-4 rounded-lg mb-4 shadow-md`}>
            <Image
              source={{ uri: item.imageUrl }}
              style={tw`w-24 h-24 rounded-lg`}
            />
            <View style={tw`flex-1 ml-4 justify-center`}>
              <Text style={tw`text-base font-semibold`}>{item.title}</Text>
              <Text style={tw`text-sm text-gray-600`}>{item.author}</Text>
              <Text style={tw`text-sm text-gray-500`}>{item.date} - {item.readTime}</Text>
            </View>
          </View>
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
                  style={tw`px-4 py-2 rounded-full ${selectedCategory === item ? 'bg-purple' : 'bg-gray-300'} mx-2`}
                  onPress={() => setSelectedCategory(item)}
                >
                  <Text style={tw`${selectedCategory === item ? 'text-white' : 'text-black'} font-semibold`}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={tw`mt-4 px-2`}
            />

            {/* Title for the selected category */}
            <Text style={tw`text-lg font-bold text-black mt-4 px-4`}>{selectedCategory} Articles</Text>
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