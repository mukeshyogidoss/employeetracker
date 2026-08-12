import { useFonts } from "expo-font";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMPLOYEE VISIT TRACKER</Text>

      <LottieView
        source={require("../assets/images/Employee.json")}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* Yellow Box */}
      <View style={styles.loginBox}>
        <Text style={styles.description}>
          Manage your client visits easily, track visit details, locations,
          remarks, and stay organized wherever you go.
        </Text>
        <TouchableOpacity
          style={styles.startedBtn}
          onPress={() => router.push("/LoginScreen")}
        >
          <Text
            style={{
              fontFamily: "AmazonMedium",
              color: "#fff",
              fontSize: wp(4.5),
            }}
          >
            Get Started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfcfc",
    justifyContent: "center",
    alignItems: "center",
  },

  animation: {
    width: wp(120),
    height: hp(120),
    bottom: hp(7),
    left: wp(3),
  },

  title: {
    position: "absolute",
    top: hp(15),
    textAlign: "center",
    fontFamily: "AmazonBold",
    fontSize: wp(6.7),
    zIndex: 2,
  },

  loginBox: {
    position: "absolute",
    left: 0,
    right: 0,

    bottom: hp(-10.5),
    height: hp(55),
    backgroundColor: "#e6ca42",
    paddingVertical: hp(22.23),
    borderRadius: wp(9),
    zIndex: 1,
  },

  description: {
    position: "absolute",
    top: hp(8),
    left: wp(8),
    right: wp(8),
    textAlign: "center",
    fontFamily: "OutfitSemi",
    fontSize: wp(4.2),
    lineHeight: hp(3),
    color: "#112c49",
  },
  startedBtn: {
    position: "absolute",
    top: hp(25),
    left: wp(25),
    right: wp(8),
    backgroundColor: "#8d7b18",
    alignItems: "center",
    justifyContent: "center",
    width: wp(55),
    height: hp(6),
    borderRadius: wp(4.4),
  },
});
