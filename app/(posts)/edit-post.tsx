// edit and update the bolg post
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import { useRouter, useLocalSearchParams } from 'expo-router'

import { FIREBASE_AUTH , FIREBASE_DB, FIREBASE_SR } from '@/firebaseConfig'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import CustomButton from '@/components/CustomButton'
import tw from '../../twrnc-config'
import { FontAwesome } from '@expo/vector-icons'

const EditPost = () => {
  // states to hold data for the posts
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const auth = FIREBASE_AUTH;
  const storage = getStorage();
  const router = useRouter();
  const { postId, userId } = useLocalSearchParams();

  // fetch exisitng content
  const fetchPostData = async () => {
    try {
        console.log(`Fetching data for postId: ${postId}, userId: ${userId}`);
        if (postId && userId) {
            const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));
            const postDocSnap = await getDoc(postDocRef);

            if (postDocSnap.exists()) {
                const data = postDocSnap.data();
                console.log('Fetched data for post: ', data);

                setTitle(data?.title || '');
                setCategory(data?.category || '');
                setContent(data?.content || '');
                setExistingImageUrl(data?.imageUrl || null);
                setLoading(false);
            } else {
                Alert.alert('Error', 'Post not found.');
            }
        }
    } catch (error) {
        console.error('Error fetching post data: ', error);
        Alert.alert('Error', 'Failed to fetch post data.');
    }
  }

  // handle the image
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const pickedUri = result.assets[0].uri;
      setImageUri(pickedUri);
    }
  };

  // handle updating posts
  const handleUpdatePost = async () => {
    try {
      if (!title || !content || !category){
        Alert.alert('Validation Error', 'Please fill in all the fields.');
        return;
      }

      const user = auth.currentUser;
      if (user){
        // upload the new image to storage
        let imageUrl = existingImageUrl;
        if (imageUri){
          const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
          const response = await fetch(imageUri);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        }

        // update existing post doc
        const postDocRef = doc(FIREBASE_DB, 'users', String(userId), 'posts', String(postId));
        await updateDoc (postDocRef, {
          title,
          category,
          content,
          imageUrl,
          updatedAt: new Date().toISOString(),
        });
        
        Alert.alert('Success', 'Your post has been updated!');
        router.back(); // go back to prev page
      }
    } catch (error) {
      console.error('Error updating post: ', error);
      Alert.alert('Error', 'An error occured while updating your post.');
    }
  };

  useEffect(() => {
    fetchPostData();
  }, [postId, userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={tw`mt-10`} />;
  }
  
  return (
    <SafeAreaView style={tw`bg-purple-200 h-full`}>
          {/* Title Header */}
          <View style={tw`bg-primary px-4 py-4 flex-row items-center mb-4`}>
              <TouchableOpacity onPress={() => router.back()} style={tw`mr-3`}>
                  <FontAwesome name='arrow-left' size={24} color='white' />
              </TouchableOpacity>
              <Text style={tw`text-white text-2xl font-bold`}>Edit Post</Text>
          </View>

      <ScrollView contentContainerStyle={tw`p-4`}>
        {/* edit title to post */}
        <Text style={tw`text-xl font-bold mb-2`}>Post Title</Text>
        <TextInput
          style={tw`bg-white px-4 py-4 rounded-md mb-4`}
          placeholder='Title'
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        {/* edit category */}
        <Text style={tw`text-xl font-bold mb-2`}>Post Category</Text>
        <View style={tw`bg-white rounded-md mb-4`}>
          <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)} style={tw`px-4 py-2`}>
            <Picker.Item label='Select Category' value=''/>
            <Picker.Item label='Inspiration' value='Inspiration'/>
            <Picker.Item label='Learning & Development' value='Learning & Development'/>
            <Picker.Item label='Entertainment' value='Entertainment'/>
            <Picker.Item label='Health & Wellness' value='Health & Wellness'/>
          </Picker>
        </View>

        {/* edit image */}
        <Text style={tw`text-xl font-bold mb-2`}>Post Image</Text>
        <TouchableOpacity onPress={handleImagePick} style={tw`items-center mb-4`}>
          <View style={tw`w-full bg-gray-300 py-10 rounded-md`}>
            {imageUri? (
              <Image source={{ uri: imageUri}} style={tw`w-full h-48 rounded-md`}/>
            ) : existingImageUrl? (
                <Image source={{ uri: existingImageUrl}} style={tw`w-full h-48 rounded-md`}/>
            ) : (
              <Text style={tw`text-gray-500 text-center`}>Tap to change the image</Text>
            )
            }
          </View>
        </TouchableOpacity>

        {/* write the post */}
        <Text style={tw`text-xl font-bold mb-2`}>Main Content</Text>
        <TextInput
          style={tw`bg-white px-4 py-4 rounded-md mb-4 h-32`}
          placeholder='Content'
          value={content}
          onChangeText={(text) => setContent(text)}
          multiline
        />

        <CustomButton
          title= 'Update Post'
          handlePress={handleUpdatePost}
          containerStyles='bg-secondary-100 px-30 mt-5 rounded-xl min-h-[62px] justify-center items-center'
          textStyles='text-primary font-bold text-lg'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default EditPost