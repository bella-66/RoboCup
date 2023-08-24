import { View, FlatList, Alert, RefreshControl } from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from "@rneui/base";
import moment from "moment";

const ResultScreen = ({ navigation }) => {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/vysledky`);
      setData(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Results",
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
            navigation.navigate("AddResultAdmin");
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
            key={item.id_timeline}
            onPress={() =>
              navigation.navigate("ResultOne", {
                id_timeline: item.id_timeline,
                druh_operacie: item.druh_operacie,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.nazov}</ListItem.Title>
              <ListItem.Subtitle style={{ color: "#4b5563" }}>
                {item.druh_operacie} · {item.tim1}
                {item.tim2 && " | " + item.tim2} ·{" "}
                {moment(item.datum_a_cas).format("D/M/yyyy")}{" "}
                {moment(item.datum_a_cas).format("H:mm")}
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

export default ResultScreen;
