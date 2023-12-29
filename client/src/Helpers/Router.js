import React from 'react';
import { Route, Routes } from 'react-router-dom';
import ErrorPage from "../components/ErrorPage"
import Home from "../components/Home"
import Login from "../components/Login"
import SignUp from "../components/SignUp"
import CreateSneaker from "../components/CreateSneaker"
import SneakerView from "../components/SneakerView"
import Subscription from "../components/Subscription"

const Router = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="login" element={<Login />} />
    <Route path="signup" element={<SignUp />} />
    <Route path="sneaker" element={<CreateSneaker />} />
    <Route path="sneaker/:id" element={<SneakerView />} />
    <Route path="create-subscription-session" element={<Subscription />} />
    <Route path="*" element={<ErrorPage />} />
  </Routes>
);

export default Router;