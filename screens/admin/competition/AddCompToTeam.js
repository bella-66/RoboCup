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

const AddCompToTeam = ({ route }) => {
  const { id_sutaz } = route.params;
  const [teamOpen, setTeamOpen] = useState(false);
  const [teamValue, setTeamValue] = useState(null);
  const [teamItems, setTeamItems] = useState([]);
  const [errors, setErrors] = useState({});

  const handleError = (input, msg) => {
    setErrors((prevState) => ({ ...prevState, [input]: msg }));
  };

  const fetchTeams = async () => {
    try {
      const { data } = await axios.get(
        `${BASE_URL}/competition/compToTeam/${id_sutaz}`
      );
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_tim,
          label: `${data[i].nazov} · ${data[i].orgNazov}`,
        });
      }
      setTeamItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (!teamValue) {
      valid = false;
      handleError("team", "Enter the team");
    }
    if (valid) {
      await axios
        .post(`${BASE_URL}/team/sutazTim`, {
          id_sutaz,
          teamValue,
        })
        .then((res) => {
          Toast.show("Team added to competition successfully!", Toast.SHORT);
          setTeamValue("");
          fetchTeams();
        })
        .catch((err) => {
          Alert.alert("Oops!", "Something went wrong.");
        });
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <KeyboardAvoidingView className="items-center justify-center flex-1 bg-white">
      <Text className="text-2xl text-center">Add Team To Competition</Text>

      <View className="w-4/5 mt-10">
        <DropDownPicker
          maxHeight={170}
          open={teamOpen}
          value={teamValue}
          items={teamItems}
          setOpen={setTeamOpen}
          setValue={setTeamValue}
          setItems={setTeamItems}
          listMode="SCROLLVIEW"
          placeholder="Team"
          className="bg-inputBackground py-2.5 px-5 rounded-md"
          containerStyle={{ marginTop: 16 }}
          placeholderStyle={{ color: "#9ca3af" }}
          zIndex={90}
          error={errors.team}
          onOpen={() => {
            handleError("team", null);
          }}
          style={{
            borderColor: errors.team ? "red" : "#949494",
          }}
        />
        {errors.team && (
          <Text className="text-error text-[12px] mt-1">{errors.team}</Text>
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

export default AddCompToTeam;
