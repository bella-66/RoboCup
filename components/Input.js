import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const Input = ({
  placeholder,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hidePassword, setHidePassword] = useState(password);

  return (
    <View className="mt-4 ">
      <View
        className="flex-row bg-slate-100 py-2.5 px-5 border items-center rounded-md"
        style={{
          borderColor: error ? "red" : isFocused ? "#2563eb" : "#949494",
        }}
      >
        <TextInput
          autoCorrect={false}
          secureTextEntry={hidePassword}
          className="flex-1"
          placeholder={placeholder}
          placeholderTextColor={"#9ca3af"}
          {...props}
          onFocus={() => {
            onFocus();
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
        {password && (
          <Icon
            onPress={() => setHidePassword(!hidePassword)}
            name={hidePassword ? "eye" : "eye-off"}
            size={20}
            color="#9ca3af"
          />
        )}
      </View>
      {error && <Text className="text-red-500 text-[12px] mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
