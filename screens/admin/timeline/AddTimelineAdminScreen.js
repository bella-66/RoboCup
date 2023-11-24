import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Alert,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../../../components/Input";
import DateTimePicker from "react-native-modal-datetime-picker";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "../../../url";
import axios from "axios";
import moment from "moment-timezone";
import Toast from "react-native-simple-toast";

const AddTimelineAdminScreen = ({ navigation, route }) => {
  const [inputs, setInputs] = useState({
    datum_a_cas: route.params?.datum_a_cas || "",
    druh_operacie: route.params?.druh_operacie || "",
    id_sutaz: route.params?.id_sutaz || "",
    id_tim_1: route.params?.id_tim_1 || "",
    id_tim_2: route.params?.id_tim_2 || null,
  });
  const [errors, setErrors] = useState({});
  const [operaciaOpen, setOperaciaOpen] = useState(false);
  const [operaciaValue, setOperaciaValue] = useState(
    route.params?.druh_operacie || ""
  );
  const [operaciaItems, setOperaciaItems] = useState([
    { label: "Ride", value: "Ride" },
    { label: "Results announcement", value: "Results announcement" },
    { label: "Match", value: "Match" },
    { label: "Meeting", value: "Meeting" },
  ]);
  const [sutazOpen, setSutazOpen] = useState(false);
  const [sutazValue, setSutazValue] = useState(route.params?.id_sutaz || "");
  const [sutazItems, setSutazItems] = useState([]);
  const [tim1Open, setTim1Open] = useState(false);
  const [tim1Value, setTim1Value] = useState(route.params?.id_tim_1 || "");
  const [tim1Items, setTim1Items] = useState([]);
  const [tim2Open, setTim2Open] = useState(false);
  const [tim2Value, setTim2Value] = useState(route.params?.id_tim_2 || "");
  const [tim2Items, setTim2Items] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    handleChange(date, "datum_a_cas");
    hideDatePicker();
  };

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const fetchTim = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/tim`);
      let arr = [];
      arr.push({
        value: null,
        label: "None",
      });
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_tim,
          label: `${data[i].nazov}`,
        });
      }
      setTim1Items(arr);
      setTim2Items(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchSutaz = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/timeline`);
      let arr = [];
      data.forEach((element, index, array) => {
        arr.push({
          value: data[index].id_sutaz,
          label: `${data[index].nazov}`,
        });
      });
      setSutazItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.datum_a_cas) {
      handleError("Enter date and time", "datum_a_cas");
      valid = false;
    }
    if (!inputs.druh_operacie) {
      handleError("Enter the type", "druh_operacie");
      valid = false;
    }
    if (
      (inputs.druh_operacie === "Meeting" ||
        inputs.druh_operacie === "Results announcement") &&
      inputs.id_tim_1
    ) {
      handleError("Invalid", "id_tim_1");
      valid = false;
    }
    if (inputs.druh_operacie === "Match" && !inputs.id_tim_2) {
      handleError("Enter the second team", "id_tim_2");
      valid = false;
    }
    if (
      inputs.druh_operacie !== "Meeting" &&
      inputs.druh_operacie !== "Results announcement" &&
      !inputs.id_tim_1
    ) {
      handleError("Enter the first team", "id_tim_1");
      valid = false;
    }
    if (inputs.id_tim_1 && inputs.id_tim_1 === inputs.id_tim_2) {
      handleError("Enter valid second team", "id_tim_2");
      valid = false;
    }
    if (!inputs.id_sutaz) {
      handleError("Enter the competition", "id_sutaz");
      valid = false;
    }

    if (valid) {
      const convertedToLocalTime = moment(inputs.datum_a_cas)
        .utcOffset(new Date(inputs.datum_a_cas).getTimezoneOffset() / -1)
        .format();
      inputs.datum_a_cas = convertedToLocalTime;
      if (route.params?.edit) {
        await axios
          .put(`${BASE_URL}/timeline`, {
            inputs,
            id_timeline: route.params.id_timeline,
          })
          .then((res) => {
            Toast.show("Timeline updated successfully!", Toast.SHORT);
          })
          .catch((error) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      } else {
        await axios
          .post(`${BASE_URL}/timeline`, inputs)
          .then((res) => {
            Toast.show("Added to timeline successfully!", Toast.SHORT);
            setInputs({
              datum_a_cas: "",
              druh_operacie: "",
              id_sutaz: "",
              id_tim_1: "",
              id_tim_2: null,
            });
            setTim1Value("");
            setTim2Value("");
            setSutazValue("");
            setOperaciaValue("");
          })
          .catch((error) => {
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
    fetchTim();
    fetchSutaz();
  }, []);

  //TODO update timeline => tim_sutaz

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScrollView
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          <Text className="text-3xl text-center">
            {route.params?.edit ? "Edit Timeline" : "Add to timeline"}
          </Text>
          <View className="items-center">
            <View className="w-4/5 mt-10">
              <TouchableOpacity
                onPress={() => {
                  setDatePickerVisibility(true);
                  handleError(null, "datum_a_cas");
                }}
              >
                <Input
                  editable={false}
                  value={
                    inputs.datum_a_cas
                      ? moment(inputs.datum_a_cas).format("D/M/yyyy") +
                        " " +
                        moment(inputs.datum_a_cas).format("H:mm")
                      : "No date is picked"
                  }
                  error={errors.datum_a_cas}
                  className="text-gray-900"
                />
              </TouchableOpacity>
              <DateTimePicker
                isVisible={isDatePickerVisible}
                mode="datetime"
                date={
                  inputs.datum_a_cas ? new Date(inputs.datum_a_cas) : new Date()
                }
                onCancel={hideDatePicker}
                onConfirm={handleConfirm}
              />

              <DropDownPicker
                maxHeight={170}
                open={sutazOpen}
                value={sutazValue}
                items={sutazItems}
                setOpen={setSutazOpen}
                setValue={setSutazValue}
                setItems={setSutazItems}
                onSelectItem={(item) => handleChange(item.value, "id_sutaz")}
                listMode="SCROLLVIEW"
                placeholder="Competition"
                placeholderStyle={{ color: "#9ca3af" }}
                zIndex={120}
                onOpen={() => handleError(null, "id_sutaz")}
                error={errors.id_sutaz}
                className="bg-inputBackground py-2.5 px-5 rounded-md"
                style={{
                  borderColor: errors.id_sutaz ? "red" : "#949494",
                }}
                containerStyle={{ marginTop: 16 }}
              />
              {errors.id_sutaz && (
                <Text className="text-error text-[12px] mt-1">
                  {errors.id_sutaz}
                </Text>
              )}

              <DropDownPicker
                maxHeight={150}
                open={operaciaOpen}
                value={operaciaValue}
                items={operaciaItems}
                setOpen={setOperaciaOpen}
                setValue={setOperaciaValue}
                setItems={setOperaciaItems}
                onSelectItem={(item) =>
                  handleChange(item.value, "druh_operacie")
                }
                listMode="SCROLLVIEW"
                placeholder="Type"
                placeholderStyle={{ color: "#9ca3af" }}
                zIndex={100}
                onOpen={() => handleError(null, "druh_operacie")}
                error={errors.druh_operacie}
                className="bg-inputBackground py-2.5 px-5 rounded-md"
                style={{
                  borderColor: errors.druh_operacie ? "red" : "#949494",
                }}
                containerStyle={{ marginTop: 16 }}
              />
              {errors.druh_operacie && (
                <Text className="text-error text-[12px] mt-1">
                  {errors.druh_operacie}
                </Text>
              )}

              <DropDownPicker
                maxHeight={170}
                open={tim1Open}
                value={tim1Value}
                items={tim1Items}
                setOpen={setTim1Open}
                setValue={setTim1Value}
                setItems={setTim1Items}
                listMode="SCROLLVIEW"
                onSelectItem={(item) => {
                  handleChange(item.value, "id_tim_1");
                }}
                placeholder="Team 1"
                placeholderStyle={{ color: "#9ca3af" }}
                zIndex={90}
                onOpen={() => handleError(null, "id_tim_1")}
                error={errors.id_tim_1}
                className="bg-inputBackground py-2.5 px-5 rounded-md"
                style={{
                  borderColor: errors.id_tim_1 ? "red" : "#949494",
                }}
                containerStyle={{ marginTop: 16 }}
              />
              {errors.id_tim_1 && (
                <Text className="text-error text-[12px] mt-1">
                  {errors.id_tim_1}
                </Text>
              )}
              {inputs.druh_operacie === "Match" && (
                <>
                  <DropDownPicker
                    maxHeight={170}
                    open={tim2Open}
                    value={tim2Value}
                    items={tim2Items}
                    setOpen={setTim2Open}
                    setValue={setTim2Value}
                    setItems={setTim2Items}
                    onSelectItem={(item) =>
                      handleChange(item.value, "id_tim_2")
                    }
                    listMode="SCROLLVIEW"
                    placeholder="Team 2"
                    placeholderStyle={{ color: "#9ca3af" }}
                    zIndex={80}
                    className="bg-inputBackground py-2.5 px-5 rounded-md"
                    onOpen={() => handleError(null, "id_tim_2")}
                    error={errors.id_tim_2}
                    style={{
                      borderColor: errors.id_tim_2 ? "red" : "#949494",
                    }}
                    containerStyle={{ marginTop: 16 }}
                  />
                  {errors.id_tim_2 && (
                    <Text className="text-error text-[12px] mt-1">
                      {errors.id_tim_2}
                    </Text>
                  )}
                </>
              )}
            </View>

            <View className="w-4/5 mt-8 mb-5 space-y-5">
              <TouchableOpacity
                onPress={validate}
                className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow"
                activeOpacity={0.5}
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

export default AddTimelineAdminScreen;
