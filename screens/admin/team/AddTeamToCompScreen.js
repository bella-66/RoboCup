import {
  View,
  Text,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { BASE_URL } from "../../../url";
import axios from "axios";
import Toast from "react-native-simple-toast";

const AddTeamToCompScreen = ({ route }) => {
  const { id_tim } = route.params;
  const [sutazOpen, setSutazOpen] = useState(false);
  const [sutazValue, setSutazValue] = useState(null);
  const [sutazItems, setSutazItems] = useState([]);

  const [errors, setErrors] = useState({});

  const handleError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState, [input]: msg }));
  };

  const fetchCompetitions = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/competition/teamToComp/${id_tim}`
      );
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_sutaz,
          label: `${data[i].nazov}`,
        });
      }
      setSutazItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!sutazValue) {
      valid = false;
      handleError("sutaz", "Enter the competition");
    }
    if (valid) {
      await axios
        .post(`${BASE_URL}/team/timSutaz`, {
          id_tim,
          sutazValue,
        })
        .then((res) => {
          Toast.show("Team added to competition successfully!", Toast.SHORT);
          setSutazValue("");
          fetchCompetitions();
        })
        .catch((err) => {
          Alert.alert("Oops!", "Something went wrong.");
        });
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);

  return (
    <KeyboardAvoidingView className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl text-center">Add Team To Competition</Text>

      <View className="w-4/5 mt-10">
        <DropDownPicker
          maxHeight={170}
          open={sutazOpen}
          value={sutazValue}
          items={sutazItems}
          setOpen={setSutazOpen}
          setValue={setSutazValue}
          setItems={setSutazItems}
          listMode="SCROLLVIEW"
          placeholder="Competition"
          className="bg-inputBackground py-2.5 px-5 rounded-md"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "#9ca3af" }}
          zIndex={90}
          error={errors.sutaz}
          onOpen={() => {
            handleError("sutaz", null);
          }}
          style={{
            borderColor: errors.sutaz ? "red" : "#949494",
          }}
        />
        {errors.sutaz && (
          <Text className="text-error text-[12px] mt-1">{errors.sutaz}</Text>
        )}
      </View>
      <View className="w-4/5 mt-8 mb-5">
        <TouchableOpacity
          onPress={validate}
          className="w-full shadow-xl px-2 py-3 bg-primary rounded-md shadow-shadow"
          activeOpacity={0.5}
        >
          <Text className="text-center text-white font-bold">Submit</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddTeamToCompScreen;
