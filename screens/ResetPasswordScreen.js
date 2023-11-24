import { View, Text, TouchableOpacity, Pressable } from "react-native";
import React from "react";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { StyleSheet } from "react-native";
import { useState } from "react";
import ResendTimer from "../components/ResendTimer";

const CELL_COUNT = 4;

const ResetPasswordScreen = () => {
  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [activeResend, setActiveResend] = useState(false);
  const [resendStatus, setResendStatus] = useState("Resend");
  const [resendingEmail, setResendingEmail] = useState(false);

  const validate = () => {};

  const resendEmail = async (triggerTimer) => {
    try {
      setResendingEmail(true);
      //make req to backend
      //update setResendStatus() to failed or sent
      setResendingEmail(false);
      setTimeout(() => {
        setResendStatus("Resend");
        setActiveResend(false);
        triggerTimer();
      }, 5000);
    } catch (error) {
      setResendingEmail(false);
      setResendStatus("Failed");
      alert("Email Resend Failed: " + error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl text-center p-5">
        Enter the 4-digit code sent to your email
      </Text>
      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={setValue}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            // Make sure that you pass onLayout={getCellOnLayoutHandler(index)} prop to root component of "Cell"
            onLayout={getCellOnLayoutHandler(index)}
            key={index}
            style={[styles.cellRoot, isFocused && styles.focusCell]}
          >
            <Text style={styles.cellText}>
              {symbol || (isFocused ? <Cursor /> : null)}
            </Text>
          </View>
        )}
      />
      <View className="w-4/5 mt-10">
        <Pressable
          className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow mt-8"
          activeOpacity={0.5}
          onPress={validate}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </Pressable>
        <ResendTimer
          setActiveResend={setActiveResend}
          activeResend={activeResend}
          resendStatus={resendStatus}
          resendEmail={resendEmail}
          resendingEmail={resendingEmail}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { padding: 20, minHeight: 300 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: "auto",
    marginRight: "auto",
  },
  cellRoot: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  cellText: {
    color: "#000",
    fontSize: 36,
    textAlign: "center",
  },
  focusCell: {
    borderBottomColor: "#007AFF",
    borderBottomWidth: 2,
  },
});

export default ResetPasswordScreen;
