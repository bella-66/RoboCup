import {
  View,
  Text,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import React, { useLayoutEffect, useRef, useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import useAuth from "../context/AuthContext";
import PhoneInput from "react-native-phone-input";

const EditProfileScreen = ({ navigation }) => {
  const { userInfo, logout, updateUserInfo } = useAuth();
  const [inputs, setInputs] = useState({
    meno: userInfo?.meno,
    priezvisko: userInfo?.priezvisko,
    mesto: userInfo?.mesto,
    adresa_domu: userInfo?.adresa_domu,
    psc: userInfo?.psc,
    telefon: userInfo?.telefon,
    email: userInfo?.email,
  });
  const [errors, setErrors] = useState({});

  const phoneInput = useRef();

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!inputs.email) {
      handleError("Enter email", "email");
      valid = false;
    }
    if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Enter valid email", "email");
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
    if (!inputs.mesto) {
      handleError("Enter town", "mesto");
      valid = false;
    }
    if (!inputs.adresa_domu) {
      handleError("Enter address", "adresa_domu");
      valid = false;
    }
    if (!inputs.psc) {
      handleError("Enter zip code", "psc");
      valid = false;
    }
    if (!inputs.psc.replace(" ", "").length === 5) {
      handleError("Enter valid zip code", "psc");
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

    if (valid) {
      updateUserInfo(inputs, userInfo.id_osoba);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1 justify-center">
      <View className="">
        <ScrollView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
            <Text className="text-4xl text-center">Edit Profile</Text>
            <View className="items-center">
              <View className="w-4/5 mt-7">
                <Input
                  value={inputs.meno}
                  autoComplete="name"
                  placeholder="First name"
                  error={errors.meno}
                  onChangeText={(text) => {
                    handleChange(text, "meno");
                    handleError(null, "meno");
                  }}
                />
                <Input
                  value={inputs.priezvisko}
                  autoComplete="name"
                  placeholder="Last name"
                  error={errors.priezvisko}
                  onChangeText={(text) => {
                    handleChange(text, "priezvisko");
                    handleError(null, "priezvisko");
                  }}
                />
                <Input
                  value={inputs.email}
                  autoComplete="email"
                  placeholder="Email"
                  error={errors.email}
                  onChangeText={(text) => {
                    handleChange(text, "email");
                    handleError(null, "email");
                  }}
                />
                <Input
                  value={inputs.mesto}
                  placeholder="Town"
                  error={errors.mesto}
                  onChangeText={(text) => {
                    handleChange(text, "mesto");
                    handleError(null, "mesto");
                  }}
                />
                <Input
                  value={inputs.adresa_domu}
                  placeholder="Street adress"
                  error={errors.adresa_domu}
                  onChangeText={(text) => {
                    handleChange(text, "adresa_domu");
                    handleError(null, "adresa_domu");
                  }}
                />
                <Input
                  placeholder="Zip code"
                  keyboardType="numeric"
                  value={inputs.psc}
                  error={errors.psc}
                  onChangeText={(text) => {
                    handleChange(text, "psc");
                    handleError(null, "psc");
                  }}
                />
                <PhoneInput
                  ref={phoneInput}
                  initialValue={inputs.telefon}
                  onChangePhoneNumber={(text) => {
                    handleChange(text, "telefon");
                    handleError(null, "telefon");
                  }}
                  style={{
                    backgroundColor: "#f1f5f9",
                    marginTop: 16,
                    paddingHorizontal: 8,
                    paddingVertical: 16,
                    borderColor: errors.telefon ? "red" : "#949494",
                    borderWidth: 1,
                    borderRadius: 6,
                  }}
                  textProps={{
                    placeholder: "Phone number",
                  }}
                  autoFormat={true}
                />
                {errors.telefon && (
                  <Text className="text-error text-[12px] mt-1">
                    {errors.telefon}
                  </Text>
                )}
              </View>
              <View className="w-4/5 mt-9 mb-10 space-y-6 items-center">
                <Button text="Submit" type="primary" onPress={validate} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
