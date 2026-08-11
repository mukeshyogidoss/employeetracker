import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
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

const HomeScreen = () => {
  const [location, setLocation] = useState(null);

  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [remark, setRemark] = useState("");

  // Get location when screen opens
  useEffect(() => {
    getLocation();
  }, []);

  // Get current location
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow location permission.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);

      console.log("Latitude:", currentLocation.coords.latitude);

      console.log("Longitude:", currentLocation.coords.longitude);
    } catch (error) {
      console.log("Location Error:", error);
    }
  };

  // Save visit
  const saveVisit = async () => {
    // Validate required fields
    if (
      clientName.trim() === "" ||
      phone.trim() === "" ||
      visitDate.trim() === ""
    ) {
      Alert.alert(
        "Missing Details",
        "Please enter Client Name, Phone Number and Visit Date.",
      );
      return;
    }

    try {
      // Get existing visits
      const existingVisits = await AsyncStorage.getItem("visits");

      const visits = existingVisits ? JSON.parse(existingVisits) : [];

      // Create new visit object
      const newVisit = {
        id: Date.now().toString(),
        clientName: clientName.trim(),
        phone: phone.trim(),
        visitDate: visitDate.trim(),

        location: location
          ? {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }
          : null,

        remark: remark.trim(),
      };

      // Add new visit
      visits.push(newVisit);

      // Save updated visits
      await AsyncStorage.setItem("visits", JSON.stringify(visits));

      console.log("Visit Saved:", newVisit);

      Alert.alert("Success", "Visit details saved successfully!");

      // Clear form
      setClientName("");
      setPhone("");
      setVisitDate("");
      setRemark("");
    } catch (error) {
      console.log("Save Visit Error:", error);

      Alert.alert("Error", "Unable to save visit details.");
    }
  };

  // Logout
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
      <Text style={styles.title}>Employee Visit Tracker</Text>

      {/* Client Name */}
      <TextInput
        style={styles.input}
        placeholder="Client Name"
        value={clientName}
        onChangeText={setClientName}
      />

      {/* Phone Number */}
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Visit Date */}
      <TextInput
        style={styles.input}
        placeholder="Visit Date (DD/MM/YYYY)"
        value={visitDate}
        onChangeText={setVisitDate}
      />

      {/* Current Location */}
      <View style={styles.locationBox}>
        <Text style={styles.locationTitle}>📍 Current Location</Text>

        {location ? (
          <>
            <Text style={styles.locationText}>
              Latitude: {location.coords.latitude}
            </Text>

            <Text style={styles.locationText}>
              Longitude: {location.coords.longitude}
            </Text>
          </>
        ) : (
          <Text style={styles.locationText}>Getting location...</Text>
        )}
      </View>

      {/* Remark */}
      <TextInput
        style={[styles.input, styles.remarkInput]}
        placeholder="Enter Remark"
        value={remark}
        onChangeText={setRemark}
        multiline
      />

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={saveVisit}>
        <Text style={styles.buttonText}>Save Visit</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
  },

  locationBox: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },

  locationTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },

  locationText: {
    fontSize: 15,
    marginBottom: 4,
  },

  remarkInput: {
    height: 90,
    textAlignVertical: "top",
  },

  saveButton: {
    backgroundColor: "#112c49",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },

  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
