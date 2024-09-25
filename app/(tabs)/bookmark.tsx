// Show the bookmarked blog in the screen
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { doc, collection, getDocs, deleteDoc, arrayRemove, updateDoc } from 'firebase/firestore';

import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig'
import tw from '@/twrnc-config'
import { useFocusEffect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const Bookmark = () => {
  const [bookmarkedPosts, setBookmarkedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = FIREBASE_AUTH;
  const router = useRouter();
  const currentUserId = auth.currentUser?.uid;

  // fetch bookmarked posts
  const fetchBookmarkedPosts = async () => {
    try {
      if (!currentUserId) {
        console.error('User is not authenticated.');
        return;
      }

      // Fetch the bookmarks collection for the current user
      const bookmarksColRef = collection(FIREBASE_DB, 'users', currentUserId, 'bookmarks');
      const bookmarkSnapshot = await getDocs(bookmarksColRef);

      const bookmarkedPostsData = bookmarkSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setBookmarkedPosts(bookmarkedPostsData);
    } catch (error) {
      console.error('Error fetching bookmarked posts: ', error);
    } finally {
      setLoading(false);
    }
  };

  // handle removing a bookmark from this page
  const handleUnbookmark = async (postId: string | undefined, postUserId: string | undefined) => {
    try {
      if (postId && currentUserId) {
        const bookmarkDocRef = doc(FIREBASE_DB, 'users', String(currentUserId), 'bookmarks', postId);

        // Remove the bookmarked post
        await deleteDoc(bookmarkDocRef);

        // update on the bookmark in the view post page
        const postDocRef = doc(FIREBASE_DB, 'users', String(postUserId), 'posts', String(postId))
        await updateDoc(postDocRef, {
          bookmarks: arrayRemove(currentUserId)
        })

        setBookmarkedPosts(bookmarkedPosts.filter(p => p.id !== postId)); // Update the UI list
      }
    } catch (error) {
      console.error('Error removing bookmark: ', error);
    }
  };

  // focusEffect to  refetch data
  useFocusEffect(
    useCallback(() => {
      fetchBookmarkedPosts();
    }, [currentUserId])
  );

  if (loading) return <ActivityIndicator size='large' color='#0000ff' style={tw`mt-10`} />

  return (
    <SafeAreaView>
      <View style={tw`bg-purple-200 h-full`}>
        {/* Title Header */}
        <View style={tw`bg-primary px-4 py-4 items-center mb-4`}>
          <Text style={tw`text-white text-2xl font-bold`}>Bookmarked Posts</Text>
        </View>

        <FlatList
          data={bookmarkedPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '../(posts)/view-post',
                  params: { postId: item.id, userId: item.userId }
                })
              }
            >
              <View style={tw`flex-row bg-white mx-4 p-4 rounded-lg mb-4 shadow-md`}>
                {item.imageUrl && (
                  <Image source={{ uri: item.imageUrl }} style={tw`w-24 h-24 rounded-lg`} />
                )}
                <View style={tw`flex-1 ml-4 justify-center`}>
                  <Text style={tw`text-base font-semibold`}>{item.title}</Text>
                  <Text style={tw`text-sm text-gray-600`}>{item.username}</Text>
                  <Text style={tw`text-sm text-gray-500`}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                {/* Bookmark icon */}
                <TouchableOpacity onPress={() => handleUnbookmark(item.id, item.userId)}>
                  <FontAwesome name='bookmark' size={24} color='blue' />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={tw`text-gray-600 mt-4 text-center`}>No bookmarked posts</Text>
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        />
      </View>
    </SafeAreaView>
  )
}

export default Bookmark;
