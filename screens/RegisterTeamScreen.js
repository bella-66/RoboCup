import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "../url";
import Input from "../components/Input";
import axios from "axios";
import Toast from "react-native-simple-toast";

const RegisterTeamScreen = () => {
  const fetchOrganizacia = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/organizacia`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_organizacia,
          label: `${data[i].nazov} - ${data[i].druh} - ${data[i].stat}`,
        });
      }
      setOrganizaciaItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!name) {
      valid = false;
      handleError("name", "Enter the name of the team");
    }
    if (!organizaciaValue) {
      valid = false;
      handleError("organizacia", "Enter the organization");
    }
    if (valid) {
      try {
        axios
          .post(`${BASE_URL}/team`, {
            name,
            organizaciaValue,
          })
          .then((res) => {
            Toast.show("Team registered successfully!", Toast.SHORT);
            setName("");
            setOrganizaciaValue("");
          })
          .catch((err) => alert(err));
      } catch (error) {
        Alert.alert("Oops!", "Something went wrong.");
      }
    }
  };

  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [organizaciaOpen, setOrganizaciaOpen] = useState(false);
  const [organizaciaValue, setOrganizaciaValue] = useState(null);
  const [organizaciaItems, setOrganizaciaItems] = useState([]);

  const handleError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState, [input]: msg }));
  };

  useEffect(() => {
    fetchOrganizacia();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="items-center justify-center flex-1 bg-white"
    >
      <Text className="text-4xl text-center">Register Team</Text>
      <View className="w-4/5 mt-10">
        <Input
          value={name}
          autoComplete="off"
          placeholder="Name of team"
          error={errors.name}
          onChangeText={(text) => {
            setName(text);
            handleError("name", null);
          }}
        />

        <DropDownPicker
          maxHeight={170}
          open={organizaciaOpen}
          value={organizaciaValue}
          items={organizaciaItems}
          setOpen={setOrganizaciaOpen}
          setValue={setOrganizaciaValue}
          setItems={setOrganizaciaItems}
          listMode="SCROLLVIEW"
          placeholder="Organization"
          className="bg-slate-100 py-2.5 px-5 rounded-md"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "#9ca3af" }}
          zIndex={90}
          error={errors.organizacia}
          onOpen={() => {
            handleError("organizacia", null);
          }}
          style={{
            borderColor: errors.organizacia && "red",
            borderWidth: errors.organizacia && 1,
            borderRadius: 0,
          }}
        />
        {errors.organizacia && (
          <Text className="text-red-500 text-[12px] mt-1">
            {errors.organizacia}
          </Text>
        )}
      </View>
      <View className="w-4/5 mt-8 mb-5">
        <Pressable
          onPress={validate}
          className="w-full shadow-xl px-2 py-3 bg-blue-500 rounded-md shadow-blue-700"
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterTeamScreen;
