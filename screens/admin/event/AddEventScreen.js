import {
  View,
  Text,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState, useLayoutEffect } from "react";
import Input from "../../../components/Input";
import DateTimePicker from "react-native-modal-datetime-picker";
import axios from "axios";
import { BASE_URL } from "../../../url";
import moment from "moment";
import DropDownPicker from "react-native-dropdown-picker";
import Toast from "react-native-simple-toast";
import { SafeAreaView } from "react-native-safe-area-context";

const AddEventScreen = ({ navigation, route }) => {
  const [inputs, setInputs] = useState({
    nazov: route.params?.nazov || "",
    datum_od: route.params?.datum_od || "",
    datum_do: route.params?.datum_do || "",
    charakteristika: route.params?.charakteristika || "",
    id_realizator: route.params?.id_realizator || "",
    id_organizatori: route.params?.id_organizatori || [],
    id_osoby: route.params?.id_osoby || [],
  });
  const [errors, setErrors] = useState({});

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params?.id_realizator || null);
  const [items, setItems] = useState([]);

  const [openOrganizatori, setOpenOrganizatori] = useState(false);
  const [valueOrganizatori, setValueOrganizatori] = useState(
    route.params?.id_organizatori || []
  );
  const [itemsOrganizatori, setItemsOrganizatori] = useState([]);

  const [openOsoby, setOpenOsoby] = useState(false);
  const [valueOsoby, setValueOsoby] = useState(route.params?.id_osoby || []);
  const [itemsOsoby, setItemsOsoby] = useState([]);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleConfirm = (date) => {
    handleChange(date, "datum_od");
    hideDatePicker();
  };
  const [isDatePicker2Visible, setDatePicker2Visibility] = useState(false);
  const hideDatePicker2 = () => {
    setDatePicker2Visibility(false);
  };
  const handleConfirm2 = (date) => {
    handleChange(date, "datum_do");
    hideDatePicker2();
  };

  const fetchRealizator = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/realizator`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_organizacia,
          label: `${data[i].nazov} · ${data[i].druh}`,
        });
      }
      setItems(arr);
      setItemsOrganizatori(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchOsoby = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/event/osoby`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_osoba,
          label: `${data[i].meno} ${data[i].priezvisko}`,
        });
      }
      setItemsOsoby(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.nazov) {
      handleError("Enter name", "nazov");
      valid = false;
    }
    if (!inputs.datum_od) {
      handleError("Enter start date", "datum_od");
      valid = false;
    }
    if (!inputs.datum_do) {
      handleError("Enter end date", "datum_do");
      valid = false;
    }
    if (inputs.datum_do < inputs.datum_od) {
      handleError("Enter valid end date", "datum_do");
      valid = false;
    }
    if (!inputs.charakteristika) {
      handleError("Enter the description", "charakteristika");
      valid = false;
    }
    if (!inputs.id_realizator) {
      handleError("Enter the main organizer", "id_realizator");
      valid = false;
    }
    if (valid) {
      const convertedToLocalTime = moment(inputs.datum_od)
        .utcOffset(new Date(inputs.datum_od).getTimezoneOffset() / -1)
        .format();
      inputs.datum_od = convertedToLocalTime;
      const convertedToLocalTime2 = moment(inputs.datum_do)
        .utcOffset(new Date(inputs.datum_do).getTimezoneOffset() / -1)
        .format();
      inputs.datum_do = convertedToLocalTime2;

      if (route.params?.edit) {
        await axios
          .put(`${BASE_URL}/event`, {
            inputs,
            id_event: route.params.id_event,
          })
          .then((res) => {
            Toast.show("Event updated successfully!", Toast.SHORT);
          })
          .catch((error) => {
            Alert.alert("Oops!", "Something went wrong.");
          });
      } else {
        await axios
          .post(`${BASE_URL}/event`, inputs)
          .then((res) => {
            Toast.show("Event added successfully!", Toast.SHORT);
            setInputs({
              nazov: "",
              charakteristika: "",
              datum_do: "",
              datum_od: "",
              id_realizator: "",
              id_organizatori: [],
              id_osoby: [],
            });
            setValue(null);
            setValueOrganizatori([]);
            setValueOsoby([]);
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

  useEffect(() => {
    fetchRealizator();
    fetchOsoby();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View className="flex-1 bg-orange-50">
      <SafeAreaView className="mt-10">
        <ScrollView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
            <Text className="text-4xl text-center">
              {route.params?.edit ? "Edit Event" : "Add Event"}
            </Text>
            <View className="items-center">
              <View className="w-4/5 mt-10">
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

                <View>
                  <Text className="mt-4 font-semibold">Date from</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDatePickerVisibility(true);
                      handleError(null, "datum_od");
                    }}
                  >
                    <Input
                      editable={false}
                      value={
                        inputs.datum_od
                          ? moment(inputs.datum_od).format("DD/MM/yyyy")
                          : "No date is picked"
                      }
                      error={errors.datum_od}
                      className="text-gray-900"
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isDatePickerVisible}
                    mode="date"
                    date={
                      inputs.datum_od ? new Date(inputs.datum_od) : new Date()
                    }
                    onCancel={hideDatePicker}
                    onConfirm={handleConfirm}
                  />
                </View>

                <View>
                  <Text className="mt-4 font-semibold">Date to</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setDatePicker2Visibility(true);
                      handleError(null, "datum_do");
                    }}
                  >
                    <Input
                      editable={false}
                      value={
                        inputs.datum_do
                          ? moment(inputs.datum_do).format("DD/MM/yyyy")
                          : "No date is picked"
                      }
                      error={errors.datum_do}
                      className="text-gray-900"
                    />
                  </TouchableOpacity>
                  <DateTimePicker
                    isVisible={isDatePicker2Visible}
                    mode="date"
                    date={
                      inputs.datum_do ? new Date(inputs.datum_do) : new Date()
                    }
                    onCancel={hideDatePicker2}
                    onConfirm={handleConfirm2}
                  />
                </View>

                <Input
                  maxLength={200}
                  multiline={true}
                  value={inputs.charakteristika}
                  autoComplete="off"
                  placeholder="Description"
                  error={errors.charakteristika}
                  onChangeText={(text) => {
                    handleChange(text, "charakteristika");
                    handleError(null, "charakteristika");
                  }}
                  onSubmitEditing={validate}
                />

                <DropDownPicker
                  maxHeight={170}
                  open={open}
                  value={inputs.id_realizator || value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  onSelectItem={(item) =>
                    handleChange(item.value, "id_realizator")
                  }
                  setItems={setItems}
                  listMode="SCROLLVIEW"
                  placeholder="Main organizer"
                  className="bg-slate-200 py-2 px-5"
                  containerStyle={{ marginTop: 16 }}
                  placeholderStyle={{ color: "gray" }}
                  zIndex={150}
                  error={errors.id_realizator}
                  onOpen={() => {
                    handleError(null, "id_realizator");
                  }}
                  style={{
                    borderColor: errors.id_realizator && "red",
                    borderWidth: errors.id_realizator && 1,
                    borderRadius: 0,
                  }}
                />
                {errors.id_realizator && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.id_realizator}
                  </Text>
                )}

                <DropDownPicker
                  maxHeight={170}
                  multiple={true}
                  mode="BADGE"
                  badgeDotColors={["#e76f51"]}
                  open={openOrganizatori}
                  value={valueOrganizatori}
                  items={itemsOrganizatori}
                  setOpen={setOpenOrganizatori}
                  setValue={setValueOrganizatori}
                  setItems={setItemsOrganizatori}
                  onChangeValue={(item) => {
                    inputs.id_organizatori = item;
                  }}
                  listMode="SCROLLVIEW"
                  placeholder="Organizers"
                  className="bg-slate-200 py-2 px-5"
                  containerStyle={{ marginTop: 16 }}
                  placeholderStyle={{ color: "gray" }}
                  zIndex={100}
                  style={{
                    borderColor: errors.id_organizatori && "red",
                    borderWidth: errors.id_organizatori && 1,
                    borderRadius: 0,
                  }}
                  error={errors.id_organizatori}
                  onOpen={() => {
                    handleError(null, "id_organizatori");
                  }}
                />
                {errors.id_organizatori && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.id_organizatori}
                  </Text>
                )}

                <DropDownPicker
                  maxHeight={170}
                  multiple={true}
                  mode="BADGE"
                  badgeDotColors={["#e76f51"]}
                  open={openOsoby}
                  value={valueOsoby}
                  items={itemsOsoby}
                  setOpen={setOpenOsoby}
                  setValue={setValueOsoby}
                  setItems={setItemsOsoby}
                  onChangeValue={(item) => {
                    inputs.id_osoby = item;
                  }}
                  listMode="SCROLLVIEW"
                  placeholder="People responsible for organizing"
                  className="bg-slate-200 py-2 px-5"
                  containerStyle={{ marginTop: 16 }}
                  placeholderStyle={{ color: "gray" }}
                  zIndex={90}
                  style={{
                    borderColor: errors.id_osoby && "red",
                    borderWidth: errors.id_osoby && 1,
                    borderRadius: 0,
                  }}
                  error={errors.id_osoby}
                  onOpen={() => {
                    handleError(null, "id_osoby");
                  }}
                />
                {errors.id_osoby && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.id_osoby}
                  </Text>
                )}
              </View>
              <View className="w-4/5 mt-8 mb-5">
                <TouchableOpacity
                  onPress={validate}
                  className="w-full shadow-md px-2 py-3 bg-orange-400 rounded-md shadow-orange-600"
                  activeOpacity={0.5}
                >
                  <Text className="text-center text-white font-bold">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default AddEventScreen;
