import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import { Signup } from "../pages/Signup";
import { Signin } from "../pages/Signin";
import { SendMoney } from "../pages/SendMoney";
import { Dashboard } from "../pages/Dashboard";

export default function AllRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send" element={<SendMoney />} />
    </Routes>
  );
}
