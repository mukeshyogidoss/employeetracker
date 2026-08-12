# Employee Visit Tracker

A React Native mobile application for employees to manage and track their client visits.

The app allows employees to add client visit details, capture their current location, search saved clients, update visit information, and delete visits. All visit data is stored locally using AsyncStorage.

## Features

- User Login
- Email and password validation
- Password visibility toggle
- Add new client visit
- Edit client visit details
- Delete client visits
- Search clients by name
- Visit status (Pending / Completed)
- Phone number validation
- Date validation
- Current location tracking
- Local data storage using AsyncStorage
- Custom fonts
- Lottie animation
- Responsive UI

## Technologies Used

- React Native
- Expo
- JavaScript
- Expo Router
- AsyncStorage
- Expo Location
- Expo Font
- Lottie React Native
- React Native Responsive Screen
- Expo Vector Icons

## Main Functionality

### Login

The application provides a login screen with:

- Email validation
- Password validation
- Password show/hide option
- Local login state using AsyncStorage

### Visit Management

Employees can create a visit with:

- Client Name
- Phone Number
- Visit Date
- Current Location
- Remark
- Visit Status

### CRUD Operations

Visit data is managed using AsyncStorage.

**Create**

Add a new client visit.

**Read**

Display all saved client visits on the Home Screen.

**Update**

Edit existing client visit details.

**Delete**

Delete a client visit after confirmation.

### Search

The Home Screen provides a search bar to search for clients by name.

### Location

The application requests location permission and captures the employee's current latitude and longitude when creating a visit.

## Data Storage

The application currently uses:

```text
AsyncStorage
