import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const DashboardCard = ({ date, druh, sutaz, tim1, tim2, id_timeline }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Timeline", { id_timeline })}
      className="bg-blue-400 py-1 px-6 h-32 my-4 mx-5 rounded-md flex-row items-center space-x-5"
      activeOpacity={0.5}
    >
      <View className="justify-around flex-1 h-full">
        <View className="">
          <View className="flex-row items-center">
            <Text className="font-semibold text-[17px] ">{druh}</Text>
          </View>
          <Text>{sutaz}</Text>
        </View>

        <View className="flex-row items-center ">
          <View className="flex-1">
            {tim2 ? (
              <Text>
                {tim1} | {tim2}
              </Text>
            ) : (
              <Text>{tim1}</Text>
            )}
          </View>
          <View>
            <Text className="text-gray-600 font-medium">
              {moment(date).format("H:mm")}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DashboardCard;
