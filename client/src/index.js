import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
// import './index.css';
// import App from './App';
// import {createBrowserRouter, RouterProvider} from 'react-router-dom'
// import routes from "./routes"
// import './styles/Home.css'
// import './styles/SignUp.css'

import App from "./components/App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);