import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BASE_URL } from "../url";
import axios from "axios";
import ResultListItem from "../components/ResultListItem";

const UserTeamComps = ({ route, navigation }) => {
  const { id_tim } = route.params;
  const [refreshing, setRefreshing] = useState(false);
  const [sutaze, setSutaze] = useState([]);

  const fetchSutaze = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/vysledky/userTeamComps/${id_tim}`
      );
      setSutaze(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

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

export default UserTeamComps;
