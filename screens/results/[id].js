import { View, Text, Alert } from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "../../url";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import useAuth from "../../context/AuthContext";

const Result = ({ route, navigation }) => {
  const { id_timeline } = route.params;
  const [result, setResult] = useState([]);
  const { userInfo } = useAuth();

  const fetchResultById = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/vysledky/${id_timeline}`);
      setResult(data[0]);
    } catch (e) {
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
      headerRight: () =>
        userInfo.rola === "Referee" && (
          <Icon
            name="create-outline"
            onPress={() =>
              navigation.navigate("EditResult", {
                id_timeline: result.id_timeline,
                datum_zapisu: result.datum_zapisu,
                id_zapisujuca_osoba: result.id_zapisujuca_osoba,
                vysledok_1: result.vysledok_1,
                vysledok_2: result.vysledok_2,
                tim1: result.tim1,
                tim2: result.tim2,
              })
            }
            size={27}
          />
        ),
    });
  }, []);

  useEffect(() => {
    fetchResultById();
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <View className="w-full h-48 absolute top-0 left-0">
        <LinearGradient
          colors={["#f97316", "orange"]}
          style={{ width: "100%", height: "100%" }}
          start={{ x: 0.85, y: 0 }}
        />
      </View>

      <View className="bg-orange-50 h-full w-full p-5 rounded-t-3xl z-50 mt-24">
        <View key={result.id_timeline} className="items-center space-y-9 mt-3">
          <Text className="text-3xl font-semibold">{result.druh_operacie}</Text>

          <View className="flex-row items-center justify-between w-4/5">
            <View className="flex-row items-center">
              <View className="bg-orange-100 rounded-xl">
                <Icon
                  name="calendar"
                  size={21}
                  style={{ padding: 6 }}
                  color="#fb923c"
                />
              </View>
              <Text className="text-lg text-gray-600 ml-3">
                {moment(result.datum_a_cas).format("D MMM, yyyy")}
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="bg-orange-100 rounded-xl">
                <Icon
                  name="time"
                  size={21}
                  style={{ padding: 6 }}
                  color="#fb923c"
                />
              </View>
              <Text className="text-lg text-gray-600 ml-3">
                {moment(result.datum_a_cas).format("H:mm")}
              </Text>
            </View>
          </View>

          {result.druh_operacie === "Match" ? (
            <Text className="text-xl">
              <Text>{result.tim1} </Text>
              <Text className="font-semibold"> {result.vysledok_1} : </Text>
              {result.tim2 && (
                <Text className="font-semibold">
                  {result.vysledok_2}{" "}
                  <Text className="font-normal"> {result.tim2}</Text>
                </Text>
              )}
            </Text>
          ) : (
            <Text>
              <Text className="text-xl">
                {result.tim1} -{" "}
                <Text className="font-semibold">{result.vysledok_1}</Text>
              </Text>
              {result.tim2 && (
                <Text className="text-xl">
                  {result.tim2} -{" "}
                  <Text className="font-semibold">{result.vysledok_2}</Text>
                </Text>
              )}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Result;
