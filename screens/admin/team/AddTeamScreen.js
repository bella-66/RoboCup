import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import Input from "../../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";

const AddTeamScreen = ({ navigation, route }) => {
  const fetchOrganizacia = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/organizacia`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_organizacia,
          label: `${data[i].nazov} · ${data[i].druh} · ${data[i].stat}`,
        });
      }
      setOrganizaciaItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
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
      if (route.params?.edit) {
        await axios
          .put(`${BASE_URL}/team`, {
            name,
            organizaciaValue,
            id_tim: route.params.id_tim,
          })
          .then((res) => {
            Toast.show("Team updated successfully!", Toast.SHORT);
          })
          .catch((err) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      } else {
        await axios
          .post(`${BASE_URL}/team`, {
            name,
            organizaciaValue,
          })
          .then((res) => {
            Toast.show("Team added successfully!", Toast.SHORT);
            setName("");
            setOrganizaciaValue("");
          })
          .catch((err) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      }
    }
  };

  const [name, setName] = useState(route.params?.nazov || "");
  const [errors, setErrors] = useState({});
  const [organizaciaOpen, setOrganizaciaOpen] = useState(false);
  const [organizaciaValue, setOrganizaciaValue] = useState(
    route.params?.id_organizacie || null
  );
  const [organizaciaItems, setOrganizaciaItems] = useState([]);

  const handleError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState, [input]: msg }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    fetchOrganizacia();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      className="items-center justify-center flex-1 bg-white"
    >
      <Text className="text-4xl text-center">
        {route.params?.edit ? "Edit Team" : "Add Team"}
      </Text>
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
          className="bg-inputBackground py-2.5 px-5 rounded-md"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "#9ca3af" }}
          zIndex={90}
          error={errors.organizacia}
          onOpen={() => {
            handleError("organizacia", null);
          }}
          style={{
            borderColor: errors.organizacia ? "red" : "#949494",
          }}
        />
        {errors.organizacia && (
          <Text className="text-error text-[12px] mt-1">
            {errors.organizacia}
          </Text>
        )}
      </View>
      <View className="w-4/5 mt-8 mb-5">
        <TouchableOpacity
          onPress={validate}
          className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow"
          activeOpacity={0.5}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTeamScreen;
