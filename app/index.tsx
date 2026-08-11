import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";

import { router } from "expo-router";

export default function Index() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [user, setUser] = useState([]);
  const checkUser = async () => {
    const user = await AsyncStorage.getItem("user");

    if (user) {
      router.replace("./HomeScreen");
    }
  };
  useEffect(() => {
    checkUser();
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://192.168.1.8:8080/api/v2/users");
      setUser(response.data?.users);
    } catch (error) {
      console.log("Error while fetching Data : ", error);
    }
  };

  const postUsers = async () => {
    if (email.length == 0 || password.length == 0) {
      return Alert.alert("Ooops", "Please enter all details");
    }
    try {
      const response = await axios.post(
        "http://192.168.0.19:8080/api/v2/createuser",
        { email: email, password: password },
      );
      console.log("User Added : ", response.data);
      setPassword("");
      setEmail("");
      Alert.alert("Sucesss!!!", "Data is sent to Backend");
      await AsyncStorage.setItem("user", JSON.stringify(response.data));

      router.replace("/HomeScreen");

      //This is for to get  the Updated users INstantyl on the Screeen
      getUsers();
    } catch (error) {
      console.log("Error Occured from create Post User API");
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flex: 1,
        backgroundColor: "#fdfcfc",
      }}
    >
      <Text
        style={{
          display: "flex",

          top: 90,
          textAlign: "center",
          fontWeight: "900",
          fontSize: wp(7),
        }}
      >
        Employee Visit Tracker
      </Text>
      <Image
        style={{
          width: wp(100),
          height: hp(100),
          resizeMode: "contain",
          right: 0,
          bottom: hp(9),
        }}
        source={require("../assets/images/employee.jpg")}
      />
      <View
        style={{
          // flex: 1,
          backgroundColor: "#e96655",
          display: "flex",
          zIndex: 1,
          bottom: hp(40),
          padding: 0,
          paddingVertical: 130,
          borderRadius: 35,
        }}
      >
        <TextInput
          style={[styles.textInput, { marginTop: -60 }]}
          placeholder="Enter you Email...."
          value={email}
          onChangeText={(val) => setEmail(val)}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter you Password..."
          value={password}
          secureTextEntry={true}
          onChangeText={(val) => setPassword(val)}
        />
        {/* <Button title="Click Me" onPress={postUsers} /> */}
        <TouchableOpacity
          style={{
            backgroundColor: "#112c49",
            paddingVertical: 14,
            marginHorizontal: wp(23),
            borderRadius: 8,
            alignItems: "center",
            marginTop: 20,
          }}
          onPress={postUsers}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#c7c1c1",
    width: wp(80),
    marginBottom: hp(3),
    marginLeft: 40,
    borderWidth: wp(0.5),
  },
});
