import { View, Text, RefreshControl, FlatList, Alert } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { Divider, FAB } from "@rneui/themed";
import useAuth from "../../context/AuthContext";
import { BASE_URL } from "../../url";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const ListCompsScreen = ({ navigation, route }) => {
  const { userInfo } = useAuth();
  const [vysledky, setVysledky] = useState([]);
  const { id_sutaz, nazov } = route.params;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchVysledky()
      .catch(() => Alert.alert("Oops!", "Something went wrong."))
      .finally(() => {
        setRefreshing(false);
      });
  };

  const fetchVysledky = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/${id_sutaz}`);
      setVysledky(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: nazov,
      headerShown: true,
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
      {(userInfo.rola === "Referee" || userInfo.rola === "Main Referee") && (
        <View className="absolute bottom-3 right-3 z-50">
          <FAB
            onPress={() => {
              navigation.navigate("AddResult", { id_sutaz });
            }}
            icon={{ name: "add", color: "#fff7ed" }}
            color="#fb923c"
          />
        </View>
      )}

      <FlatList
        className="mt-1"
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

                {(userInfo.rola === "Referee" ||
                  userInfo.rola === "Main Referee") && (
                  <View>
                    <Icon
                      name="create-outline"
                      size={27}
                      color={"#fb923c"}
                      onPress={() =>
                        navigation.navigate("EditResult", {
                          id_timeline: item.id_timeline,
                          datum_zapisu: item.datum_zapisu,
                          id_zapisujuca_osoba: item.id_zapisujuca_osoba,
                          vysledok_1: item.vysledok_1,
                          vysledok_2: item.vysledok_2,
                          tim1: item.tim1,
                          tim2: item.tim2,
                        })
                      }
                    />
                  </View>
                )}
              </View>
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

export default ListCompsScreen;
