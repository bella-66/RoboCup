import { View, Text } from "react-native";
import React, { useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const Event = ({ route, navigation }) => {
  const {
    id_event,
    nazov,
    datum_od,
    datum_do,
    charakteristika,
    druh,
    stat,
    organizaciaNazov,
  } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
      headerTitle: "",
      headerTransparent: true,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="w-full h-52 absolute top-0 left-0">
        <LinearGradient
          colors={["#385bff", "#01BFFD"]}
          style={{ width: "100%", height: "100%" }}
          start={{ x: 0.85, y: 0 }}
        />
      </View>
      <View className="bg-white h-full w-full p-5 rounded-t-3xl z-50 mt-32">
        <Text className="text-[28px] font-semibold mt-4 text-center">
          {nazov}
        </Text>

        <View className="flex-row items-center mt-16 mb-14">
          <View className="bg-iconBackground rounded-xl">
            <Icon
              name="calendar"
              size={27}
              style={{ padding: 7.5 }}
              color="#3b82f6"
            />
          </View>
          <View className="flex-row items-center flex-1 justify-evenly">
            <View>
              <Text className="text-lg font-semibold">From</Text>
              <Text className="text-[16px] text-secondaryText">
                {moment(datum_od).format("D MMM, yyyy")}
              </Text>
            </View>
            <View>
              <Text className="text-lg font-semibold">To</Text>
              <Text className="text-[16px] text-secondaryText">
                {moment(datum_do).format("D MMM, yyyy")}
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-semibold">About</Text>
          <Text className="text-[16px] text-secondaryText">
            {charakteristika}
          </Text>
        </View>

        <View className="mt-2">
          <Text className="text-lg font-semibold">Event organizer</Text>
          <Text className="text-[16px] text-secondaryText">
            {organizaciaNazov} | {stat}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Event;
