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
import ResultListItem from "../components/ResultListItem";

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
    <View className="flex-1 bg-white">
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
      {sutaze.length === 0 ? (
        <Text className="text-center mt-10 text-medium">
          No results to show!
        </Text>
      ) : (
        <FlatList
          className="mt-4"
          data={sutaze}
          renderItem={({ item, index, separators }) => {
            return (
              <ResultListItem id_sutaz={item.id_sutaz} nazov={item.nazov} />
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
      )}
    </View>
  );
};

export default VysledkyScreen;
