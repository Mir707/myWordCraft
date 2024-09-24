import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const PostLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="view-post"
          options= {{
            headerShown: false
          }}
        />
      </Stack>

      {/* <StatusBar backgroundColor='#161622' style='light'/>  */}
    </>
  )
}

export default PostLayout