import { View, RefreshControl, Alert, FlatList } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import { ListItem } from "@rneui/themed";
import Icon from "react-native-vector-icons/Ionicons";

const OsobaScreen = ({ navigation }) => {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/osoba`);
      setData(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Users",
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
            navigation.navigate("AddOsoba");
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
            key={item.id_osoba}
            onPress={() =>
              navigation.navigate("OsobaOne", {
                id_osoba: item.id_osoba,
                email: item.email,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>
                {item.meno} {item.priezvisko}
              </ListItem.Title>
              <ListItem.Subtitle style={{ color: "#4b5563" }}>
                {item.rola} · {item.email}
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

export default OsobaScreen;
