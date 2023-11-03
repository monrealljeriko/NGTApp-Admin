import "./assets/libs/boxicons-2.1.1/css/boxicons.min.css";
import "./scss/App.scss";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Blank from "./pages/Blank";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Loans from "./pages/Loans";
import Register from "./pages/Register";
import Credits from "./pages/Credits";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import MainLayout from "./layout/MainLayout";

import { FIREBASE_AUTH } from "./configs/firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";

function App() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        console.log("user:", user.uid);

        setAdmin(user);
      } else {
        setAdmin(null);
        console.log("user:", user);
      }
    });
  }, []);

  return (
    <BrowserRouter>
      {admin ? (
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="members" element={<Members />} />
            <Route path="loans" element={<Loans />} />
            <Route path="register" element={<Register />} />
            <Route path="credits" element={<Credits />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      ) : (
        <Login />
      )}
    </BrowserRouter>
  );
}

export default App;
