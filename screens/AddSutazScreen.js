import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import axios from "axios";
import { BASE_URL } from "../url";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-simple-toast";

const AddSutazScreen = () => {
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

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.nazov) {
      valid = false;
      handleError("nazov", "Enter the competition name");
    }
    if (!inputs.charakteristika) {
      valid = false;
      handleError("charakteristika", "Enter the description");
    }
    if (!inputs.id_hlavny_rozhodca) {
      valid = false;
      handleError("id_hlavny_rozhodca", "Enter the main referee");
    }
    if (!inputs.postupova_kvota) {
      valid = false;
      handleError("postupova_kvota", "Enter the advancement quota");
    }
    if (valid) {
      try {
        axios
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
      } catch (error) {
        Alert.alert("Oops!", "Something went wrong.");
      }
    }
  };

  const [errors, setErrors] = useState([]);
  const [inputs, setInputs] = useState({
    nazov: "",
    charakteristika: "",
    id_hlavny_rozhodca: "",
    postupova_kvota: "",
  });

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const handleChange = (input, value) => {
    setInputs((prevState) => ({ ...prevState, [input]: value }));
  };

  const handleError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState, [input]: msg }));
  };

  useEffect(() => {
    fetchRozhodca();
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          <Text className="text-3xl text-center">Add a competition</Text>
          <View className="items-center">
            <View className="w-4/5 mt-10">
              <Input
                placeholder="Competition name"
                value={inputs.nazov}
                error={errors.nazov}
                onChangeText={(text) => {
                  handleChange("nazov", text);
                  handleError("nazov", null);
                }}
              />
              <Input
                value={inputs.charakteristika}
                placeholder="Description"
                error={errors.charakteristika}
                onChangeText={(text) => {
                  handleChange("charakteristika", text);
                  handleError("charakteristika", null);
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
                  handleChange("id_hlavny_rozhodca", item.value)
                }
                setItems={setItems}
                listMode="SCROLLVIEW"
                placeholder="Main referee"
                className="bg-slate-100 py-2.5 px-5 rounded-md"
                containerStyle={{ marginTop: 16 }}
                placeholderStyle={{ color: "#9ca3af" }}
                zIndex={100}
                error={errors.id_hlavny_rozhodca}
                onOpen={() => {
                  handleError("id_hlavny_rozhodca", null);
                }}
                style={{
                  borderColor: errors.id_hlavny_rozhodca ? "red" : "#949494",
                }}
              />
              {errors.id_hlavny_rozhodca && (
                <Text className="text-red-500 text-[12px] mt-1">
                  {errors.id_hlavny_rozhodca}
                </Text>
              )}
              <Input
                keyboardType="numeric"
                value={inputs.postupova_kvota}
                placeholder="Advancement quota"
                error={errors.postupova_kvota}
                onChangeText={(text) => {
                  handleChange("postupova_kvota", text);
                  handleError("postupova_kvota", null);
                }}
              />
            </View>
            <View className="w-4/5 mt-8 mb-5">
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={validate}
                className="w-full shadow-xl px-2 py-3 bg-blue-500 rounded-md shadow-blue-700"
              >
                <Text className="text-center text-white font-bold">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddSutazScreen;
