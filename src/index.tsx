import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Home from "./components/Home";
import Login from "./components/Login";
import ExpensesPage from "./components/ExpensesPage";

const handleLogout = () => {
  console.log("Logged out");
};

const isLoggedIn = false;

const root = ReactDOM.createRoot(
  document.getElementById("root") || document.createElement("div")
);
root.render(
  <Router>
    <App />
    <Routes>
      <Route
        path="/login"
        element={<Login onLogout={handleLogout} isLoggedIn={isLoggedIn} />}
      />
      <Route path="/expensepage" element={<ExpensesPage />} />
      <Route path="/" element={<Home />} />
    </Routes>
  </Router>
);
reportWebVitals((onPreEntery: any) => {
  console.log(onPreEntery);
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
