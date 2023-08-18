import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useRef, useState, useEffect } from "react";
import Input from "../components/Input";
import useAuth from "../context/AuthContext";
import DropDownPicker from "react-native-dropdown-picker";
import Spinner from "react-native-loading-spinner-overlay/lib";
import axios from "axios";
import { BASE_URL } from "../url";
import Button from "../components/Button";
import DateField from "react-native-datefield";
import * as Crypto from "expo-crypto";
import PhoneInput from "react-native-phone-input";

const RegisterScreen = ({ navigation }) => {
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (value !== "Competitor") {
      inputs.datum_narodenia = "";
    }
    if (value !== "Mentor" && value !== "Competitor") {
      inputs.organizacia = null;
    }
    if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Enter valid email", "email");
      valid = false;
    }
    if (!inputs.email) {
      handleError("Enter email", "email");
      valid = false;
    }
    if (!inputs.meno) {
      handleError("Enter first name", "meno");
      valid = false;
    }
    if (!inputs.priezvisko) {
      handleError("Enter last name", "priezvisko");
      valid = false;
    }
    if (!inputs.adresa_domu) {
      handleError("Enter address", "adresa_domu");
      valid = false;
    }
    if (!phoneInput.current?.isValidNumber()) {
      handleError("Enter valid phone number", "telefon");
      valid = false;
    }
    if (!inputs.telefon) {
      handleError("Enter phone number", "telefon");
      valid = false;
    }
    if (inputs.heslo.length < 8) {
      handleError("Minimum length of password is 8", "heslo");
      valid = false;
    }
    if (!inputs.heslo) {
      handleError("Enter password", "heslo");
      valid = false;
    }
    if (!inputs.rola) {
      handleError("Enter role", "rola");
      valid = false;
    }
    if (value === "Competitor" && !inputs.datum_narodenia) {
      handleError("Enter date of birth", "datum_narodenia");
      valid = false;
    }
    if ((value === "Competitor" || value === "Mentor") && !inputs.organizacia) {
      handleError("Enter the organization", "organizacia");
      valid = false;
    }

    axios
      .post(`${BASE_URL}/duplicateEmail`, { email: inputs.email })
      .then((res) => {
        if (res.data.length !== 0) {
          valid = false;
          handleError("User already exists", "email");
        }
      })
      .then(async () => {
        if (valid) {
          const digest = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            inputs.heslo
          );
          await register(inputs, digest);
        }
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  const phoneInput = useRef();

  const [inputs, setInputs] = useState({
    meno: "",
    priezvisko: "",
    adresa_domu: "",
    telefon: "",
    email: "",
    heslo: "",
    rola: "",
    datum_narodenia: "",
    organizacia: "",
  });
  const [errors, setErrors] = useState({});

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Competitor", value: "Competitor" },
    { label: "Referee", value: "Referee" },
    { label: "Organizer", value: "Organizer" },
    { label: "Volunteer", value: "Volunteer" },
    { label: "Mentor", value: "Mentor" },
  ]);

  const [organizaciaOpen, setOrganizaciaOpen] = useState(false);
  const [organizaciaValue, setOrganizaciaValue] = useState(null);
  const [organizaciaItems, setOrganizaciaItems] = useState([]);

  const { isLoading, register } = useAuth();

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const fetchOrganizacia = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/organizacia`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_organizacia,
          label: `${data[i].nazov} · ${data[i].stat}`,
        });
      }
      setOrganizaciaItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchOrganizacia();
  }, []);

  return (
    <View className="flex-1 bg-orange-50">
      <SafeAreaView className="mt-12">
        <Spinner visible={isLoading} />
        <ScrollView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
            <Text className="text-4xl text-center">Register</Text>

            <View className="items-center">
              <View className="w-4/5 mt-7">
                <Input
                  autoComplete="name"
                  placeholder="First name"
                  error={errors.meno}
                  onChangeText={(text) => {
                    handleChange(text, "meno");
                    handleError(null, "meno");
                  }}
                />
                <Input
                  autoComplete="name"
                  placeholder="Last name"
                  error={errors.priezvisko}
                  onChangeText={(text) => {
                    handleChange(text, "priezvisko");
                    handleError(null, "priezvisko");
                  }}
                />
                <Input
                  autoComplete="email"
                  placeholder="Email"
                  error={errors.email}
                  onChangeText={(text) => {
                    handleChange(text, "email");
                    handleError(null, "email");
                  }}
                />
                <Input
                  autoComplete="password-new"
                  placeholder="Password"
                  error={errors.heslo}
                  password
                  onChangeText={(text) => {
                    handleChange(text, "heslo");
                    handleError(null, "heslo");
                  }}
                />
                <DropDownPicker
                  maxHeight={170}
                  open={open}
                  value={value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  onSelectItem={(item) => {
                    handleChange(item.value, "rola");
                  }}
                  setItems={setItems}
                  listMode="SCROLLVIEW"
                  placeholder="Role"
                  className="bg-slate-200 py-2 px-5"
                  containerStyle={{ marginTop: 16 }}
                  placeholderStyle={{ color: "gray" }}
                  zIndex={150}
                  error={errors.rola}
                  onOpen={() => {
                    handleError(null, "rola");
                  }}
                  style={{
                    borderColor: errors.rola && "red",
                    borderWidth: errors.rola && 1,
                    borderRadius: 0,
                  }}
                />
                {errors.rola && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.rola}
                  </Text>
                )}
                <Input
                  autoComplete="postal-address"
                  placeholder="Address"
                  error={errors.adresa_domu}
                  onChangeText={(text) => {
                    handleChange(text, "adresa_domu");
                    handleError(null, "adresa_domu");
                  }}
                />

                <PhoneInput
                  ref={phoneInput}
                  initialCountry={"sk"}
                  initialValue={inputs.telefon}
                  onChangePhoneNumber={(text) => {
                    handleChange(text, "telefon");
                    handleError(null, "telefon");
                  }}
                  style={{
                    backgroundColor: "#e2e8f0",
                    marginTop: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 16,
                    borderColor: errors.telefon && "red",
                    borderWidth: errors.telefon && 1,
                    borderRadius: 0,
                  }}
                  textProps={{
                    placeholder: "Phone number",
                  }}
                  autoFormat={true}
                />
                {errors.telefon && (
                  <Text className="text-red-500 text-[12px] mt-1">
                    {errors.telefon}
                  </Text>
                )}

                {value === "Competitor" && (
                  <>
                    <Text className="my-4">Date of Birth:</Text>
                    <DateField
                      maximumDate={new Date()}
                      labelDate="Day"
                      labelMonth="Month"
                      labelYear="Year"
                      onSubmit={(value) => {
                        handleChange(value, "datum_narodenia");
                        handleError(null, "datum_narodenia");
                      }}
                      containerStyle={{ flex: 1, flexDirection: "row" }}
                      styleInput={{
                        width: "30%",
                        backgroundColor: "#e2e8f0",
                        height: 45,
                        borderColor: errors.datum_narodenia && "red",
                        borderWidth: errors.datum_narodenia && 1,
                        borderRadius: 0,
                      }}
                    />
                    {errors.datum_narodenia && (
                      <Text className="text-red-500 text-[12px] mt-1">
                        {errors.datum_narodenia}
                      </Text>
                    )}
                  </>
                )}

                {(value === "Competitor" || value === "Mentor") && (
                  <>
                    <DropDownPicker
                      maxHeight={170}
                      open={organizaciaOpen}
                      value={organizaciaValue}
                      items={organizaciaItems}
                      setOpen={setOrganizaciaOpen}
                      setValue={setOrganizaciaValue}
                      onSelectItem={(item) =>
                        handleChange(item.value, "organizacia")
                      }
                      setItems={setOrganizaciaItems}
                      listMode="SCROLLVIEW"
                      placeholder="Organization"
                      className="bg-slate-200 py-2 px-5"
                      containerStyle={{ marginTop: 16 }}
                      placeholderStyle={{ color: "gray" }}
                      zIndex={90}
                      error={errors.organizacia}
                      onOpen={() => {
                        handleError(null, "organizacia");
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
                  </>
                )}
              </View>

              <View className="w-4/5 mt-9 mb-4 space-y-6 items-center">
                <Button text="Register" onPress={validate} type="primary" />

                <View className="flex-row mb-3 items-center">
                  <Text className="text-gray-500 ">Have an account? </Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Login");
                    }}
                    activeOpacity={0.5}
                  >
                    <Text className="text-orange-400 font-bold">Sign in</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default RegisterScreen;
