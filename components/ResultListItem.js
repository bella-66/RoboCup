import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const ResultListItem = ({ id_sutaz, nazov }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      activeOpacity={0.5}
      className="items-center justify-center mx-5 rounded-xl"
      onPress={() =>
        navigation.navigate("ListComps", {
          id_sutaz,
          nazov,
        })
      }
      key={id_sutaz}
    >
      {/* <View className="py-5 px-4 items-center">
                <Text className="text-lg">{nazov}</Text>
              </View> */}
      <View className="py-5 w-full flex-row items-center">
        <View className="flex-1">
          <Text className="text-xl font-medium">{nazov}</Text>
        </View>
        <View>
          <Icon name="chevron-forward" size={25} color="#60a5fa" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ResultListItem;
