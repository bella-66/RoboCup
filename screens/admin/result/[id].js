import {
  View,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";
import moment from "moment";

const ResultOne = ({ route, navigation }) => {
  const { id_timeline, druh_operacie } = route.params;
  const [info, setInfo] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData()
      .catch(() => {
        Alert.alert("Oops!", "Something went wrong.");
      })
      .finally(() => setRefreshing(false));
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/vysledky/${id_timeline}`);
      setInfo(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("EditResult", {
      id_timeline: info.id_timeline,
      datum_zapisu: info.datum_zapisu,
      id_zapisujuca_osoba: info.id_zapisujuca_osoba,
      vysledok_1: info.vysledok_1,
      vysledok_2: info.vysledok_2,
      tim1: info.tim1,
      tim2: info.tim2,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/vysledky/${id_timeline}`)
      .then(() => {
        Toast.show("Result deleted successfully!", Toast.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: druh_operacie,
      headerTitleStyle: { fontSize: 17 },
      headerStyle: {
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["blue"]}
          tintColor={"blue"}
        />
      }
    >
      <View className="bg-white flex-1 items-center">
        <View className="w-11/12 space-y-10 mt-6">
          <View className="bg-white rounded-md p-5 w-full space-y-1">
            <Text>
              <Text className="font-semibold">ID Timeline:</Text>{" "}
              {info.id_timeline}
            </Text>
            <Text>
              <Text className="font-semibold">Type:</Text> {info.druh_operacie}
            </Text>
            <Text>
              <Text className="font-semibold">Competition name:</Text>{" "}
              {info.nazov}
            </Text>
            <Text>
              <Text className="font-semibold">Date:</Text>{" "}
              {moment(info.datum_a_cas || new Date()).format("D/M/yyyy")}
              {" · "}
              {moment(info.datum_a_cas || new Date()).format("H:mm")}
            </Text>
            <Text>
              <Text className="font-semibold">Date of entry:</Text>{" "}
              {moment(info.datum_zapisu || new Date()).format("D/M/yyyy")}
              {" · "}
              {moment(info.datum_zapisu || new Date()).format("H:mm")}
            </Text>
            <Text>
              <Text className="font-semibold">Result:</Text>{" "}
              {info.druh_operacie === "Match" ? (
                <Text>
                  <Text>{info.tim1} </Text>
                  <Text> {info.vysledok_1} : </Text>
                  {info.tim2 && (
                    <Text>
                      {info.vysledok_2} <Text> {info.tim2}</Text>
                    </Text>
                  )}
                </Text>
              ) : (
                <Text>
                  <Text>
                    {info.tim1} · <Text>{info.vysledok_1}</Text>
                  </Text>
                  {info.tim2 && (
                    <Text>
                      {info.tim2} · <Text>{info.vysledok_2}</Text>
                    </Text>
                  )}
                </Text>
              )}
            </Text>
          </View>

          <View className="items-center">
            <View className="flex-row justify-center space-x-3 w-full">
              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-green-500 rounded-md shadow-green-600"
                onPress={handleEdit}
                activeOpacity={0.5}
              >
                <Text className="font-bold text-white text-center">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-red-500 rounded-md shadow-red-600"
                onPress={handleDelete}
                activeOpacity={0.5}
              >
                <Text className="font-bold text-white text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default ResultOne;
