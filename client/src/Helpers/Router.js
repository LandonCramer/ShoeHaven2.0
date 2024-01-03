import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorPage from "../components/ErrorPage"
import Home from "../components/Home"
import Login from "../components/Login"
import SignUp from "../components/SignUp"
import UserSneakers from "../components/UserSneakers"
import SneakerView from "../components/SneakerView"
import Subscription from "../components/Subscription"
import Success from "../components/Success"
import Cancelled from "../components/Cancelled"

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="my-sneaker" element={<UserSneakers />} />
    <Route path="sneaker/:id" element={<SneakerView />} />
    <Route path="create-subscription-session" element={<Subscription />} />
    <Route path="success" element={<Success />} />
    <Route path="cancelled" element={<Cancelled />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default Router;