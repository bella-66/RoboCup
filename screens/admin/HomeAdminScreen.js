import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../url";
import useAuth from "../../context/AuthContext";
import { StatusBar } from "expo-status-bar";

const HomeAdminScreen = ({ navigation }) => {
  const fetch = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/team/number`);
      setNOTeams(data[0]?.numberOfTeams);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchOsoba = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/osoba/number`);
      setNOOsoba(data[0]?.numberOfOsoba);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchNOComps = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/competition/number`);
      setNOComps(data[0]?.numberOfComps);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchNOEvents = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/number`);
      setNOEvents(data[0]?.numberOfEvents);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [nOTeams, setNOTeams] = useState(0);
  const [nOOsoba, setNOOsoba] = useState(0);
  const [nOComps, setNOComps] = useState(0);
  const [nOEvents, setNOEvents] = useState(0);
  const { userInfo } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetch(), fetchNOEvents(), fetchNOComps(), fetchOsoba()])
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshing(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Dashboard",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#60a5fa",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
    });
  }, []);

  useEffect(() => {
    fetch();
    fetchOsoba();
    fetchNOComps();
    fetchNOEvents();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{ flex: 1 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["blue"]}
          tintColor={"blue"}
        />
      }
    >
      <View className="bg-blue-400 flex-1 items-center pt-4">
        <StatusBar backgroundColor={"transparent"} translucent style="dark" />
        <View className="my-7 w-11/12">
          <Text className="font-semibold text-2xl">
            Welcome, {userInfo.meno}!
          </Text>
        </View>

        <View className="flex-row w-full flex-wrap items-start justify-evenly gap-y-8">
          <TouchableOpacity
            className="w-2/5 p-5 justify-center items-center space-y-2 rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            onPress={() => navigation.navigate("Teams")}
            activeOpacity={0.5}
          >
            <Text className="text-lg font-semibold">{nOTeams}</Text>
            <Text className="">Teams</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-2/5 p-5 justify-center items-center space-y-2 rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            onPress={() => navigation.navigate("Osoba")}
            activeOpacity={0.5}
          >
            <Text className="text-lg font-semibold">{nOOsoba}</Text>
            <Text className="">Competitors</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-2/5 p-5 justify-center items-center space-y-2 rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            onPress={() => navigation.navigate("Competitions")}
            activeOpacity={0.5}
          >
            <Text className="text-lg font-semibold">{nOComps}</Text>
            <Text className="">Competitions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="w-2/5 p-5 justify-center items-center space-y-2 rounded-xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.6)" }}
            onPress={() => navigation.navigate("Events")}
            activeOpacity={0.5}
          >
            <Text className="text-lg font-semibold">{nOEvents}</Text>
            <Text className="">Events</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default HomeAdminScreen;
