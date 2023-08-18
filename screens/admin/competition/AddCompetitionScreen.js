import {
  View,
  Text,
  Keyboard,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Input from "../../../components/Input";
import { BASE_URL } from "../../../url";
import axios from "axios";
import Toast from "react-native-simple-toast";

const AddCompetitionScreen = ({ navigation, route }) => {
  const [inputs, setInputs] = useState({
    nazov: route.params?.nazov || "",
    charakteristika: route.params?.charakteristika || "",
    id_hlavny_rozhodca: route.params?.id_hlavny_rozhodca || "",
    postupova_kvota: route.params?.postupova_kvota || "",
  });
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params?.id_hlavny_rozhodca || null);
  const [items, setItems] = useState([]);

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const fetchRozhodca = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/vysledky/idosoba`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_osoba,
          label: `${data[i].meno} ${data[i].priezvisko}`,
        });
      }
      setItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.nazov) {
      valid = false;
      handleError("Enter the competition name", "nazov");
    }
    if (!inputs.charakteristika) {
      valid = false;
      handleError("Enter the description", "charakteristika");
    }
    if (!inputs.id_hlavny_rozhodca) {
      valid = false;
      handleError("Enter the main referee", "id_hlavny_rozhodca");
    }
    if (!inputs.postupova_kvota) {
      valid = false;
      handleError("Enter the advancement quota", "postupova_kvota");
    }
    if (valid) {
      if (route.params?.edit) {
        await axios
          .put(`${BASE_URL}/competition`, {
            inputs,
            id_sutaz: route.params.id_sutaz,
          })
          .then((res) => {
            Toast.show("Competition updated successfully!", Toast.SHORT);
          })
          .catch((error) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      } else {
        await axios
          .post(`${BASE_URL}/competition`, inputs)
          .then(() => {
            Toast.show("Competition added successfully!", Toast.SHORT);
            setInputs({
              nazov: "",
              charakteristika: "",
              id_hlavny_rozhodca: "",
              postupova_kvota: "",
            });
            setValue("");
          })
          .catch((e) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    fetchRozhodca();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      className="items-center justify-center flex-1 bg-orange-50"
    >
      <Text className="text-4xl text-center">
        {route.params?.edit ? "Edit Competition" : "Add Competition"}
      </Text>
      <View className="w-4/5 mt-10">
        <Input
          placeholder="Competition name"
          value={inputs.nazov}
          error={errors.nazov}
          onChangeText={(text) => {
            handleChange(text, "nazov");
            handleError(null, "nazov");
          }}
        />
        <Input
          value={inputs.charakteristika}
          placeholder="Description"
          error={errors.charakteristika}
          onChangeText={(text) => {
            handleChange(text, "charakteristika");
            handleError(null, "charakteristika");
          }}
        />
        <DropDownPicker
          maxHeight={170}
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          onSelectItem={(item) =>
            handleChange(item.value, "id_hlavny_rozhodca")
          }
          setItems={setItems}
          listMode="SCROLLVIEW"
          placeholder="Main referee"
          className="bg-slate-200 py-2 px-5"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "gray" }}
          zIndex={100}
          error={errors.id_hlavny_rozhodca}
          onOpen={() => {
            handleError(null, "id_hlavny_rozhodca");
          }}
          style={{
            borderColor: errors.id_hlavny_rozhodca && "red",
            borderWidth: errors.id_hlavny_rozhodca && 1,
            borderRadius: 0,
          }}
        />
        {errors.id_hlavny_rozhodca && (
          <Text className="text-red-500 text-[12px] mt-1">
            {errors.id_hlavny_rozhodca}
          </Text>
        )}
        <Input
          value={inputs.postupova_kvota.toString()}
          placeholder="Advancement quota"
          keyboardType="numeric"
          error={errors.postupova_kvota}
          onChangeText={(text) => {
            handleChange(text, "postupova_kvota");
            handleError(null, "postupova_kvota");
          }}
        />
      </View>
      <View className="w-4/5 mt-8 mb-5">
        <TouchableOpacity
          onPress={validate}
          className="w-full shadow-xl px-2 py-3 bg-orange-400 rounded-md shadow-orange-600"
          activeOpacity={0.5}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddCompetitionScreen;
