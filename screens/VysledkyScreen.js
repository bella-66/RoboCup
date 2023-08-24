import {
  View,
  Text,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../url";
import useAuth from "../context/AuthContext";
import { FAB } from "@rneui/themed";

const VysledkyScreen = ({ navigation }) => {
  const { userInfo } = useAuth();
  const [sutaze, setSutaze] = useState([]);

  const fetchSutaze = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/vysledky/resultsByComp`);
      setSutaze(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSutaze()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshing(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Results",
      headerShown: true,
      headerTitleAlign: "center",
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
    fetchSutaze();
  }, []);

  return (
    <View className="flex-1 bg-[#EFF2F5]">
      {sutaze.length === 0 && (
        <Text className="text-center mt-10 font-semibold text-[16px]">
          Nothing to show!
        </Text>
      )}
      {userInfo.rola === "Referee" && (
        <View className="absolute bottom-3 right-3 z-50">
          <FAB
            onPress={() => {
              navigation.navigate("AddResult");
            }}
            icon={{ name: "add", color: "#fff7ed" }}
            color="#3b82f6"
          />
        </View>
      )}
      <FlatList
        className="mt-4"
        data={sutaze}
        renderItem={({ item, index, separators }) => {
          return (
            <TouchableOpacity
              activeOpacity={0.5}
              className="items-center"
              onPress={() =>
                navigation.navigate("ListComps", {
                  id_sutaz: item.id_sutaz,
                  nazov: item.nazov,
                })
              }
              key={item.id_sutaz}
            >
              <View className="bg-blue-400 mb-5 py-5 px-4 w-4/5 items-center rounded-lg">
                <Text className="text-lg">{item.nazov}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["blue"]}
            tintColor={"blue"}
          />
        }
      />
    </View>
  );
};

export default VysledkyScreen;
