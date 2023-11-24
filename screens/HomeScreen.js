import React, { useEffect, useLayoutEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import axios from "axios";
import { Alert, ScrollView, Text, RefreshControl, View } from "react-native";
import { BASE_URL } from "../url";
import useAuth from "../context/AuthContext";
import { StatusBar } from "expo-status-bar";
import { Agenda } from "react-native-calendars";
import { FloatingAction } from "react-native-floating-action";
import Icon from "react-native-vector-icons/Ionicons";

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [timeline, setTimeline] = useState([]);

  const { userInfo } = useAuth();

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchApi()
      .then(() => {
        format();
      })
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => setRefreshing(false));
  };

  const fetchApi = async () => {
    await axios
      .get(BASE_URL)
      .then(({ data }) => {
        setTimeline(data);
      })
      .catch((error) => Alert.alert("Oops!", "Something went wrong."));
  };

  const renderItem = (item) => {
    return (
      <DashboardCard
        key={item.id_timeline}
        id_timeline={item.id_timeline}
        date={item.datum_a_cas}
        druh={item.druh_operacie}
        sutaz={item.nazov}
        tim1={item.tim1}
        tim2={item.tim2}
      />
    );
  };

  const format = () => {
    const items = {};
    timeline.forEach((e) => {
      const strTime = timeToString(e.datum_a_cas);
      if (!items[strTime]) {
        items[strTime] = [];
      }
    });

    timeline.forEach((e) => {
      const strTime = timeToString(e.datum_a_cas);
      items[strTime].push({
        druh_operacie: e.druh_operacie,
        datum_a_cas: e.datum_a_cas,
        id_timeline: e.id_timeline,
        nazov: e.nazov,
        tim1: e.tim1,
        tim2: e.tim2,
      });
    });

    const newItems = {};
    Object.keys(items).forEach((key) => {
      newItems[key] = items[key];
    });
    return newItems;
  };

  useEffect(() => {
    fetchApi();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Timeline",
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

  return (
    <View className="flex-1 bg-white">
      <StatusBar backgroundColor={"transparent"} translucent style="dark" />
      {userInfo?.rola === "Referee" && (
        <>
          <View className="absolute bottom-3 right-3 z-50">
            <FloatingAction
              color="#3b82f6"
              distanceToEdge={1}
              actionsPaddingTopBottom={3}
              actions={[
                {
                  text: "Competition",
                  icon: (
                    <Icon
                      name="add-outline"
                      size={30}
                      color="#fff7ed"
                      onPress={() => navigation.navigate("AddSutaz")}
                    />
                  ),
                  name: "bt_competition",
                  position: 2,
                  color: "#388ef9",
                  buttonSize: 45,
                },
                {
                  text: "Timeline",
                  buttonSize: 45,
                  icon: (
                    <Icon
                      name="add-outline"
                      size={30}
                      color="#fff7ed"
                      onPress={() => navigation.navigate("AddTimeline")}
                    />
                  ),
                  name: "bt_timeline",
                  position: 1,
                  color: "#388ef9",
                },
              ]}
            />
          </View>
        </>
      )}
      <Agenda
        selected={new Date()}
        markingType={"dot"}
        items={format()}
        renderItem={renderItem}
        pastScrollRange={2}
        futureScrollRange={4}
        showClosingKnob={true}
        // enableSwipeMonths={true}
        showOnlySelectedDayItems={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["blue"]}
            tintColor={"blue"}
          />
        }
        renderEmptyDate={() => {
          return (
            <View className="flex-1 items-center justify-center">
              <Text>No Competitions Today!</Text>
            </View>
          );
        }}
        renderEmptyData={() => {
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
              contentContainerStyle={{
                justifyContent: "center",
                flex: 1,
                alignItems: "center",
              }}
            >
              <View>
                <Text>No Competitions Today!</Text>
              </View>
            </ScrollView>
          );
        }}
        theme={{
          agendaDayTextColor: "black",
          agendaDayNumColor: "black",
          calendarBackground: "white",
          reservationsBackgroundColor: "white",
          agendaTodayColor: "#60a5fa",
          agendaKnobColor: "#60a5fa",
          selectedDayBackgroundColor: "#60a5fa",
          dotColor: "#60a5fa",
          todayTextColor: "#60a5fa",
        }}
      />
    </View>
  );
};

export default HomeScreen;
