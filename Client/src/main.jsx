import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../fonts/custome.css";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Theme } from "@radix-ui/themes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Theme>
    <React.StrictMode>
      <App />
      <ToastContainer />
    </React.StrictMode>
  </Theme>
);
