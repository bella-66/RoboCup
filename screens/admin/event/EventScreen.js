import { View, FlatList, Alert, RefreshControl } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { BASE_URL } from "../../../url";
import Icon from "react-native-vector-icons/Ionicons";
import axios from "axios";
import { ListItem } from "@rneui/themed";
import { format } from "date-fns";

const EventScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/all`);
      setData(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Events",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
      headerRight: () => (
        <Icon
          name="add-outline"
          size={30}
          onPress={() => {
            navigation.navigate("AddEvent");
          }}
          style={{ marginRight: 10 }}
        />
      ),
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshing(false);
      });
  };

  return (
    <View className="bg-white flex-1">
      <FlatList
        data={data}
        renderItem={({ item, index, separators }) => (
          <ListItem
            containerStyle={{ backgroundColor: "transparent" }}
            key={item.id_event}
            onPress={() =>
              navigation.navigate("EventOne", {
                id_event: item.id_event,
                nazov: item.nazov,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.nazov}</ListItem.Title>
              <ListItem.Subtitle style={{ color: "#4b5563" }}>
                {format(new Date(item.datum_od || new Date()), "dd/MM/yyyy")} ·{" "}
                {format(new Date(item.datum_do || new Date()), "dd/MM/yyyy")}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="black" size={25} />
          </ListItem>
        )}
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

export default EventScreen;
