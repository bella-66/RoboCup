import { View, Text } from "react-native";
import React from "react";

const ProfileInfo = ({ title, info, onClick }) => {
  return (
    <View className="flex-row items-center justify-between mb-4">
      <View className="">
        <Text className="text-lg font-medium">{title}</Text>
        <Text className="text-secondary">{info}</Text>
      </View>
    </View>
  );
};

export default ProfileInfo;
