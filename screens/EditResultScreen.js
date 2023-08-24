import {
  View,
  Text,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Platform,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../url";
import Input from "../components/Input";
import Toast from "react-native-simple-toast";

const EditResultScreen = ({ route, navigation }) => {
  const [inputs, setInputs] = useState({
    id_timeline: route.params?.id_timeline,
    datum_zapisu: route.params?.datum_zapisu,
    id_zapisujuca_osoba: route.params?.id_zapisujuca_osoba,
    vysledok_1: route.params?.vysledok_1,
    vysledok_2: route.params?.vysledok_2,
  });

  const { tim1, tim2 } = route.params;

  const [errors, setErrors] = useState({});

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.id_timeline) {
      Alert.alert("Oops!", "Something went wrong.");
      handleError("Enter timeline", "id_timeline");
      valid = false;
    }
    if (!inputs.vysledok_1) {
      handleError("Enter result", "vysledok_1");
      valid = false;
    }
    if (tim2 && !inputs.vysledok_2) {
      handleError("Enter result", "vysledok_2");
      valid = false;
    }

    if (valid) {
      console.log(inputs);
      if (inputs.vysledok_2 == "") inputs.vysledok_2 = null;
      await axios
        .put(`${BASE_URL}/vysledky`, {
          inputs,
        })
        .then((res) => {
          Toast.show("Result updated successfully!", Toast.SHORT);
        })
        .catch((error) => {
          Alert.alert("Oops!", "Something went wrong.");
        });
    }
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
      <Text className="text-4xl text-center">Edit Result</Text>
      <View className="w-4/5 mt-10">
        <View className="">
          <Text className="font-semibold text-[15px]">{tim1}</Text>
          <Input
            keyboardType="numeric"
            value={inputs.vysledok_1 && inputs.vysledok_1.toString()}
            placeholder="Result"
            error={errors.vysledok_1}
            onChangeText={(text) => {
              handleChange(text, "vysledok_1");
              handleError(null, "vysledok_1");
            }}
            onSubmitEditing={!tim2 && validate}
          />
          {tim2 && (
            <View className="mt-5">
              <Text className="font-semibold text-[15px]">{tim2}</Text>
              <Input
                keyboardType="numeric"
                value={inputs.vysledok_2 && inputs.vysledok_2.toString()}
                placeholder="Result"
                error={errors.vysledok_2}
                onChangeText={(text) => {
                  handleChange(text, "vysledok_2");
                  handleError(null, "vysledok_2");
                }}
                onSubmitEditing={validate}
              />
            </View>
          )}
        </View>
      </View>
      <View className="w-4/5 mt-12 mb-5">
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

export default EditResultScreen;
