import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

const ResendTimer = ({
  activeResend,
  setActiveResend,
  targetTimeInSeconds,
  resendEmail,
  resendStatus,
  ...props
}) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [targetTime, setTargetTime] = useState(null);

  let resendTimerInterval;

  const triggerTimer = (targetTimeInSeconds = 30) => {
    setTargetTime(targetTimeInSeconds);
    setActiveResend(false);
    const finalTime = +new Date() + targetTimeInSeconds * 1000;
    resendTimerInterval = setInterval(() => calculateTimeLeft(finalTime), 1000);
  };

  const calculateTimeLeft = (finalTime) => {
    const difference = finalTime - +new Date();
    if (difference >= 0) {
      setTimeLeft(Math.round(difference / 1000));
    } else {
      clearInterval(resendTimerInterval);
      setActiveResend(true);
      setTimeLeft(null);
    }
  };

  useEffect(() => {
    triggerTimer(targetTimeInSeconds);

    return () => {
      clearInterval(resendTimerInterval);
    };
  }, []);

  return (
    <View>
      <Text>Did not recieve the email?</Text>
      {/* <TouchableOpacity
        onPress={() => resendEmail(triggerTimer)}
        activeOpacity={0.5}
        disabled={!activeResend}
        style={{ opacity: !activeResend ? 0.65 : 1 }}
      >
        <Text>{resendStatus}</Text>
      </TouchableOpacity> */}
      {!activeResend && (
        <>
          <Text>in {timeLeft || targetTime} second(s)</Text>
        </>
      )}
    </View>
  );
};

export default ResendTimer;
