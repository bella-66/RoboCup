import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "../url";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import Toast from "react-native-simple-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        if (userData !== null) {
          const parsedData = JSON.parse(userData);
          setUserInfo(parsedData);
        }
      } catch (e) {
        Alert.alert("Oops!", "Something went wrong.");
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // const continueWithoutAccount = async () => {
  //   setIsLoading(true);
  //   setUserInfo("without account");
  //   await AsyncStorage.setItem("userInfo", JSON.stringify("without account"))
  //     .then(() => {
  //       Toast.show("Registered successfully!", Toast.SHORT);
  //     })
  //     .finally(() => {
  //       setIsLoading(false);
  //     });
  // };

  const register = async (inputs, digest) => {
    setIsLoading(true);
    if (inputs.organizacia == "") inputs.organizacia = null;
    if (inputs.datum_narodenia == "") inputs.datum_narodenia = null;
    else {
      const convertedToLocalTime = moment(inputs.datum_narodenia)
        .utcOffset(new Date(inputs.datum_narodenia).getTimezoneOffset() / -1)
        .format();
      inputs.datum_narodenia = convertedToLocalTime;
    }
    inputs.heslo = digest;
    await axios
      .post(BASE_URL, inputs)
      .then((res) => {
        setUserInfo(res.data);
        AsyncStorage.setItem("userInfo", JSON.stringify(res.data));
        Toast.show("Registered successfully!", Toast.SHORT);
      })
      .catch((e) => {
        Alert.alert("Oops!", "Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const login = async (email, password) => {
    setIsLoading(true);
    await axios
      .post(`${BASE_URL}/login`, {
        email,
        password,
      })
      .then((res) => {
        if (res.data.length !== 0) {
          let [accounts] = res.data;
          setUserInfo(accounts);
          AsyncStorage.setItem("userInfo", JSON.stringify(accounts));
          Toast.show("Logged in successfully!", Toast.SHORT);
        } else {
          Alert.alert("Oops!", "Incorrect email or password.");
        }
      })
      .catch((e) => {
        Alert.alert("Oops!", e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const logout = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem("userInfo")
      .then(() => {
        setUserInfo(null);
        Toast.show("Logged out successfully!", Toast.SHORT);
      })
      .finally(() => setIsLoading(false));
  };

  const updateUserInfo = async (inputs, id_osoba) => {
    setIsLoading(true);
    await axios
      .put(`${BASE_URL}/login`, { inputs, id_osoba })
      .then((res) => {
        let [accounts] = res.data;
        setUserInfo(accounts);
        AsyncStorage.setItem("userInfo", JSON.stringify(accounts));
        Toast.show("Updated profile successfully!", Toast.SHORT);
      })
      .catch((e) => {
        Alert.alert("Oops!", "Something went wrong.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userInfo,
        register,
        login,
        continueWithoutAccount,
        logout,
        updateUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default function useAuth() {
  return useContext(AuthContext);
}
