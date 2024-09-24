// page to display the whole post
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import tw from '@/twrnc-config';
import { FontAwesome } from '@expo/vector-icons';

const ViewPost = () => {
    const { postId, userId } = useLocalSearchParams();
    const [postData, setPostData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);

    const auth = FIREBASE_AUTH;
    const currentUserId = auth.currentUser?.uid;
    const router = useRouter();

    // fetch post data
    const fetchPostData = async () => {
        try {
            if (postId && userId) {
                const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));
                const postDocSnap = await getDoc(postDocRef);

                if (postDocSnap.exists()) {
                    const data = postDocSnap.data();
                    setPostData(data);
                    setHasLiked(data.likes?.includes(currentUserId));
                    setBookmarked(data.bookmarks?.includes(currentUserId))
                }
            }
        } catch (error) {
            console.log('Error fetching post data: ', error);
        } finally {
            setLoading(false);
        }
    };

    // handle like action
    const handleLike = async () => {
        try {
            if (postId && userId) {
                const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));

                if (hasLiked) {
                    await updateDoc(postDocRef, {
                        likes: arrayRemove(currentUserId)
                    });
                } else {
                    await updateDoc(postDocRef, {
                        likes: arrayUnion(currentUserId)
                    });
                }
                setHasLiked(!hasLiked)
            }
        } catch (error) {
            console.error('Error liking post: ', error)
        }
    }

    // handle bookmark action
    const handleBookmark = async () => {
        try {
            if (postId && userId) {
                const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));

                if (bookmarked) {
                    await updateDoc(postDocRef, {
                        bookmarks: arrayRemove(currentUserId)
                    });
                } else {
                    await updateDoc(postDocRef, {
                        bookmarks: arrayUnion(currentUserId)
                    });
                }
                setBookmarked(!bookmarked)
            }
        } catch (error) {
            console.error('Error bookmarking post: ', error)
        }
    }

    useEffect(() => {
        fetchPostData();
    }, [postId]);

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={tw`mt-10`} />

    return (
        <SafeAreaView style={tw`bg-purple-200 h-full`}>
            <ScrollView contentContainerStyle={tw`p-4`}>
                {/* post title */}
                <Text style={tw`text-3xl font-bold mb-2`}>{postData.title}</Text>

                <View style={tw`bg-white p-4 rounded-lg mb-4`}>
                {/* post image */}
                {postData.imageUrl && (
                    <Image
                        source={{ uri: postData.imageUrl }}
                        style={tw`w-full h-64 rounded-lg mb-4`}
                        resizeMode='cover'
                    />
                )}

                {/* post category */}
                <Text style={tw`text-sm text-gray-600 mb-2`}>Category: {postData.category}</Text>

                {/* post date */}
                <Text style={tw`text-sm text-gray-500 mb-2`}>Posted on: {new Date(postData.category).toLocaleDateString()}</Text>

                {/* post content */}
                <Text style={tw`text-base text-gray-800`}>{postData.content}</Text>

                {/* like and bookmark button */}
                <View style={tw`flex-row justify-between items-center mt-4`}>
                    <TouchableOpacity onPress={handleLike} style={tw`flex-row items-center`}>
                        <FontAwesome name={hasLiked ? 'heart' : 'heart-o'} size={24} color={hasLiked ? 'red' : 'gray'}/>
                        <Text style={tw`ml-2 text-lg`}>{hasLiked ? 'Unlike' : 'Like'}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleBookmark} style={tw`flex-row items-center`}>
                        <FontAwesome name={bookmarked ? 'bookmark' : 'bookmark-o'} size={24} color={bookmarked ? 'blue' : 'gray'}/>
                        <Text style={tw`ml-2 text-lg`}>{bookmarked ? 'Bookmarked' : 'Bookmark'}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewPost