import { View, Text, Pressable } from "react-native";
import React from "react";
import Input from "../components/Input";
import { useState } from "react";
import { Keyboard } from "react-native";

const ForgotPasswordScreen = ({ navigation }) => {
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!email) {
      handleError("Zadaj email", "email");
      valid = false;
    }
    if (!email.match(/\S+@\S+\.\S+/)) {
      handleError("Zadaj validny email", "email");
      valid = false;
    }

    if (valid) {
      navigation.navigate("ResetPassword");
    }
  };

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-3xl">Reset Password</Text>
      <View className="w-4/5 mt-10">
        <Input
          placeholder="Email"
          error={errors.email}
          onChangeText={(text) => {
            setEmail(text);
            handleError(null, "email");
          }}
        />

        <Pressable
          className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow mt-8"
          activeOpacity={0.5}
          onPress={validate}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ForgotPasswordScreen;
