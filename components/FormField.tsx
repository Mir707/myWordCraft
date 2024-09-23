import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps, StyleProp, ViewStyle } from 'react-native';
import { icons } from '../constants';
import tw from 'twrnc';


interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false); // State to hide password
  const [isFocused, setIsFocused] = useState(false); // State to track focus

  return (
    <View style={otherStyles ? tw`${otherStyles}` : undefined}>
      <Text style={tw`text-base text-gray-100 font-pmedium`}>{title}</Text>

      <View
        style={tw`w-full h-16 px-4 rounded-2xl flex flex-row items-center 
          ${isFocused ? 'border-yellow-400' : 'border-gray-400'} bg-purple border-2`}
      >
        <TextInput
          style={tw`flex-1 text-white font-psemibold text-base`}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          onFocus={() => setIsFocused(true)} // Set focus state
          onBlur={() => setIsFocused(false)} // Remove focus state
          {...props}
        />

        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={tw`w-6 h-6`}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
