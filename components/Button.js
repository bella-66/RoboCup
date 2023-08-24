import { Text, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ text, onPress, type }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={onPress}
      className="w-full shadow-xl px-2 py-3 bg-blue-500 rounded-md shadow-blue-700"
    >
      <Text className="text-center text-white font-bold">{text}</Text>
    </TouchableOpacity>
  );
};

export default Button;
