// Create and add blog post to the platform
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as ImagePicker from 'expo-image-picker'
import { Picker } from '@react-native-picker/picker'
import { FIREBASE_AUTH , FIREBASE_DB, FIREBASE_SR } from '@/firebaseConfig'
import { addDoc, collection, doc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, getStorage } from 'firebase/storage'
import CustomButton from '@/components/CustomButton'

import tw from '../../twrnc-config'

const Create = () => {
  // states to hold data for the posts
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const auth = FIREBASE_AUTH;
  const storage = getStorage();

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

  // handle saving posts
  const handlePost = async () => {
    try {
      if (!title || !content || !category){
        Alert.alert('Validation Error', 'Please fill in all the fields.');
        return;
      }

      const user = auth.currentUser;
      if (user){
        // upload post image to storage
        let imageUrl = '';
        if (imageUri){
          const imageRef = ref(storage, `posts/${user.uid}/${Date.now()}`);
          const response = await fetch(imageUri);
          const blob = await response.blob();
          await uploadBytes(imageRef, blob);
          imageUrl = await getDownloadURL(imageRef);
        }

        // create a subcollection under the user
        const userPostsCollRef = collection(FIREBASE_DB, 'users', user.uid, 'posts');
        await addDoc(userPostsCollRef, {
          title,
          category,
          content,
          imageUrl,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        
        Alert.alert('Success', 'Your post has been created!');
        setTitle('');
        setCategory('');
        setContent('');
        setImageUri(null);
      }
    } catch (error) {
      console.error('Error creating post: ', error);
      Alert.alert('Error', 'An error occured while creating your post.');
    }
  };

  return (
    <SafeAreaView style={tw`bg-purple-200 h-full`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        <Text style={tw`text-3xl font-bold mb-4`}>
          Create Post
        </Text>

        {/* add title to post */}
        <Text style={tw`text-xl font-bold mb-2`}>Post Title</Text>
        <TextInput
          style={tw`bg-white px-4 py-4 rounded-md mb-4`}
          placeholder='Title'
          value={title}
          onChangeText={(text) => setTitle(text)}
        />

        {/* choose category */}
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

        {/* add image to post */}
        <Text style={tw`text-xl font-bold mb-2`}>Post Image</Text>
        <TouchableOpacity onPress={handleImagePick} style={tw`items-center mb-4`}>
          <View style={tw`w-full bg-gray-300 py-10 rounded-md`}>
            {imageUri? (
              <Image source={{ uri: imageUri}} style={tw`w-full h-48 rounded-md`}/>
            ) : (
              <Text style={tw`text-gray-500 text-center`}>Tap to add an image</Text>
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
          title= 'Publish Post'
          handlePress={handlePost}
          containerStyles='bg-secondary-100 px-30 mt-5 rounded-xl min-h-[62px] justify-center items-center'
          textStyles='text-primary font-bold text-lg'
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Create