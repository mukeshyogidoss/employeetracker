# 📍 Employee Visit Tracker

A React Native mobile application for managing employee/client visits. The app allows employees to log in, capture client visit details, get their current location, and store visit information locally.

## 🚀 Features

* 🔐 User Login
* 💾 Persistent login using AsyncStorage
* 🚪 Logout
* 👤 Client name entry
* 📱 Client phone number entry
* 📅 Visit date
* 📍 Current GPS location
* 📝 Visit remarks
* 💾 Save visit details locally using AsyncStorage
* 🗂️ Store multiple visit records
* 🌐 Backend API integration
* 🍃 MongoDB database integration

## 🛠️ Technologies Used

### Mobile App

* React Native
* Expo
* Expo Router
* JavaScript
* AsyncStorage
* Expo Location
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* REST API

## 📂 Project Structure

```text
EmployeeVisitTracker/
│
├── app/
│   ├── index.tsx
│   ├── HomeScreen.js
│   └── _layout.tsx
│
├── assets/
│   └── images/
│       └── employee.jpg
│
├── backend/
│   ├── app.js
│   ├── controllers/
│   │   └── userController.js
│   ├── model/
│   │   └── userModel.js
│   ├── routes/
│   │   └── users.js
│   ├── package.json
│   └── .env
│
├── package.json
├── package-lock.json
└── README.md
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/mukeshyogidoss/employeetracker.git
```

### 2. Go to the project

```bash
cd employeetracker
```

### 3. Install mobile app dependencies

```bash
npm install
```

### 4. Install backend dependencies

```bash
cd backend
npm install
```

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder:

```env
PORT=8080
MONGO_URL=your_mongodb_connection_string
```

⚠️ Do not upload `.env` to GitHub.

Add this to `.gitignore`:

```text
node_modules/
.env
backend/.env
.expo/
```

## ▶️ Run the Backend

From the `backend` folder:

```bash
node app.js
```

Or, if you have a development script:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:8080
```

## ▶️ Run the React Native App

From the main project folder:

```bash
npx expo start
```

Then open the application using:

* Expo Go
* Android Emulator
* Physical Android device

### 📱 Physical Device

Make sure your phone and computer are connected to the **same Wi-Fi network**.

For API requests from the phone, use your computer's local IP address instead of `localhost`.

Example:

```text
http://192.168.1.8:8080
```

## 💾 Visit Data

When a visit is saved, the application stores the visit information in AsyncStorage.

Example:

```json
{
  "id": "1754912345678",
  "clientName": "ABC Company",
  "phone": "9876543210",
  "visitDate": "11/08/2026",
  "location": {
    "latitude": 13.0478,
    "longitude": 80.0442
  },
  "remark": "Discussed new project"
}
```

Multiple visits can be stored locally.

## 🔄 Application Flow

```text
Login
  ↓
Save User in AsyncStorage
  ↓
Home Screen
  ↓
Request Location Permission
  ↓
Get Current Location
  ↓
Enter Client Details
  ↓
Save Visit
  ↓
Store Visit in AsyncStorage
  ↓
Logout
```

## 🔮 Future Improvements

* 🗺️ Display location on Google Maps
* ☁️ Store visit records in MongoDB
* 🔄 Sync local visits with backend
* 👥 Employee management
* 📊 Visit history screen
* 🔎 Search and filter visits
* 📝 Edit and delete visits
* 🔔 Visit reminders
* 🔑 JWT authentication

## 👨‍💻 Author

**Mukesh Y**

React Native Developer

GitHub: https://github.com/mukeshyogidoss

Portfolio: https://mukesh-portfolio-sigma-beige.vercel.app/

## 📄 License

This project is created for learning and development purposes.

```
```
