import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
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

const NewVisitScreen = () => {
  // GET ID FROM HOME SCREEN
  const { id } = useLocalSearchParams();

  // STATES
  const [clientName, setClientName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState("Pending");
  const [location, setLocation] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // CHECK EDIT MODE
  const isEditMode = !!id;

  // LOAD SCREEN
  useEffect(() => {
    getLocation();

    if (isEditMode) {
      loadVisit();
    }
  }, []);

  // GET CURRENT LOCATION
  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Required", "Please allow location permission.");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(currentLocation);
    } catch (error) {
      console.log("Location Error:", error);
    }
  };

  // LOAD EXISTING VISIT
  const loadVisit = async () => {
    try {
      const storedVisits = await AsyncStorage.getItem("visits");

      if (!storedVisits) {
        return;
      }

      const visits = JSON.parse(storedVisits);

      const existingVisit = visits.find((item) => item.id === id);

      if (!existingVisit) {
        Alert.alert("Error", "Visit not found.");
        return;
      }

      setClientName(existingVisit.clientName || "");
      setPhone(existingVisit.phone || "");
      setVisitDate(existingVisit.visitDate || "");
      setRemark(existingVisit.remark || "");
      setStatus(existingVisit.status || "Pending");

      if (existingVisit.location) {
        setLocation({
          coords: {
            latitude: existingVisit.location.latitude,
            longitude: existingVisit.location.longitude,
          },
        });
      }
    } catch (error) {
      console.log("Load Visit Error:", error);
      Alert.alert("Error", "Unable to load visit details.");
    }
  };

  // DATE PICKER
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  // DATE CHANGE
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);

    if (!selectedDate) {
      return;
    }

    const day = String(selectedDate.getDate()).padStart(2, "0");
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const year = selectedDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    setVisitDate(formattedDate);
  };

  // VALIDATION
  const validateForm = () => {
    if (clientName.trim() === "") {
      Alert.alert("Missing Details", "Please enter client name.");
      return false;
    }

    if (phone.trim() === "") {
      Alert.alert("Missing Details", "Please enter phone number.");
      return false;
    }

    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phone.trim())) {
      Alert.alert(
        "Invalid Phone",
        "Phone number must contain exactly 10 digits.",
      );
      return false;
    }

    if (visitDate.trim() === "") {
      Alert.alert("Missing Details", "Please select visit date.");
      return false;
    }

    return true;
  };

  // SAVE / UPDATE VISIT
  const saveVisit = async () => {
    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    try {
      const storedVisits = await AsyncStorage.getItem("visits");

      const visits = storedVisits ? JSON.parse(storedVisits) : [];

      // CREATE NEW VISIT
      if (!isEditMode) {
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
          status: status,
        };

        visits.push(newVisit);

        await AsyncStorage.setItem("visits", JSON.stringify(visits));

        Alert.alert("Success", "Visit added successfully!", [
          {
            text: "OK",
            onPress: () => {
              router.replace("/HomeScreen");
            },
          },
        ]);

        return;
      }

      // UPDATE EXISTING VISIT
      const updatedVisits = visits.map((item) => {
        if (item.id === id) {
          return {
            ...item,
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
            status: status,
          };
        }

        return item;
      });

      await AsyncStorage.setItem("visits", JSON.stringify(updatedVisits));

      Alert.alert("Success", "Visit updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            router.replace("/HomeScreen");
          },
        },
      ]);
    } catch (error) {
      console.log("Save Visit Error:", error);
      Alert.alert("Error", "Unable to save visit.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          {isEditMode ? "Edit Visit" : "New Visit"}
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Client Name */}
        <Text style={styles.label}>Client Name *</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter client name"
          value={clientName}
          onChangeText={setClientName}
        />

        {/* Phone */}
        <Text style={styles.label}>Phone Number *</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter 10 digit phone number"
          value={phone}
          onChangeText={(value) => {
            const onlyNumbers = value.replace(/[^0-9]/g, "");

            setPhone(onlyNumbers);
          }}
          keyboardType="phone-pad"
          maxLength={10}
        />

        {/* Date */}
        <Text style={styles.label}>Visit Date *</Text>

        <TouchableOpacity style={styles.dateButton} onPress={openDatePicker}>
          <Text style={visitDate ? styles.dateText : styles.placeholderText}>
            {visitDate ? visitDate : "Select visit date"}
          </Text>
        </TouchableOpacity>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* Location */}
        <Text style={styles.label}>Current Location</Text>

        <View style={styles.locationBox}>
          <Text style={styles.locationTitle}>Location</Text>

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

          <TouchableOpacity
            style={styles.refreshLocationButton}
            onPress={getLocation}
          >
            <Text style={styles.refreshText}>Refresh Location</Text>
          </TouchableOpacity>
        </View>

        {/* Remark */}
        <Text style={styles.label}>Remark</Text>

        <TextInput
          style={[styles.input, styles.remarkInput]}
          placeholder="Enter visit remark"
          value={remark}
          onChangeText={setRemark}
          multiline
        />

        {/* Status */}
        <Text style={styles.label}>Visit Status</Text>

        <View style={styles.statusRow}>
          <TouchableOpacity
            style={[
              styles.statusButton,
              status === "Pending" && styles.selectedPending,
            ]}
            onPress={() => setStatus("Pending")}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === "Pending" && styles.selectedStatusText,
              ]}
            >
              Pending
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.statusButton,
              status === "Completed" && styles.selectedCompleted,
            ]}
            onPress={() => setStatus("Completed")}
          >
            <Text
              style={[
                styles.statusButtonText,
                status === "Completed" && styles.selectedStatusText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        {/* Save / Update */}
        <TouchableOpacity style={styles.saveButton} onPress={saveVisit}>
          <Text style={styles.saveButtonText}>
            {isEditMode ? "Update Visit" : "Save Visit"}
          </Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        <View style={{ height: hp(19) }} />
      </ScrollView>
    </View>
  );
};

