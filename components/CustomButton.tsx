import React from 'react';
import { TouchableOpacity, Text, GestureResponderEvent } from 'react-native';
import tw from '../twrnc-config';

interface CustomButtonProps {
  title: string;
  handlePress?: (event: GestureResponderEvent) => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const CustomButton = ({
  title,
  handlePress,
  containerStyles = '',
  textStyles = '',
  isLoading = false,
  icon,
}: CustomButtonProps) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      // Apply both the default styles and the additional containerStyles
      style={[
        tw`bg-secondary-100 rounded-xl min-h-[62px] justify-center items-center`,
        containerStyles ? tw`${containerStyles}` : null, // Ensure that containerStyles are appended
        isLoading && tw`opacity-50`,
      ]}
      disabled={isLoading}
    >
      {icon && <>{icon}</>}
      <Text style={[tw`text-primary font-semibold text-lg`, textStyles ? tw`${textStyles}` : null]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
