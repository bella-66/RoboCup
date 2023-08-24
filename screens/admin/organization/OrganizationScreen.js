import { View, FlatList, Alert, RefreshControl } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Icon from "react-native-vector-icons/Ionicons";
import { ListItem } from "@rneui/base";

const OrganizationScreen = ({ navigation }) => {
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/organization`);
      setData(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [data, setData] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Organizations",
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
            navigation.navigate("AddOrganization");
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
            key={item.id_organizacia}
            onPress={() =>
              navigation.navigate("OrganizationOne", {
                id_organizacia: item.id_organizacia,
                nazov: item.nazov,
              })
            }
          >
            <ListItem.Content>
              <ListItem.Title>{item.nazov}</ListItem.Title>
              <ListItem.Subtitle style={{ color: "#4b5563" }}>
                {item.stat} · {item.druh}
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

export default OrganizationScreen;
