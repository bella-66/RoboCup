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
import Icon from "react-native-vector-icons/Ionicons";

const CompetitionOne = ({ route, navigation }) => {
  const { id_sutaz, nazov } = route.params;
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
      const { data } = await axios.get(
        `${BASE_URL}/competition/admin/${id_sutaz}`
      );
      setInfo(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddCompetition", {
      id_sutaz: info.id_sutaz,
      nazov: info.nazov,
      charakteristika: info.charakteristika,
      id_hlavny_rozhodca: info.id_hlavny_rozhodca,
      postupova_kvota: info.postupova_kvota,
      edit: true,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/competition/${id_sutaz}`)
      .then(() => {
        Toast.show("Competition deleted successfully!", Toast.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: nazov,
      headerTitleStyle: { fontSize: 17 },
      headerStyle: {
        backgroundColor: "#fff7ed",
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
          colors={["orange"]}
          tintColor={"orange"}
        />
      }
    >
      <View className="bg-orange-50 flex-1 items-center">
        <View className="w-11/12 space-y-10 mt-6">
          <View className="bg-orange-50 rounded-md p-5 w-full space-y-1">
            <Text>
              <Text className="font-semibold">ID:</Text> {info.id_sutaz}
            </Text>
            <Text>
              <Text className="font-semibold">Name:</Text> {info.nazov}
            </Text>
            <Text>
              <Text className="font-semibold">Description:</Text>{" "}
              {info.charakteristika}
            </Text>
            <Text>
              <Text className="font-semibold">Main referee:</Text> {info.meno}{" "}
              {info.priezvisko}
            </Text>
            <Text>
              <Text className="font-semibold">Advancement quota:</Text>{" "}
              {info.postupova_kvota}
            </Text>
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              className="flex-row items-center"
              onPress={() => {
                navigation.navigate("AddCompToTeam", {
                  id_sutaz: info.id_sutaz,
                });
              }}
            >
              <Icon name="add-circle" size={24} color={"#fb923c"} />
              <Text className="text-orange-400 text-lg ml-1">
                Add team to competition
              </Text>
            </TouchableOpacity>
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

export default CompetitionOne;