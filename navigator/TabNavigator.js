import React, { useLayoutEffect } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import VysledkyScreen from "../screens/VysledkyScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { useNavigation } from "@react-navigation/native";
import EventScreen from "../screens/EventScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "white",
          height: 55,
          elevation: 0,
          shadowOpacity: 0,
          shadowColor: "transparent",
          borderTopWidth: 0,
          minHeight: 70,
          maxHeight: 75,
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "rgba(156,163,175,0.6)",
        tabBarItemStyle: {
          marginBottom: 5,
          marginTop: 5,
        },
        tabBarShowLabel: false,

        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "Home") {
            return (
              <Icon
                style={{
                  backgroundColor: focused ? "#dbeafe" : "none",
                  borderRadius: 10,
                  padding: 7,
                }}
                name={"home"}
                size={25}
                color={focused ? color : "rgba(203,213,225,0.5)"}
              />
            );
          } else if (route.name === "Events") {
            return (
              <Icon
                style={{
                  backgroundColor: focused ? "#dbeafe" : "none",
                  borderRadius: 10,
                  padding: 7,
                }}
                name={"reader"}
                size={25}
                color={focused ? color : "rgba(203,213,225,0.5)"}
              />
            );
          } else if (route.name === "Results") {
            return (
              <Icon
                style={{
                  backgroundColor: focused ? "#dbeafe" : "none",
                  borderRadius: 10,
                  padding: 7,
                }}
                name={"podium"}
                size={25}
                color={focused ? color : "rgba(203,213,225,0.5)"}
              />
            );
          } else if (route.name === "Profile") {
            return (
              <Icon
                style={{
                  backgroundColor: focused ? "#dbeafe" : "none",
                  borderRadius: 10,
                  padding: 7,
                }}
                name={"person"}
                size={25}
                color={focused ? color : "rgba(203,213,225,0.5)"}
              />
            );
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Events" component={EventScreen} />
      <Tab.Screen name="Results" component={VysledkyScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
