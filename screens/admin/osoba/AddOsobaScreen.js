import axios from "axios";
import { useLayoutEffect, useRef, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform,
  Keyboard,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import { BASE_URL } from "../../../url";
import * as Crypto from "expo-crypto";
import DateField from "react-native-datefield";
import moment from "moment";
import PhoneInput from "react-native-phone-input";
import Toast from "react-native-simple-toast";

const AddOsobaScreen = ({ navigation, route }) => {
  const validate = async () => {
    Keyboard.dismiss();
    let valid = true;
    if (value !== "Competitor") {
      inputs.datum_narodenia = "";
    }
    if (value !== "Mentor" && value !== "Competitor") {
      inputs.organizacia = null;
    }
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
    if (inputs.psc.replace(" ", "").length !== 5) {
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
    if (!inputs.heslo) {
      handleError("Enter password", "heslo");
      valid = false;
    }
    if (inputs.heslo.length < 5) {
      handleError("Minimum length of password is 5", "heslo");
      valid = false;
    }
    if (!inputs.rola) {
      handleError("Enter role", "rola");
      valid = false;
    }
    if (value === "Competitor" && !inputs.datum_narodenia) {
      handleError("Enter date of birth", "datum_narodenia");
      valid = false;
    }
    if ((value === "Competitor" || value === "Mentor") && !inputs.organizacia) {
      handleError("Enter the organization", "organizacia");
      valid = false;
    }

    axios
      .post(`${BASE_URL}/duplicateEmail`, { email: inputs.email })
      .then((res) => {
        if (res.data.length !== 0 && !route.params?.edit) {
          valid = false;
          handleError("User already exists", "email");
        }
      })
      .then(async () => {
        if (valid) {
          if (inputs.organizacia == "") inputs.organizacia = null;
          if (inputs.datum_narodenia == "") inputs.datum_narodenia = null;
          else {
            const convertedToLocalTime = moment(inputs.datum_narodenia)
              .utcOffset(
                new Date(inputs.datum_narodenia).getTimezoneOffset() / -1
              )
              .format();
            inputs.datum_narodenia = convertedToLocalTime;
          }
          const obj = { ...inputs };
          if (route.params?.edit) {
            await axios
              .put(`${BASE_URL}/osoba`, [obj, route.params.id_osoba])
              .then((res) => {
                Toast.show("Updated user successfully!", Toast.SHORT);
              })
              .catch((error) => {
                Alert.alert("Oops!", "Something went wrong.");
              });
          } else {
            const digest = await Crypto.digestStringAsync(
              Crypto.CryptoDigestAlgorithm.SHA256,
              inputs.heslo
            );
            obj.heslo = digest;

            await axios
              .post(BASE_URL, obj)
              .then((res) => {
                if (inputs.tim.length != 0) {
                  inputs.tim.map((item) => {
                    axios
                      .post(`${BASE_URL}/login/tim`, {
                        id_osoba: res.data.id_osoba,
                        id_tim: item,
                      })
                      .catch((e) => {
                        Alert.alert("Oops!", "Something went wrong.");
                      });
                  });
                }
              })
              .then(() => {
                setInputs({
                  meno: "",
                  priezvisko: "",
                  mesto: "",
                  adresa_domu: "",
                  telefon: "",
                  email: "",
                  heslo: "",
                  rola: "",
                  datum_narodenia: "",
                  tim: [],
                  organizacia: "",
                });
                setValue(null);
                setTimValue([]);
                setOrganizaciaValue(null);
                Toast.show("User added successfully!", Toast.SHORT);
              })
              .catch((e) => {
                Alert.alert("Oops!", "Something went wrong.");
              });
          }
        }
      })
      .catch((error) => {
        Alert.alert("Oops!", "Something went wrong.");
      });
  };

  const [inputs, setInputs] = useState({
    meno: route.params?.meno || "",
    priezvisko: route.params?.priezvisko || "",
    mesto: route.params?.mesto || "",
    adresa_domu: route.params?.adresa_domu || "",
    psc: route.params?.psc || "",
    telefon: route.params?.telefon || "",
    email: route.params?.email || "",
    heslo: route.params?.heslo || "",
    rola: route.params?.rola || "",
    datum_narodenia: route.params?.datum_narodenia || "",
    tim: route.params?.tim || [],
    organizacia: route.params?.id_organizacie || "",
  });
  const [errors, setErrors] = useState({});

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(route.params?.rola || null);
  const [items, setItems] = useState([
    { label: "Competitor", value: "Competitor" },
    { label: "Referee", value: "Referee" },
    { label: "Organizer", value: "Organizer" },
    { label: "Volunteer", value: "Volunteer" },
    { label: "Mentor", value: "Mentor" },
    { label: "Admin", value: "Administrator" },
  ]);
  const [timOpen, setTimOpen] = useState(false);
  const [timValue, setTimValue] = useState(route.params?.tim || []);
  const [timItems, setTimItems] = useState([]);
  const [organizaciaOpen, setOrganizaciaOpen] = useState(false);
  const [organizaciaValue, setOrganizaciaValue] = useState(
    route.params?.id_organizacie || null
  );
  const [organizaciaItems, setOrganizaciaItems] = useState([]);

  const phoneInput = useRef();

  const handleChange = (value, inputName) => {
    setInputs((prevState) => ({ ...prevState, [inputName]: value }));
  };

  const handleError = (errorMsg, inputName) => {
    setErrors((prevState) => ({ ...prevState, [inputName]: errorMsg }));
  };

  const fetchTim = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/tim`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_tim,
          label: `${data[i].nazov}`,
        });
      }
      setTimItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  const fetchOrganizacia = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/login/organizacia`);
      let arr = [];
      for (let i = 0; i < data.length; i++) {
        arr.push({
          value: data[i].id_organizacia,
          label: `${data[i].nazov} · ${data[i].druh} · ${data[i].stat}`,
        });
      }
      setOrganizaciaItems(arr);
    } catch (error) {
      Alert.alert("Oops!", "Something went wrong.");
    }
  };

  useEffect(() => {
    fetchTim();
    fetchOrganizacia();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-white justify-center">
      <View>
        <ScrollView>
          <KeyboardAvoidingView behavior={Platform.OS === "ios" && "padding"}>
            <Text className="text-4xl text-center mt-5">
              {route.params?.edit ? "Edit User" : "Add User"}
            </Text>

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

                {!route.params?.edit && (
                  <Input
                    value={inputs.heslo}
                    autoComplete="password-new"
                    placeholder="Password"
                    error={errors.heslo}
                    password
                    onChangeText={(text) => {
                      handleChange(text, "heslo");
                      handleError(null, "heslo");
                    }}
                  />
                )}

                <DropDownPicker
                  maxHeight={170}
                  open={open}
                  value={inputs.rola || value}
                  items={items}
                  setOpen={setOpen}
                  setValue={setValue}
                  onSelectItem={(item) => {
                    if (item.value !== "Competitor") {
                      inputs.datum_narodenia = "";
                    }
                    if (
                      item.value !== "Competitor" &&
                      item.value !== "Mentor"
                    ) {
                      setOrganizaciaValue(null);
                      inputs.organizacia = null;
                      setTimValue([]);
                      inputs.tim = [];
                    }
                    handleChange(item.value, "rola");
                  }}
                  setItems={setItems}
                  listMode="SCROLLVIEW"
                  placeholder="Role"
                  className="bg-inputBackground py-2.5 px-5 rounded-md"
                  containerStyle={{ marginTop: 16 }}
                  placeholderStyle={{ color: "#9ca3af" }}
                  zIndex={150}
                  error={errors.rola}
                  onOpen={() => {
                    handleError(null, "rola");
                  }}
                  style={{
                    borderColor: errors.rola ? "red" : "#949494",
                  }}
                />
                {errors.rola && (
                  <Text className="text-error text-[12px] mt-1">
                    {errors.rola}
                  </Text>
                )}
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
                  placeholder="Street address"
                  error={errors.adresa_domu}
                  onChangeText={(text) => {
                    handleChange(text, "adresa_domu");
                    handleError(null, "adresa_domu");
                  }}
                />
                <Input
                  value={inputs.psc}
                  placeholder="Zip code"
                  keyboardType="numeric"
                  error={errors.psc}
                  onChangeText={(text) => {
                    handleChange(text, "psc");
                    handleError(null, "psc");
                  }}
                />
                <PhoneInput
                  ref={phoneInput}
                  initialCountry={"sk"}
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

                {value === "Competitor" && (
                  <>
                    <Text className="my-4">Date of Birth:</Text>
                    <DateField
                      labelDate="Day"
                      labelMonth="Month"
                      labelYear="Year"
                      defaultValue={
                        route.params?.datum_narodenia
                          ? new Date(route.params?.datum_narodenia)
                          : null
                      }
                      onSubmit={(value) => {
                        handleChange(value, "datum_narodenia");
                        handleError(null, "datum_narodenia");
                      }}
                      containerStyle={{ flex: 1, flexDirection: "row" }}
                      styleInput={{
                        width: "30%",
                        backgroundColor: "#f1f5f9",
                        height: 45,
                        borderColor: errors.datum_narodenia ? "red" : "#949494",
                        borderWidth: 1,
                        borderRadius: 6,
                      }}
                    />
                    {errors.datum_narodenia && (
                      <Text className="text-error text-[12px] mt-1">
                        {errors.datum_narodenia}
                      </Text>
                    )}
                  </>
                )}

                {(value === "Competitor" || value === "Mentor") && (
                  <>
                    <DropDownPicker
                      maxHeight={170}
                      multiple={true}
                      mode="BADGE"
                      badgeDotColors={["#3b82f6"]}
                      open={timOpen}
                      value={timValue}
                      items={timItems}
                      setOpen={setTimOpen}
                      setValue={setTimValue}
                      onChangeValue={(item) => {
                        inputs.tim = item;
                      }}
                      setItems={setTimItems}
                      listMode="SCROLLVIEW"
                      placeholder="Teams"
                      className="bg-inputBackground py-2.5 px-5 rounded-md"
                      containerStyle={{ marginTop: 16 }}
                      placeholderStyle={{ color: "#9ca3af" }}
                      zIndex={100}
                      style={{
                        borderColor: errors.tim ? "red" : "#949494",
                      }}
                      error={errors.tim}
                      onOpen={() => {
                        handleError(null, "tim");
                      }}
                    />
                    {errors.tim && (
                      <Text className="text-error text-[12px] mt-1">
                        {errors.tim}
                      </Text>
                    )}
                    <DropDownPicker
                      maxHeight={170}
                      open={organizaciaOpen}
                      value={inputs.organizacia || organizaciaValue}
                      items={organizaciaItems}
                      setOpen={setOrganizaciaOpen}
                      setValue={setOrganizaciaValue}
                      onSelectItem={(item) =>
                        handleChange(item.value, "organizacia")
                      }
                      setItems={setOrganizaciaItems}
                      listMode="SCROLLVIEW"
                      placeholder="Organization"
                      className="bg-inputBackground py-2.5 px-5 rounded-md"
                      containerStyle={{ marginTop: 16 }}
                      placeholderStyle={{ color: "#9ca3af" }}
                      zIndex={90}
                      error={errors.organizacia}
                      onOpen={() => {
                        handleError(null, "organizacia");
                      }}
                      style={{
                        borderColor: errors.organizacia ? "red" : "#949494",
                      }}
                    />
                    {errors.organizacia && (
                      <Text className="text-error text-[12px] mt-1">
                        {errors.organizacia}
                      </Text>
                    )}
                  </>
                )}
              </View>

              <View className="w-4/5 mb-10 mt-9 space-y-6 items-center">
                <Button text="Submit" type="primary" onPress={validate} />
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AddOsobaScreen;
