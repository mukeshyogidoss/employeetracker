import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
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

export default function Index() {
  const [fontsLoaded] = useFonts({
    AmazonMedium: require("../assets/images/fonts/amazon-ember-medium.ttf"),
    AmazonBold: require("../assets/images/fonts/amazon-ember-bold.ttf"),
    AmazonDisplay: require("../assets/images/fonts/amazon-ember-display-regular.ttf"),
    PromptBold: require("../assets/images/fonts/Prompt-Bold.ttf"),
    PromptBlack: require("../assets/images/fonts/Prompt-Black.ttf"),
    PromptSemiBold: require("../assets/images/fonts/Prompt-SemiBold.ttf"),
    OutfitSemi: require("../assets/images/fonts/Outfit-SemiBold.ttf"),
  });

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        router.replace("/HomeScreen");
      }
    } catch (error) {
      console.log("Check User Error:", error);
    }
  };
  if (!fontsLoaded) {
    return null;
  }

  // Login
  const login = async () => {
    const enteredEmail = email.trim();
    const enteredPassword = password.trim();

    // Empty validation
    if (enteredEmail === "" || enteredPassword === "") {
      Alert.alert("Missing Details", "Please enter email and password.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(enteredEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Static credentials
    if (enteredEmail === "admin@test.com" && enteredPassword === "123456") {
      try {
        const userData = {
          email: enteredEmail,
        };

        await AsyncStorage.setItem("user", JSON.stringify(userData));

        setEmail("");
        setPassword("");

        router.replace("/HomeScreen");
      } catch (error) {
        console.log("Login Error:", error);

        Alert.alert("Error", "Unable to login. Please try again.");
      }
    } else {
      Alert.alert("Login Failed", "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      <FontAwesome
        style={styles.profileLogo}
        name="user-circle-o"
        size={wp(30)}
        color="#33360d"
      />

      {/* Login Box */}
      <View style={styles.loginBox}>
        {/* Email */}
        <View style={[styles.emailContainer, { marginTop: -60 }]}>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your Email..."
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Ionicons
            name="mail-outline"
            size={24}
            color="#555555"
            style={styles.emailIcon}
          />
        </View>

        {/* Password */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter your Password..."
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {/* Eye Button */}
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={styles.loginButton}
          onPress={login}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d3b938",
  },

  profileLogo: {
    textAlign: "center",
    top: hp(15),
  },

  image: {
    width: wp(100),
    height: hp(100),
    resizeMode: "contain",
    position: "absolute",
    right: 0,
    bottom: hp(36),
  },

  loginBox: {
    position: "absolute",
    left: 0,
    right: 0,
    top: hp(28),
    paddingVertical: 130,
    height: hp(90),
    borderRadius: 35,
    zIndex: 1,
  },

  emailContainer: {
    backgroundColor: "#a59b3d93",
    top: hp(2.7),
    width: wp(80),
    marginBottom: hp(8),
    marginLeft: wp(10),
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  emailIcon: {
    // marginLeft: 12,
    marginRight: wp(3),
  },

  emailInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: "AmazonMedium",
  },

  passwordContainer: {
    backgroundColor: "#a59b3d93",
    width: wp(80),
    marginBottom: hp(3),
    marginLeft: wp(10),
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,

    paddingHorizontal: 15,
    fontFamily: "AmazonMedium",
    paddingVertical: 12,
    fontSize: 16,
  },

  eyeButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  loginButton: {
    backgroundColor: "#33360d",
    paddingVertical: 14,
    marginHorizontal: wp(23),
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  loginText: {
    color: "white",
    fontSize: 16,
    fontFamily: "AmazonBold",
  },
});
