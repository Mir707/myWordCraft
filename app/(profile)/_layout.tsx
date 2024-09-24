import { View, Text } from 'react-native'
import { Stack, Tabs } from 'expo-router'
import React from 'react'
import { StatusBar } from 'expo-status-bar'

const ProfileLayout = () => {
    return (
        <>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Stack.Screen name="edit-profile" />
                <Stack.Screen name="profile-info" />
            </Stack>

            {/* <StatusBar backgroundColor='#161622' style='light'/>  */}
        </>
    )
}

export default ProfileLayout