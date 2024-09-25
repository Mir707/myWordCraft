import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const PostLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* If you have an index screen */}
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="view-post" />
      <Stack.Screen name="edit-post" />
    </Stack>
  )
}

export default PostLayout