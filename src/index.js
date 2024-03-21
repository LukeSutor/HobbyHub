import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

// Import context
import { AppProvider } from "./AppContext";

// Import pages
import Landing from "./pages/landing";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Matches from "./pages/matches";
import Login_Unsuccess from "./pages/login_unsuccessful";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <AppProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login_unsuccessful" element={<Login_Unsuccess />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/matches" element={<Matches />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  </>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