export default NewVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ece5c2d8",
    padding: 20,
    // paddingBottom: hp(10),
  },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: wp(4),
    marginTop: hp(4),
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#112c49",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  backText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
  },

  // LABEL
  label: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 7,
    color: "#333",
  },

  // INPUT
  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 18,
  },

  // DATE
  dateButton: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 9,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 18,
  },

  dateText: {
    fontSize: 16,
    color: "#222",
  },

  placeholderText: {
    fontSize: 16,
    color: "#888",
  },

  // LOCATION
  locationBox: {
    backgroundColor: "#e8f5e9",
    padding: 15,
    borderRadius: 10,
    marginBottom: 18,
  },

  locationTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 8,
  },

  locationText: {
    fontSize: 14,
    marginBottom: 4,
    color: "#444",
  },

  refreshLocationButton: {
    backgroundColor: "#2e7d32",
    paddingVertical: 9,
    borderRadius: 7,
    alignItems: "center",
    marginTop: 10,
  },

  refreshText: {
    color: "white",
    fontWeight: "bold",
  },

  // REMARK
  remarkInput: {
    height: 100,
    textAlignVertical: "top",
  },

  // STATUS
  statusRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  statusButton: {
    flex: 1,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 9,
    paddingVertical: 13,
    alignItems: "center",
  },

  selectedPending: {
    backgroundColor: "#fff3cd",
    borderColor: "#f0ad00",
  },

  selectedCompleted: {
    backgroundColor: "#d4edda",
    borderColor: "#28a745",
  },

  statusButtonText: {
    fontWeight: "bold",
    color: "#555",
  },

  selectedStatusText: {
    color: "#111",
  },

  // SAVE
  saveButton: {
    backgroundColor: "#112c49",
    paddingVertical: 15,
    borderRadius: 9,
    alignItems: "center",
  },

  saveButtonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "bold",
  },

  // CANCEL
  cancelButton: {
    backgroundColor: "#ddd",
    paddingVertical: 14,
    borderRadius: 9,
    alignItems: "center",
    marginTop: 12,
  },

  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
});
