import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Input from "../components/Input";
import axios from "axios";
import { BASE_URL } from "../url";
import DropDownPicker from "react-native-dropdown-picker";
import useAuth from "../context/AuthContext";
import moment from "moment";
import Toast from "react-native-simple-toast";

const AddResultScreen = ({ route }) => {
  const { userInfo } = useAuth();

  const [inputs, setInputs] = useState({
    id_timeline: "",
    id_sutaz: route.params?.id_sutaz || "",
    datum_zapisu: "",
    id_zapisujuca_osoba: userInfo.id_osoba,
    vysledok_1: "",
    vysledok_2: "",
  });
  const [errors, setErrors] = useState({});

  const [timelineOpen, setTimelineOpen] = useState(false);
  const [timelineValue, setTimelineValue] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [compOpen, setCompOpen] = useState(false);
  const [compValue, setCompValue] = useState(route.params?.id_sutaz || null);
  const [comp, setComp] = useState([]);

  const [tim1, setTim1] = useState("");
  const [tim2, setTim2] = useState(null);

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.id_zapisujuca_osoba) {
      handleError("Enter the result recorder", "id_zapisujuca_osoba");
      valid = false;
    }
    if (inputs.id_timeline && !inputs.vysledok_1) {
      handleError("Enter result", "vysledok_1");
      valid = false;
    }
    if (tim2 && !inputs.vysledok_2) {
      handleError("Enter result", "vysledok_2");
      valid = false;
    }
    if (inputs.id_sutaz && !inputs.id_timeline) {
      handleError("Enter timeline", "id_timeline");
      valid = false;
    }
    if (!inputs.id_sutaz) {
      handleError("Enter competition", "id_sutaz");
      valid = false;
    }

    if (valid) {
      inputs.datum_zapisu = moment()
        .utcOffset(new Date().getTimezoneOffset() / -1)
        .format();
      if (inputs.vysledok_2 == "") inputs.vysledok_2 = null;
      await axios
        .post(`${BASE_URL}/vysledky`, inputs)
        .then((res) => {
          Toast.show("Result added successfully!", Toast.SHORT);
          setInputs({
            id_timeline: "",
            id_sutaz: "",
            datum_zapisu: "",
            id_zapisujuca_osoba: userInfo.id_osoba,
            vysledok_1: "",
            vysledok_2: "",
          });
          setTimelineValue("");
          setCompValue("");
          fetchComps();
        })
        .catch((e) => {
          Alert.alert("Oops!", "Something went wrong.");
        });
    }
  };

  const fetchTimeline = async (id_sutaz) => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/vysledky/resultTimeline/${id_sutaz}`
      );
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_timeline,
          label: `${data[i].druh_operacie} · ${
            data[i].nazov_tim1 ? data[i].nazov_tim1 : ""
          } ${data[i].nazov_tim2 ? "| " + data[i].nazov_tim2 : ""}`,
          tim2: data[i].id_tim_2 !== null ? data[i].nazov_tim2 : null,
          tim1: data[i].nazov_tim1,
        });
      }
      setTimeline(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchComps = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/competition/add`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_sutaz,
          label: `${data[i].nazov}`,
        });
      }
      setComp(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchComps();
    {
      route.params?.id_sutaz && fetchTimeline(inputs.id_sutaz);
    }
  }, []);

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
          <Text className="text-3xl text-center">Add Result</Text>
          <View className="items-center">
            <View className="w-4/5 mt-10">
              <DropDownPicker
                maxHeight={170}
                open={compOpen}
                value={inputs.id_sutaz || compValue}
                items={comp}
                setOpen={setCompOpen}
                setValue={setCompValue}
                setItems={setComp}
                onSelectItem={(item) => {
                  handleChange(item.value, "id_sutaz");
                  setTimelineValue("");
                  handleChange(null, "id_timeline");
                  fetchTimeline(item.value);
                }}
                listMode="SCROLLVIEW"
                placeholder="Competition"
                className="bg-inputBackground py-2.5 px-5 rounded-md"
                placeholderStyle={{ color: "#9ca3af" }}
                zIndex={100}
                onOpen={() => {
                  handleError(null, "id_sutaz");
                }}
                style={{
                  borderColor: errors.id_sutaz ? "red" : "#949494",
                }}
              />
              {errors.id_sutaz && (
                <Text className="text-error text-[12px] mt-1">
                  {errors.id_sutaz}
                </Text>
              )}
              {compValue && (
                <>
                  <DropDownPicker
                    maxHeight={170}
                    open={timelineOpen}
                    value={timelineValue}
                    items={timeline}
                    setOpen={setTimelineOpen}
                    setValue={setTimelineValue}
                    setItems={setTimeline}
                    onSelectItem={(item) => {
                      handleChange(item.value, "id_timeline");
                      setTim1(item.tim1);
                      setTim2(item.tim2 === "" ? null : item.tim2);
                    }}
                    listMode="SCROLLVIEW"
                    placeholder="Timeline"
                    className="bg-inputBackground py-2.5 px-5 rounded-md"
                    containerStyle={{ marginTop: 16 }}
                    placeholderStyle={{ color: "#9ca3af" }}
                    zIndex={90}
                    onOpen={() => {
                      handleError(null, "id_timeline");
                    }}
                    style={{
                      borderColor: errors.id_timeline ? "red" : "#949494",
                    }}
                  />
                  {errors.id_timeline && (
                    <Text className="text-error text-[12px] mt-1">
                      {errors.id_timeline}
                    </Text>
                  )}
                </>
              )}
              {timelineValue && (
                <View className="mt-5">
                  <Text className="font-semibold text-[15px]">{tim1}</Text>
                  <View>
                    <Input
                      keyboardType="numeric"
                      value={inputs.vysledok_1}
                      placeholder={`Result`}
                      error={errors.vysledok_1}
                      onChangeText={(text) => {
                        handleChange(text, "vysledok_1");
                        handleError(null, "vysledok_1");
                      }}
                      onSubmitEditing={!tim2 && validate}
                    />
                  </View>
                  {tim2 && (
                    <View className="mt-5">
                      <Text className="font-semibold text-[15px]">{tim2}</Text>
                      <Input
                        keyboardType="numeric"
                        value={inputs.vysledok_2}
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
              )}
            </View>

            <View className="w-4/5 mt-12 mb-5">
              <TouchableOpacity
                onPress={validate}
                className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow"
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

export default AddResultScreen;
