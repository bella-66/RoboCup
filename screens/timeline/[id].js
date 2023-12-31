import { View, Text, Alert } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../url";
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const Timeline = ({ route, navigation }) => {
  const { id_timeline } = route.params;
  const [timeline, setTimeline] = useState([]);

  const fetchTimelineById = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/timeline/admin/${id_timeline}`
      );
      setTimeline(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

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

  useEffect(() => {
    fetchTimelineById();
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

      <View className="space-y-12 bg-white h-full w-full p-5 rounded-t-3xl z-50 mt-32">
        <Text className="text-2xl mt-3 font-semibold text-center">
          {timeline.nazov}
        </Text>

        <View className="space-y-6">
          <Text className="text-lg font-semibold mt-1">
            {timeline.druh_operacie}
          </Text>

          <View className="space-y-3">
            <View className="flex-row items-center">
              <View className="bg-iconBackground rounded-xl mr-3">
                <Icon
                  name="calendar"
                  size={21}
                  style={{ padding: 6 }}
                  color="#3b82f6"
                />
              </View>
              <Text className="text-lg text-secondaryText">
                {moment(timeline.datum_a_cas).format("D MMM yyyy")}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-iconBackground rounded-xl mr-3">
                <Icon
                  name="time"
                  size={21}
                  style={{ padding: 6 }}
                  color="#3b82f6"
                />
              </View>
              <Text className="text-lg text-secondaryText">
                {moment(timeline.datum_a_cas).format("H:mm")}
              </Text>
            </View>

            {timeline.druh_operacie !== "Results announcement" &&
              timeline.druh_operacie !== "Meeting" && (
                <View>
                  <View className="flex-row items-center">
                    <View className="bg-iconBackground rounded-xl mr-3">
                      <Icon
                        name="people"
                        size={21}
                        style={{ padding: 6 }}
                        color="#3b82f6"
                      />
                    </View>
                    {timeline.tim2 ? (
                      <Text className="text-[16px] text-secondaryText">
                        {timeline.tim1} | {timeline.tim2}
                      </Text>
                    ) : (
                      <Text className="text-[16px] text-secondaryText">
                        {timeline.tim1}
                      </Text>
                    )}
                  </View>
                </View>
              )}
          </View>
        </View>
        <View className="space-y-5">
          <View>
            <Text className="text-lg font-semibold">Advancement quota</Text>
            <Text className="text-[16px] text-secondaryText">
              {timeline.postupova_kvota}
            </Text>
          </View>

          <View>
            <Text className="text-lg font-semibold">About</Text>
            <Text className="text-[16px] text-secondaryText">
              {timeline.charakteristika}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Timeline;
