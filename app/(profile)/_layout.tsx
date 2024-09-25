import { Stack } from 'expo-router';
import React from 'react';

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* If you have an index screen */}
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="profile-info" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
};

export default ProfileLayout;
