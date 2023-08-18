import { Text, View } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";

const ResultCard = ({
  id_timeline,
  druh_operacie,
  datum_a_cas,
  tim1,
  tim2,
  vysledok_1,
  vysledok_2,
}) => {
  const navigation = useNavigation();

  return (
    <View className="my-3 mx-5 space-x-7">
      <View className="">
        <View className="flex-1">
          {druh_operacie === "Match" ? (
            <Text className="text-lg">
              <Text>
                <Text>{tim1}</Text>
                <Text className="font-semibold"> {vysledok_1} : </Text>
                {tim2 && (
                  <Text className="font-semibold">
                    {vysledok_2}{" "}
                    <Text className="font-normal">NimbRo AdultSiz</Text>
                  </Text>
                )}
              </Text>
            </Text>
          ) : (
            <Text className="text-lg">
              <Text>
                {tim1} - <Text className="font-semibold">{vysledok_1}</Text>
              </Text>
              {tim2 && (
                <Text>
                  {tim2} - <Text className="font-semibold">{vysledok_2}</Text>
                </Text>
              )}
            </Text>
          )}
        </View>

        <View>
          <Text className="text-lg">
            {"("}
            {moment(datum_a_cas).format("D/M/yyyy")} ·{" "}
            {moment(datum_a_cas).format("H:mm")}
            {")"}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ResultCard;
