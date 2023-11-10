import "./assets/libs/boxicons-2.1.1/css/boxicons.min.css";
import "./scss/App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Blank from "./pages/Blank";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Loans from "./pages/Loans";
import Duedate from "./pages/Duedate";
import Register from "./pages/Register";
import Credits from "./pages/Credits";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Checklist from "./pages/Checklists";
import MainLayout from "./layout/MainLayout";
import { FIREBASE_AUTH, FIREBASE_DB } from "./configs/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const auth = FIREBASE_AUTH;

    const checkUserRole = async () => {
      onAuthStateChanged(auth, async (authUser) => {
        if (authUser) {
          const roleCollection = collection(FIREBASE_DB, "role");
          const querySnapshot = await getDocs(roleCollection);

          querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (doc.id === authUser.uid && data.type === "admin") {
              setAdmin(authUser);
            }
          });
        } else {
          setAdmin(null);
        }
      });
    };
    checkUserRole();
    /*  const authAdmin = async () => {
      let authType = "";

      const roleCollection = collection(FIREBASE_DB, "role");
      const querySnapshot = await getDocs(roleCollection);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.type === "admin") {
          // Set the currentRole if the user's UID matches and they have an "admin" role
          authType = data.type;
        }
      });

      onAuthStateChanged(auth, async (user) => {
        if (user && authType === "admin") {
          // Corrected the variable name here
          setAdmin(user);
          console.log("user:", user.uid);
        } else {
          setAdmin(null);
          console.log("user:", user);
        }
      });
    };

    authAdmin(); */
  }, []);

  return (
    <BrowserRouter>
      {admin ? (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="loans" element={<Loans />} />
            <Route path="duedate" element={<Duedate />} />
            <Route path="register" element={<Register />} />
            <Route path="credits" element={<Credits />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
            <Route path="checklist" element={<Checklist />} />
          </Route>
        </Routes>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}

export default App;
