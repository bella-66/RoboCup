import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";

const OrganizationOne = ({ route, navigation }) => {
  const { id_organizacia, nazov } = route.params;
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
        `${BASE_URL}/organization/admin/${id_organizacia}`
      );
      setInfo(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddOrganization", {
      id_organizacia: info.id_organizacia,
      druh: info.druh,
      nazov: info.nazov,
      ulica: info.ulica,
      stat: info.stat,
      psc: info.psc,
      edit: true,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/organization/${id_organizacia}`)
      .then(() => {
        Toast.show("Organization deleted successfully!", Toast.SHORT);
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
              <Text className="font-semibold">ID:</Text> {info.id_organizacia}
            </Text>
            <Text>
              <Text className="font-semibold">Name:</Text> {info.nazov}
            </Text>
            <Text>
              <Text className="font-semibold">Type:</Text> {info.druh}
            </Text>
            <Text>
              <Text className="font-semibold">State:</Text> {info.stat}
            </Text>
            <Text>
              <Text className="font-semibold">Street:</Text> {info.ulica}
            </Text>
            <Text>
              <Text className="font-semibold">Zip code:</Text> {info.psc}
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

export default OrganizationOne;
