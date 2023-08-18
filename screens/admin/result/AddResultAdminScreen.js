import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import Input from "../../../components/Input";
import { BASE_URL } from "../../../url";
import axios from "axios";
import useAuth from "../../../context/AuthContext";
import moment from "moment";
import Toast from "react-native-simple-toast";

const AddResultAdminScreen = ({ navigation, route }) => {
  const { userInfo } = useAuth();

  const [inputs, setInputs] = useState({
    id_timeline: route.params?.id_timeline || "",
    id_sutaz: route.params?.id_sutaz || "",
    datum_zapisu: route.params?.datum_zapisu || "",
    id_zapisujuca_osoba: route.params?.id_zapisujuca_osoba || userInfo.id_osoba,
    vysledok_1: route.params?.vysledok_1 || "",
    vysledok_2: route.params?.vysledok_2 || "",
  });
  const [errors, setErrors] = useState({});

  const [timelineOpen, setTimelineOpen] = useState(false);
  const [timelineValue, setTimelineValue] = useState(
    route.params?.id_timeline || null
  );
  const [timeline, setTimeline] = useState([]);
  const [compOpen, setCompOpen] = useState(false);
  const [compValue, setCompValue] = useState(route.params?.id_sutaz || null);
  const [comp, setComp] = useState([]);

  const [tim1, setTim1] = useState("");
  const [tim2, setTim2] = useState(null);

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
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
      if (!route.params?.datum_zapisu)
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    fetchComps();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" && "padding"}
      className="items-center justify-center flex-1 bg-orange-50"
    >
      <Text className="text-4xl text-center">
        {route.params?.edit ? "Edit Result" : "Add Result"}
      </Text>
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
          className="bg-slate-200 py-2 px-5"
          placeholderStyle={{ color: "gray" }}
          zIndex={100}
          onOpen={() => {
            handleError(null, "id_sutaz");
          }}
          style={{
            borderColor: errors.id_sutaz && "red",
            borderWidth: errors.id_sutaz && 1,
            borderRadius: 0,
          }}
        />
        {errors.id_sutaz && (
          <Text className="text-red-500 text-[12px] mt-1">
            {errors.id_sutaz}
          </Text>
        )}

        {compValue && (
          <>
            <DropDownPicker
              maxHeight={170}
              open={timelineOpen}
              value={inputs.id_timeline || timelineValue}
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
              className="bg-slate-200 py-2 px-5"
              containerStyle={{ marginTop: 16 }}
              placeholderStyle={{ color: "gray" }}
              zIndex={90}
              onOpen={() => {
                handleError(null, "id_timeline");
              }}
              style={{
                borderColor: errors.id_timeline && "red",
                borderWidth: errors.id_timeline && 1,
                borderRadius: 0,
              }}
            />
            {errors.id_timeline && (
              <Text className="text-red-500 text-[12px] mt-1">
                {errors.id_timeline}
              </Text>
            )}
          </>
        )}

        {timelineValue && (
          <View className="mt-5 flex-row items-center space-x-10">
            <View className="w-1/3">
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
            </View>
            {tim2 && (
              <View className="w-1/3">
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
        )}
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

export default AddResultAdminScreen;
