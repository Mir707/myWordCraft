// information of the user
import { View, Text, Image } from 'react-native'
import React from 'react'
import tw from '../twrnc-config'

interface ProfileItemProps {
    icon: React.ReactNode;
    value: string;
}

const ProfileItem: React.FC<ProfileItemProps> = ({ icon, value }) => {
  return (
    <View style={tw`flex-row bg-gray-300 p-4 rounded-xl mb-4 items-center w-[90%] self-center`}>
        {/* icon on the left */}
        <View style={tw`mr-4`}>{icon}</View>

        {/* display user info */}
        <Text style={tw`text-primary text-lg font-semibold flex-1`}>{value || 'N/A'}</Text>
    </View>
  )
}

export default ProfileItem