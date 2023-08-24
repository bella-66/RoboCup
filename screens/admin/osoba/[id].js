import {
  View,
  Text,
  Alert,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import React, { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";
import moment from "moment";

const OsobaOne = ({ route }) => {
  const { id_osoba, email } = route.params;

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/osoba/admin/${id_osoba}`);
      setInfo(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchTeam = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/team/team/${id_osoba}`);
      let arr = [];
      if (data.length !== 0) {
        data.map((item) => {
          arr.push({ id_tim: item.id_tim, nazov: item.nazov });
        });
      }
      setTim(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const navigation = useNavigation();
  const [info, setInfo] = useState([]);
  const [tim, setTim] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData()
      .then(() => {
        fetchTeam();
      })
      .catch(() => {
        Alert.alert("Oops!", "Something went wrong.");
      })
      .finally(() => setRefreshing(false));
  };

  const handleEdit = () => {
    navigation.navigate("AddOsoba", {
      meno: info.meno,
      priezvisko: info.priezvisko,
      email: info.email,
      adresa_domu: info.adresa_domu,
      datum_narodenia: info.datum_narodenia,
      telefon: info.telefon,
      rola: info.rola,
      id_organizacie: info.id_organizacie,
      id_osoba: info.id_osoba,
      heslo: info.heslo,
      tim: tim.map((item) => item.id_tim),
      edit: true,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/osoba/${id_osoba}`)
      .then(() => {
        Toast.show("User deleted successfully!", Toast.SHORT);
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  useEffect(() => {
    fetchData();
    fetchTeam();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: email,
      headerTitleStyle: { fontSize: 17 },
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
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["blue"]}
          tintColor={"blue"}
        />
      }
    >
      <View className="bg-white flex-1 items-center">
        <View className="w-11/12 space-y-10 mt-6">
          <View className="bg-white rounded-md p-5 w-full space-y-1">
            <Text>
              <Text className="font-semibold">ID:</Text> {info.id_osoba}
            </Text>
            <Text>
              <Text className="font-semibold">First name:</Text> {info.meno}
            </Text>
            <Text>
              <Text className="font-semibold">Last name:</Text>{" "}
              {info.priezvisko}
            </Text>
            <Text>
              <Text className="font-semibold">Email:</Text> {info.email}
            </Text>
            <Text>
              <Text className="font-semibold">Address:</Text>{" "}
              {info.adresa_domu ? info.adresa_domu : "NULL"}
            </Text>
            <Text>
              <Text className="font-semibold">Date of birth:</Text>{" "}
              {info.datum_narodenia
                ? moment(info.datum_narodenia).format("D/M/yyyy")
                : "NULL"}
            </Text>
            <Text>
              <Text className="font-semibold">Phone number:</Text>{" "}
              {info.telefon}
            </Text>
            <Text>
              <Text className="font-semibold">Role:</Text> {info.rola}
            </Text>
            <Text>
              <Text className="font-semibold">Organization:</Text>{" "}
              {info.id_organizacie
                ? info.nazov + " · " + info.druh + " · " + info.stat
                : "NULL"}
            </Text>
            <Text>
              <Text className="font-semibold">Teams:</Text>{" "}
              {tim.length === 0 && <Text>None</Text>}
            </Text>
            {tim.length !== 0 &&
              tim.map((item) => (
                <Text className="" key={item.id_tim}>
                  {item.nazov}{" "}
                </Text>
              ))}
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

export default OsobaOne;
