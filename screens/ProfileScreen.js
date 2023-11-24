import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import useAuth from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../url";
import ProfileInfo from "../components/ProfileInfo";
import { StatusBar } from "expo-status-bar";
import Dialog from "react-native-dialog";
import moment from "moment";
import Icon from "react-native-vector-icons/Ionicons";

const ProfileScreen = ({ navigation }) => {
  const { userInfo, logout } = useAuth();
  const [profile, setProfile] = useState([]);

  const handleLogOut = () => {
    logout();
    setVisible(false);
  };

  const fetchVysledky = async () => {
    try {
      const { data } = await axios.post(`${BASE_URL}/login/profile`, {
        id_osoba: userInfo.id_osoba,
      });
      setProfile(data);
    } catch (e) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const [visible, setVisible] = useState(false);

  const showDialog = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Profile",
      headerShown: true,
      headerTitleAlign: "center",
      headerStyle: {
        backgroundColor:
          userInfo !== "without account" ? "rgb(96, 165, 250)" : "white",
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
    <>
      {userInfo === "without account" ? (
        <View className="flex-1 bg-white items-center justify-center">
          <Text>Sign up!</Text>
          <View className="w-4/5">
            <Pressable
              className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow"
              onPress={logout}
            >
              <Text className="text-center text-white font-bold">Login</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          <View>
            <Dialog.Container visible={visible} onBackdropPress={handleCancel}>
              <Dialog.Title style={{ color: "black" }}>
                <Text>Log out</Text>
              </Dialog.Title>
              <Dialog.Description>
                Are you sure you want to log out?
              </Dialog.Description>
              <Dialog.Button label="Log out" onPress={handleLogOut} />
              <Dialog.Button label="Cancel" onPress={handleCancel} />
            </Dialog.Container>
          </View>
          <View className="items-center justify-around flex-1 bg-white">
            <View
              className="h-32 w-full justify-center items-center"
              style={{ backgroundColor: "rgb(96, 165, 250)" }}
            >
              <View className="w-11/12 items-center justify-between flex-row">
                <View>
                  <Text className="text-[23px] font-semibold">
                    {userInfo.meno} {userInfo.priezvisko}
                  </Text>
                  <Text className="text-[15px] mt-1 text-secondaryText">
                    {userInfo.email}
                  </Text>
                </View>
                <Icon
                  name="create-outline"
                  size={30}
                  color="white"
                  onPress={() => navigation.navigate("EditProfile")}
                />
              </View>
            </View>

            <ScrollView
              className="w-4/5 mb-10 mt-7"
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              <View className="w-full">
                {userInfo.adresa_domu && (
                  <ProfileInfo
                    title="Address"
                    info={
                      userInfo.adresa_domu +
                      ", " +
                      userInfo.psc +
                      " " +
                      userInfo.mesto
                    }
                  />
                )}
                <ProfileInfo title={"Phone number"} info={userInfo.telefon} />
                {userInfo.datum_narodenia && (
                  <ProfileInfo
                    title="Date of birth"
                    info={moment(userInfo.datum_narodenia).format("D/M/yyyy")}
                  />
                )}
                {/* <ProfileInfo title={"Role"} info={userInfo.rola} /> */}
              </View>

              {profile.length !== 0 && (
                <>
                  <View className="mt-2">
                    <Text className="text-lg font-semibold">Teams</Text>
                    <View className="flex-row mt-1 flex-wrap justify-start items-center">
                      {profile.map((item) => {
                        return (
                          <TouchableOpacity
                            key={item.id_tim}
                            className="rounded-xl mr-3 mb-4"
                            activeOpacity={0.6}
                            onPress={() =>
                              navigation.navigate("UserTeamComps", {
                                id_tim: item.id_tim,
                              })
                            }
                          >
                            <Text className="text-secondary border-b-[1.5px] border-primary pb-1">
                              {item.nazov}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                </>
              )}

              {userInfo.rola === "Mentor" && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("RegisterTeam");
                  }}
                  activeOpacity={0.5}
                >
                  <Text className="text-primary font-bold">
                    Register your team!
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <View className="w-4/5 mb-6">
              <TouchableOpacity
                className="w-full shadow-lg px-2 py-3 bg-primary rounded-md shadow-shadow"
                onPress={showDialog}
                activeOpacity={0.5}
              >
                <Text className="text-center text-white font-bold">
                  Log out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </>
  );
};

export default ProfileScreen;
