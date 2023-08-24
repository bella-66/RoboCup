import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState, useLayoutEffect } from "react";
import Input from "../../../components/Input";
import DropDownPicker from "react-native-dropdown-picker";
import axios from "axios";
import { BASE_URL } from "../../../url";
import Toast from "react-native-simple-toast";

const AddOrganizationScreen = ({ navigation, route }) => {
  const [inputs, setInputs] = useState({
    nazov: route.params?.nazov || "",
    druh: route.params?.druh || "",
    ulica: route.params?.ulica || "",
    psc: route.params?.psc || "",
    stat: route.params?.stat || "",
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params?.druh || null);
  const [items, setItems] = useState([
    { label: "School", value: "school" },
    { label: "Club", value: "club" },
    { label: "Foundation", value: "foundation" },
  ]);

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.nazov) {
      handleError("Enter the name", "nazov");
      valid = false;
    }
    if (!inputs.druh) {
      handleError("Enter the type", "druh");
      valid = false;
    }
    if (!inputs.stat) {
      handleError("Enter the state", "stat");
      valid = false;
    }
    if (!inputs.psc) {
      handleError("Enter the zip code", "psc");
      valid = false;
    }
    if (!inputs.ulica) {
      handleError("Enter the street", "ulica");
      valid = false;
    }
    if (valid) {
      if (route.params?.edit) {
        await axios
          .put(`${BASE_URL}/organization`, {
            inputs,
            id_organizacia: route.params.id_organizacia,
          })
          .then((res) => {
            Toast.show("Organization updated successfully!", Toast.SHORT);
          })
          .catch((error) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      } else {
        await axios
          .post(`${BASE_URL}/organization`, inputs)
          .then((res) => {
            Toast.show("Organization added successfully!", Toast.SHORT);
            setInputs({ nazov: "", druh: "", ulica: "", psc: "", stat: "" });
            setValue("");
          })
          .catch((e) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      }
    }
  };

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      className="items-center justify-center flex-1 bg-white"
    >
      <Text className="text-4xl text-center">
        {route.params?.edit ? "Edit Organization" : "Add Organization"}
      </Text>
      <View className="w-4/5 mt-10">
        <DropDownPicker
          maxHeight={170}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          onSelectItem={(item) => handleChange(item.value, "druh")}
          listMode="SCROLLVIEW"
          placeholder="Type"
          className="bg-slate-100 py-2.5 px-5 rounded-md"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "#9ca3af" }}
          zIndex={90}
          error={errors.druh}
          onOpen={() => {
            handleError(null, "druh");
          }}
          style={{
            borderColor: errors.druh ? "red" : "#949494",
          }}
        />
        {errors.druh && (
          <Text className="text-red-500 text-[12px] mt-1">{errors.druh}</Text>
        )}

        <Input
          value={inputs.nazov}
          autoComplete="off"
          placeholder="Name"
          error={errors.nazov}
          onChangeText={(text) => {
            handleChange(text, "nazov");
            handleError(null, "nazov");
          }}
        />
        <Input
          value={inputs.ulica}
          autoComplete="off"
          placeholder="Street"
          error={errors.ulica}
          onChangeText={(text) => {
            handleChange(text, "ulica");
            handleError(null, "ulica");
          }}
        />
        <Input
          keyboardType="numeric"
          value={inputs.psc}
          autoComplete="off"
          placeholder="Zip code"
          error={errors.psc}
          onChangeText={(text) => {
            handleChange(text, "psc");
            handleError(null, "psc");
          }}
        />
        <Input
          value={inputs.stat}
          autoComplete="off"
          placeholder="State"
          error={errors.stat}
          onChangeText={(text) => {
            handleChange(text, "stat");
            handleError(null, "stat");
          }}
        />
      </View>
      <View className="w-4/5 mt-8 mb-5">
        <TouchableOpacity
          onPress={validate}
          className="w-full shadow-xl px-2 py-3 bg-blue-500 rounded-md shadow-blue-700"
          activeOpacity={0.5}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddOrganizationScreen;
