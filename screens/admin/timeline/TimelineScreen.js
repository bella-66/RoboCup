import { View, Alert, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from "@rneui/themed";
import moment from "moment";

const TimelineScreen = ({ navigation }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/timeline/admin`);
      setData(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Timeline",
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor: "#fff7ed",
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
            navigation.navigate("AddTimelineAdmin");
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
    <View className="bg-orange-50 flex-1">
      <FlatList
        data={data}
        renderItem={({ item, index, separators }) => (
          <ListItem
            containerStyle={{ backgroundColor: "transparent" }}
            key={item.id_timeline}
            onPress={() =>
              navigation.navigate("TimelineOne", {
                id_timeline: item.id_timeline,
                druh_operacie: item.druh_operacie,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.druh_operacie}</ListItem.Title>
              <ListItem.Subtitle style={{ color: "#4b5563" }}>
                {item.nazov} · {moment(item.datum_a_cas).format("D/M/yyyy")}{" "}
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
            colors={["orange"]}
            tintColor={"orange"}
          />
        }
      />
    </View>
  );
};

export default TimelineScreen;
