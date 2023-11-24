import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/Ionicons";

const TeamOne = ({ route }) => {
  const { id_tim, nazov } = route.params;
  const navigation = useNavigation();
  const [info, setInfo] = useState([]);
  const [comps, setComps] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData()
      .then(() => {
        fetchCompetitions();
      })
      .catch(() => {
        Alert.alert("Oops!", "Something went wrong.");
      })
      .finally(() => setRefreshing(false));
  };

  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/team/admin/${id_tim}`);
      setInfo(data[0]);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchCompetitions = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/team/competition/${id_tim}`
      );
      setComps(data);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const handleEdit = () => {
    navigation.navigate("AddTeam", {
      id_tim: info.id_tim,
      nazov: info.nazov,
      id_organizacie: info.id_organizacie,
      edit: true,
    });
  };

  const handleDelete = async () => {
    await axios
      .delete(`${BASE_URL}/team/${id_tim}`)
      .then(() => {
        Toast.show("User deleted successfully!", Toast.SHORT);
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
        backgroundColor: "white",
        elevation: 0,
        shadowOpacity: 0,
        shadowColor: "transparent",
        borderBottomWidth: 0,
      },
    });
  }, []);

  useEffect(() => {
    fetchData();
    fetchCompetitions();
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
              <Text className="font-semibold">ID:</Text> {info.id_tim}
            </Text>
            <Text>
              <Text className="font-semibold">Name:</Text> {info.nazov}
            </Text>
            <Text>
              <Text className="font-semibold">Organization:</Text>{" "}
              {info.org_nazov} · {info.druh} · {info.stat}
            </Text>
            {comps.length === 0 ? (
              <Text>
                <Text className="font-semibold">Competitions:</Text> None
              </Text>
            ) : (
              <>
                <Text>
                  <Text className="font-semibold">Competitions: </Text>
                  {comps.map((comp) => comp.sutazNazov).join(", ")}
                </Text>
              </>
            )}
          </View>

          <View>
            <TouchableOpacity
              activeOpacity={0.5}
              className="flex-row items-center"
              onPress={() => {
                navigation.navigate("AddTeamToComp", { id_tim: info.id_tim });
              }}
            >
              <Icon name="add-circle" size={24} color={"#3b82f6"} />
              <Text className="text-primary text-lg ml-1">
                Add team to competition
              </Text>
            </TouchableOpacity>
          </View>

          <View className="items-center">
            <View className="flex-row justify-center space-x-3 w-full">
              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-editButton rounded-md shadow-editButtonShadow"
                onPress={handleEdit}
                activeOpacity={0.5}
              >
                <Text className="font-bold text-white text-center">Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-1/2 shadow-xl px-2 py-3 bg-deleteButton rounded-md shadow-deleteButtonShadow"
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

export default TeamOne;
