import { View, Text, RefreshControl, FlatList, Alert } from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { BASE_URL } from "../url";
import axios from "axios";
import { Divider } from "@rneui/themed";
import moment from "moment";

const ResultByTeamScreen = ({ route, navigation }) => {
  const { id_tim, id_sutaz, nazov } = route.params;
  const [vysledky, setVysledky] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVysledky = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/vysledky/byteam`, {
        id_tim,
        id_sutaz,
      });
      setVysledky(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVysledky()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshing(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: nazov,
      headerStyle: {
        backgroundColor: "#fff7ed",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
    });
  }, []);

  useEffect(() => {
    fetchVysledky();
  }, []);

  return (
    <View className="flex-1 bg-orange-50">
      {vysledky.length === 0 && (
        <Text className="text-center mt-10 font-semibold text-[16px]">
          Nothing to show!
        </Text>
      )}
      <FlatList
        className="mt-4"
        data={vysledky}
        renderItem={({ item, index, separators }) => {
          return (
            <View>
              <View className="my-3 mx-5 p-1 flex-row items-center">
                <View className="flex-1">
                  <View>
                    {item.druh_operacie === "Match" ? (
                      <Text className="text-lg">
                        <Text>
                          <Text>{item.tim1}</Text>
                          <Text className="font-semibold">
                            {"  "}
                            {item.vysledok_1} :{" "}
                          </Text>
                          {item.tim2 && (
                            <Text className="font-semibold">
                              {item.vysledok_2}
                              {"  "}
                              <Text className="font-normal">{item.tim2}</Text>
                            </Text>
                          )}
                        </Text>
                      </Text>
                    ) : (
                      <Text className="text-lg">
                        <Text>
                          {item.tim1} ·{" "}
                          <Text className="font-semibold">
                            {item.vysledok_1}
                          </Text>
                        </Text>
                        {item.tim2 && (
                          <Text>
                            {item.tim2} -{" "}
                            <Text className="font-semibold">
                              {item.vysledok_2}
                            </Text>
                          </Text>
                        )}
                      </Text>
                    )}
                  </View>

                  <View>
                    <Text className="text-[15px] text-gray-600">
                      {moment(item.datum_a_cas).format("D/M/yyyy")} ·{" "}
                      {moment(item.datum_a_cas).format("H:mm")}
                    </Text>
                  </View>
                </View>
              </View>

              <Divider />
            </View>
          );
        }}
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

export default ResultByTeamScreen;
