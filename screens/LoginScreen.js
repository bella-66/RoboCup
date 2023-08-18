import {
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Keyboard,
  Image,
} from "react-native";
import React, { useState } from "react";
import Input from "../components/Input";
import useAuth from "../context/AuthContext";
import Spinner from "react-native-loading-spinner-overlay/lib";
import * as Crypto from "expo-crypto";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const Login = ({ navigation }) => {
  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!email.match(/\S+@\S+\.\S+/)) {
      handleError("Enter a valid email", "email");
      valid = false;
    }
    if (!email) {
      handleError("Enter an email", "email");
      valid = false;
    }
    if (password.length < 8) {
      handleError("Minimum length of password is 8", "password");
      valid = false;
    }
    if (!password) {
      handleError("Enter a password", "password");
      valid = false;
    }
    if (valid) {
      const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        password
      );
      await login(email, digest);
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { isLoading, login, userInfo, continueWithoutAccount } = useAuth();

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  return (
    <View className="items-center bg-gray-200 flex-1">
      <StatusBar backgroundColor={"transparent"} translucent style="dark" />
      <View className="w-full h-96 absolute top-0 left-0">
        <LinearGradient
          colors={["#FEB04C", "#FD693B"]}
          style={{ width: "100%", height: "100%" }}
          start={{ x: 0, y: 0 }}
        />
      </View>

      <Image
        source={require("../assets/robot.webp")}
        style={{ height: 170, width: 170, marginBottom: 18, marginTop: 50 }}
      />

      <KeyboardAvoidingView className="w-full items-center bg-orange-50 h-full pt-10 rounded-t-[38px]">
        <Text className="text-4xl text-center">Login</Text>
        <Spinner visible={isLoading} />

        <View className="w-4/5 mt-8">
          <Input
            autoComplete="email"
            placeholder="Email"
            error={errors.email}
            onChangeText={(text) => {
              setEmail(text);
              handleError(null, "email");
            }}
          />
          <Input
            placeholder="Password"
            error={errors.password}
            password
            onChangeText={(text) => {
              setPassword(text);
              handleError(null, "password");
            }}
            onSubmitEditing={validate}
          />

          {/* <TouchableOpacity
            onPress={() => {
              navigation.navigate("ForgotPassword");
            }}
            activeOpacity={0.5}
            className="mt-3"
          >
            <Text className="text-xs text-orange-400 self-end font-semibold">
              Forgot your password?
            </Text>
          </TouchableOpacity> */}
        </View>

        <View className="w-4/5 items-center justify-center gap-5 mt-6">
          <TouchableOpacity
            activeOpacity={0.5}
            className="w-full shadow-xl px-2 py-3 bg-orange-400 rounded-md shadow-orange-600"
            onPress={validate}
          >
            <Text className="text-center text-white font-bold">Login</Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                navigation.navigate("Register");
              }}
            >
              <Text className="text-orange-400 font-bold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
