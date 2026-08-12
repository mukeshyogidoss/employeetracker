import { Ionicons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
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

const HomeScreen = () => {
  const [fontsLoaded] = useFonts({
    AmazonMedium: require("../assets/images/fonts/amazon-ember-medium.ttf"),
    AmazonBold: require("../assets/images/fonts/amazon-ember-bold.ttf"),
    AmazonDisplay: require("../assets/images/fonts/amazon-embers-display-regular.ttf"),
    PromptBold: require("../assets/images/fonts/Prompt-Bold.ttf"),
    PromptBlack: require("../assets/images/fonts/Prompt-Black.ttf"),
    PromptSemiBold: require("../assets/images/fonts/Prompt-SemiBold.ttf"),
    OutfitSemi: require("../assets/images/fonts/Outfit-SemiBold.ttf"),
  });

  const [visits, setVisits] = useState([]);
  const [search, setSearch] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadVisits();
    }, []),
  );

  const loadVisits = async () => {
    try {
      const storedVisits = await AsyncStorage.getItem("visits");

      
    } catch (error) {
      console.log("Load Visits Error:", error);
      Alert.alert("Error", "Unable to load visits.");
    }
  };
  if (!fontsLoaded) {
    return null;
  }
  const deleteVisit = (id) => {
    Alert.alert("Delete Visit", "Are you sure you want to delete this visit?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const updatedVisits = visits.filter((item) => item.id !== id);

            await AsyncStorage.setItem("visits", JSON.stringify(updatedVisits));

            setVisits(updatedVisits);

            Alert.alert("Success", "Visit deleted successfully.");
          } catch (error) {
            console.log("Delete Error:", error);
            Alert.alert("Error", "Unable to delete visit.");
          }
        },
      },
    ]);
  };

  const editVisit = (id) => {
    router.push({
      pathname: "/NewVisitScreen",
      params: {
        id: id,
      },
    });
  };

  const filteredVisits = visits.filter((item) =>
    item.clientName?.toLowerCase().includes(search.toLowerCase()),
  );

  const renderVisit = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.clientName}>{item.clientName}</Text>

        <View style={styles.detailRow}>
          <Ionicons
            style={styles.iconStyle}
            name="call-outline"
            size={18}
            color="#64748B"
          />
          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{item.phone}</Text>
        </View>

        <View style={styles.detailRows}>
          <Ionicons
            style={styles.iconStyle}
            name="calendar-outline"
            size={18}
            color="#64748B"
          />
          <Text style={styles.label}>Visit Date</Text>
          <Text style={styles.value}>{item.visitDate}</Text>
        </View>

        <View style={[styles.detailRow, { height: hp(9) }]}>
          <Ionicons
            style={styles.iconStyle}
            name="location-outline"
            size={18}
            color="#64748B"
          />
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>
            {item.location ? (
              <View style={styles.locationDetails}>
                <Text style={styles.locationText}>
                  Latitude: {item.location.latitude}
                </Text>

                <Text style={styles.locationText}>
                  Longitude: {item.location.longitude}
                </Text>
              </View>
            ) : (
              <Text style={styles.locationText}>Location unavailable</Text>
            )}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            style={styles.iconStyle}
            name="document-text-outline"
            size={18}
            color="#64748B"
          />
          <Text style={styles.label}>Remark</Text>
          <Text style={styles.value}>{item.remark || "No remark"}</Text>
        </View>

        <View
          style={[
            styles.statusContainer,
            item.status === "Completed" ? styles.completed : styles.pending,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === "Completed" ? "Completed" : "Pending"}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => editVisit(item.id)}
          >
            <Ionicons name="create-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteVisit(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("user");
      router.replace("/");
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#e0bc05", "#ffffff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Let's Manage our Clients </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={22} color="#64748B" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search client name..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </LinearGradient>

      <View
        style={{
          flexDirection: "row",
          // backgroundColor: "#c12",
          alignItems: "center",
          marginBottom: hp(3),
          marginTop: hp(0.5),
          // justifyContent: "center",
        }}
      >
        <View
          style={{
            marginTop: hp(3),
            marginBottom: hp(2),
            marginLeft: wp(6.5),
            flexDirection: "row",
            // justifyContent: "center",
            alignContent: "center",
          }}
        >
          <FontAwesome name="user-o" size={24} color="black" />
          <Text style={styles.totalText}>
            Total Clients: {filteredVisits.length}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.newVisitButton}
          onPress={() => router.push("/NewVisitScreen")}
        >
          <Text style={styles.newVisitText}>+ New Client</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredVisits}
        keyExtractor={(item) => item.id}
        renderItem={renderVisit}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {search ? "No clients found" : "No visits added yet."}
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fdfbed",
  },

  header: {
    flexDirection: "row",
    alignItem: "center",
    justifyContents: "space-between",
    marginBottom: 20,
  },
  headerGradient: {
    paddingTop: hp(7),
    paddingHorizontal: wp(8),
    paddingBottom: 20,
  },

  title: {
    fontSize: wp(5.3),
    color: "#080808",
    flex: 1,
    fontFamily: "AmazonMedium",
  },

  logoutButton: {
    backgroundColor: "#9e850a",
    paddingVertical: wp(2),
    paddingHorizontal: wp(3),
    borderRadius: 8,
    left: wp(2),
  },

  logoutText: {
    color: "white",
    fontFamily: "AmazonMedium",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D9E2EC",
    borderRadius: wp(10),
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 13,
    paddingHorizontal: 10,
    fontSize: wp(4),
    fontFamily: "AmazonMedium",
  },

  newVisitButton: {
    backgroundColor: "#3d3d37",
    paddingVertical: wp(4),
    width: wp(30),
    marginLeft: wp(20),

    alignItems: "center",

    borderTopRightRadius: wp(5),
    borderBottomLeftRadius: wp(5),
  },

  newVisitText: {
    color: "white",
    fontSize: wp(3.8),
    // fontWeight: "bold",
    fontFamily: "AmazonMedium",
  },

  totalText: {
    fontSize: 16,
    fontFamily: "AmazonMedium",
    marginBottom: 10,
    marginLeft: wp(4),
  },

  listContainer: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#f8f5e4",
    borderRadius: 12,
    borderWidth: wp(0.4),
    borderColor: "#c59b10",
    paddingVertical: hp(3),
    width: wp(90),
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevations: 3,
    marginLeft: wp(5),
    alignItems: "center",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: wp(0.4),
    borderColor: "#b4942b",
    borderRadius: wp(2),
    backgroundColor: "#b8a24277",
    width: wp(80),
    height: hp(6),
  },
  iconStyle: {
    marginLeft: wp(5),
  },

  label: {
    width: 95,
    marginLeft: wp(3),
    fontSize: 15,
    color: "#46433b",
    fontFamily: "AmazonMedium",
    // backgroundColor: "#a7b37e",
    width: wp(30),
  },

  value: {
    flex: 1,
    fontSize: 15,
    color: "#172B4D",
    fontFamily: "AmazonMedium",
  },

  locationDetails: {
    marginLeft: 26,
    marginBottom: 10,
  },

  locationText: {
    fontSize: 14,
    color: "#02050a",
    marginBottom: 4,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    marginLeft: 6,
  },

  clientName: {
    fontSize: 19,
    fontFamily: "AmazonMedium",
    marginBottom: hp(2),
  },

  detail: {
    fontSize: 15,
    marginBottom: 7,
    color: "#333",
  },

  locationContainer: {
    marginTop: 3,
    marginBottom: 5,
  },

  locationText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
    fontFamily: "AmazonMedium",
  },

  statusContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // alignSelf: "flex-start",
    marginTop: 8,
  },

  pending: {
    backgroundColor: "#c9b24b",
    borderRadius: 3,
  },

  completed: {
    backgroundColor: "#91c06b",
  },

  statusText: {
    fontWeight: "bold",
    fontSize: 14,
  },

  buttonRow: {
    flexDirection: "row",
    marginTop: 15,
    gap: 10,
  },

  editButton: {
    flexDirection: "row",
    backgroundColor: "#645820b4",
    // paddingVertical: hp(0.1),
    borderRadius: wp(4),
    height: hp(5.5),
    width: wp(30),
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#3d0d11c2",
    // paddingVertical: hp(0.1),
    borderRadius: wp(4),
    height: hp(5.5),
    width: wp(30),
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontFamily: "AmazonMedium",
    fontSize: wp(3.6),
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },

  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
