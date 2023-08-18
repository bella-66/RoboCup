import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../url";
import moment from "moment";
import Toast from "react-native-simple-toast";

const EventOne = ({ route, navigation }) => {
  const { id_event, nazov } = route.params;
  const [info, setInfo] = useState([]);
  const [infoOrganizatori, setInfoOrganizatori] = useState([]);
  const [infoOsoby, setInfoOsoby] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData()
      .catch(() => {
        Alert.alert("Oops!", "Something went wrong.");
      })
      .finally(() => setRefreshing(false));
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/admin/${id_event}`);
      setInfo(data[0][0]);
      let arr = [];
      if (data[1].length !== 0) {
        data[1].map((item) => {
          arr.push({
            id_organizacia: item.id_organizacia,
            druh: item.druh,
            nazov: item.nazov,
            stat: item.stat,
          });
        });
      }
      let arr2 = [];
      if (data[2].length !== 0) {
        data[2].map((item) => {
          arr2.push({
            id_osoba: item.id_osoba,
            meno: item.meno,
            priezvisko: item.priezvisko,
            rola: item.rola,
          });
        });
      }
      setInfoOrganizatori(arr);
      setInfoOsoby(arr2);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddEvent", {
      id_event: info.id_event,
      nazov: info.nazov,
      charakteristika: info.charakteristika,
      datum_do: info.datum_do,
      datum_od: info.datum_od,
      id_realizator: info.id_realizator,
      id_organizatori: infoOrganizatori.map((item) => {
        return item.id_organizacia;
      }),
      id_osoby: infoOsoby.map((item) => {
        return item.id_osoba;
      }),
      edit: true,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/event/${id_event}`)
      .then(() => {
        Toast.show("Event deleted successfully!", Toast.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: nazov,
      headerTitleStyle: { fontSize: 17 },
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
    fetchData();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["orange"]}
          tintColor={"orange"}
        />
      }
    >
      <View className="bg-orange-50 flex-1 items-center">
        <View className="w-11/12 space-y-10 mt-6">
          <View className="bg-orange-50 rounded-md p-5 w-full space-y-1">
            <Text>
              <Text className="font-semibold">ID:</Text> {info.id_event}
            </Text>
            <Text>
              <Text className="font-semibold">Name:</Text> {info.nazov}
            </Text>
            <Text>
              <Text className="font-semibold">Description:</Text>{" "}
              {info.charakteristika}
            </Text>
            <Text>
              <Text className="font-semibold">Date from:</Text>{" "}
              {moment(info.datum_od).format("DD/MM/yyyy")}
            </Text>
            <Text>
              <Text className="font-semibold">Date to:</Text>{" "}
              {moment(info.datum_do).format("DD/MM/yyyy")}
            </Text>
            <Text>
              <Text className="font-semibold">Organizer:</Text>{" "}
              {info.organizaciaNazov} · {info.druh} · {info.stat}
            </Text>
            <Text>
              <Text className="font-semibold">Organizers:</Text>{" "}
            </Text>
            {infoOrganizatori.map((item) => {
              return (
                <Text key={item.id_organizacia}>
                  {item.nazov} · {item.druh} · {item.stat}
                </Text>
              );
            })}
            <Text>
              <Text className="font-semibold">
                People responsible for organizing:
              </Text>{" "}
            </Text>
            {infoOsoby.map((item) => {
              return (
                <Text key={item.id_osoba}>
                  {item.meno} {item.priezvisko} · {item.rola}
                </Text>
              );
            })}
          </View>

          <View className="items-center">
            <View className="flex-row justify-center space-x-3 w-full">
              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-green-500 rounded-md shadow-green-600"
                onPress={handleEdit}
                activeOpacity={0.5}
              >
                <Text className="font-bold text-white text-center">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-red-500 rounded-md shadow-red-600"
                onPress={handleDelete}
                activeOpacity={0.5}
              >
                <Text className="font-bold text-white text-center">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default EventOne;