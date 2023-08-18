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
    <View className="mt-4">
      <View
        className="flex-row bg-slate-200 py-2 px-5 border items-center"
        style={{
          borderColor: error ? "red" : isFocused ? "#475569" : "transparent",
        }}
      >
        <TextInput
          autoCorrect={false}
          secureTextEntry={hidePassword}
          className="flex-1"
          placeholder={placeholder}
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
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            size={20}
          />
        )}
      </View>
      {error && <Text className="text-red-500 text-[12px] mt-1">{error}</Text>}
    </View>
  );
};

export default Input;
