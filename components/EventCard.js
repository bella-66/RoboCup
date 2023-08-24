import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const EventCard = ({
  id_event,
  nazov,
  datum_od,
  datum_do,
  charakteristika,
  druh,
  stat,
  organizaciaNazov,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() =>
        navigation.navigate("Event", {
          id_event,
          nazov,
          datum_od,
          datum_do,
          charakteristika,
          druh,
          stat,
          organizaciaNazov,
        })
      }
      className="items-center mx-5 rounded-xl"
    >
      <View className="py-5 w-full flex-row items-center">
        <View className="flex-1">
          <Text className="text-xl font-semibold">{nazov}</Text>
          <Text className="text-blue-400">
            {moment(datum_od).format("D MMM, yyyy")} ·{" "}
            {moment(datum_do).format("D MMM, yyyy")}
          </Text>
        </View>
        <View>
          <Icon name="chevron-forward" size={25} color="#60a5fa" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default EventCard;
