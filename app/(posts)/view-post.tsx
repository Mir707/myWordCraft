// page to display the whole post
import { View, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { arrayRemove, arrayUnion, deleteDoc, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebaseConfig';
import tw from '@/twrnc-config';
import { FontAwesome } from '@expo/vector-icons';

const ViewPost = () => {
    const { postId, userId } = useLocalSearchParams();
    const [postData, setPostData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [hasLiked, setHasLiked] = useState(false);
    const [bookmarked, setBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [bookmarkCount, setBookmarkCount] = useState<number>(0);

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
                    console.log("Fetched post data:", data);
                    setPostData(data);
                    setHasLiked(data.likes?.includes(currentUserId));
                    setBookmarked(data.bookmarks?.includes(currentUserId));
                    setLikeCount(data.likes?.length || 0);
                    setBookmarkCount(data.bookmarks?.length || 0);
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
                    setLikeCount(likeCount - 1); // decrement
                } else {
                    await updateDoc(postDocRef, {
                        likes: arrayUnion(currentUserId)
                    });
                    setLikeCount(likeCount + 1); // increase
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
            if (postId && userId && currentUserId) {
                // Reference to the post's document and the user's bookmark document
                const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));
                const bookmarkDocRef = doc(FIREBASE_DB, 'users', String(currentUserId), 'bookmarks', String(postId));

                if (bookmarked) {
                    // If the post is already bookmarked, remove from both the post's bookmark array and the user's bookmarks collection
                    await updateDoc(postDocRef, {
                        bookmarks: arrayRemove(currentUserId)
                    });
                    await deleteDoc(bookmarkDocRef);

                    setBookmarkCount(bookmarkCount - 1); // Decrement bookmark count
                    setBookmarked(false); // Update the state to reflect unbookmarking
                } else {
                    // If the post is not yet bookmarked, add to the post's bookmark array and user's bookmarks collection
                    await updateDoc(postDocRef, {
                        bookmarks: arrayUnion(currentUserId)
                    });

                    // Wait until `setDoc` is successful before proceeding
                    await setDoc(bookmarkDocRef, {
                        postId: postId,
                        userId: userId,
                        title: postData.title || "Untitled Post",
                        imageUrl: postData.imageUrl || "",
                        category: postData.category || "Uncategorized",
                        content: postData.content || "",
                        createdAt: postData.createdAt || new Date().toISOString(),
                        author: postData.username || "Unknown Author"
                    });

                    setBookmarkCount(bookmarkCount + 1); // Increment bookmark count
                    setBookmarked(true); // Update the state to reflect bookmarking
                }
            }
        } catch (error) {
            console.error('Error bookmarking post: ', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
        fetchPostData();
    }, [postId, userId]))

    if (loading) return <ActivityIndicator size="large" color="#0000ff" style={tw`mt-10`} />

    return (
        <SafeAreaView style={tw`bg-purple-200 h-full`}>
            {/* Title Header */}
            <View style={tw`bg-primary px-4 py-4 flex-row items-center mb-4`}>
                <TouchableOpacity onPress={() => router.back()} style={tw`mr-3`}>
                    <FontAwesome name='arrow-left' size={24} color='white' />
                </TouchableOpacity>
                <Text style={tw`text-white text-2xl font-bold`}>Post</Text>
            </View>
            <ScrollView contentContainerStyle={tw`flex-1 justify-center p-4 items-center`}>
                {/* post title */}
                <Text style={tw`text-3xl font-bold mb-4`}>{postData.title || "Untitled Post"}</Text>

                <View style={tw`bg-white p-4 rounded-lg mb-4 w-11/12`}>
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
                    <Text style={tw`text-sm text-gray-500 mb-2`}>Posted on: {new Date(postData.createdAt).toLocaleDateString()}</Text>

                    {/* post content */}
                    <Text style={tw`text-base text-gray-800`}>{postData.content}</Text>

                    {/* like and bookmark button and counter */}
                    <View style={tw`flex-row justify-between items-center mt-4`}>
                        <TouchableOpacity onPress={handleLike} style={tw`flex-row items-center`}>
                            <FontAwesome name={hasLiked ? 'heart' : 'heart-o'} size={24} color={hasLiked ? 'red' : 'gray'} />
                            <Text style={tw`ml-2 text-lg`}>{likeCount} {likeCount === 1 ? 'Like' : 'Likes'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={handleBookmark} style={tw`flex-row items-center`}>
                            <FontAwesome name={bookmarked ? 'bookmark' : 'bookmark-o'} size={24} color={bookmarked ? 'blue' : 'gray'} />
                            <Text style={tw`ml-2 text-lg`}>{bookmarkCount} {bookmarkCount === 1 ? 'Bookmark' : 'Bookmarks'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default ViewPost