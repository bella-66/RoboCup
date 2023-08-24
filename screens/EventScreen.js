import { View, Text, FlatList, RefreshControl, Alert } from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import axios from "axios";
import { BASE_URL } from "../url";
import { StatusBar } from "expo-status-bar";
import { Tab, TabView } from "@rneui/themed";

const EventScreen = ({ navigation }) => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [index, setIndex] = useState(0);
  const [refreshingUpcoming, setRefreshingUpcoming] = useState(false);
  const [refreshingPast, setRefreshingPast] = useState(false);

  const fetchUpcomingEvents = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event`);
      setUpcomingEvents(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchPastEvents = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/past`);
      setPastEvents(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const onRefreshUpcoming = async () => {
    setRefreshingUpcoming(true);
    await fetchUpcomingEvents()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshingUpcoming(false);
      });
  };

  const onRefreshPast = async () => {
    setRefreshingPast(true);
    await fetchPastEvents()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshingPast(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Events",
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
    fetchUpcomingEvents();
    fetchPastEvents();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor={"transparent"} translucent style="dark" />
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{
          backgroundColor: "#60a5fa",
          height: 3,
        }}
        titleStyle={{ color: "#60a5fa" }}
      >
        <Tab.Item>Upcoming</Tab.Item>
        <Tab.Item>Past</Tab.Item>
      </Tab>

      <TabView value={index} onChange={setIndex} animationType="spring">
        {upcomingEvents.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-center">No upcoming events!</Text>
          </View>
        ) : (
          <TabView.Item style={{ width: "100%" }}>
            <FlatList
              className="mt-4"
              data={upcomingEvents}
              renderItem={({ item, index, separators }) => {
                return (
                  <EventCard
                    id_event={item.id_event}
                    nazov={item.nazov}
                    datum_od={item.datum_od}
                    datum_do={item.datum_do}
                    charakteristika={item.charakteristika}
                    druh={item.druh}
                    stat={item.stat}
                    organizaciaNazov={item.organizaciaNazov}
                  />
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingUpcoming}
                  onRefresh={onRefreshUpcoming}
                  colors={["blue"]}
                  tintColor={"blue"}
                />
              }
            />
          </TabView.Item>
        )}

        {pastEvents.length === 0 ? (
          <View className="items-center justify-center flex-1">
            <Text className="text-center">No past events!</Text>
          </View>
        ) : (
          <TabView.Item style={{ width: "100%" }}>
            <FlatList
              className="mt-4"
              data={pastEvents}
              renderItem={({ item, index, separators }) => {
                return (
                  <EventCard
                    id_event={item.id_event}
                    nazov={item.nazov}
                    datum_od={item.datum_od}
                    datum_do={item.datum_do}
                    charakteristika={item.charakteristika}
                    druh={item.druh}
                    stat={item.stat}
                    organizaciaNazov={item.organizaciaNazov}
                  />
                );
              }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshingPast}
                  onRefresh={onRefreshPast}
                  colors={["blue"]}
                  tintColor={"blue"}
                />
              }
            />
          </TabView.Item>
        )}
      </TabView>
    </View>
  );
};

export default EventScreen;
