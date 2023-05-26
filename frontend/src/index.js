import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

const root = ReactDOM.createRoot(document.getElementById("root"));

//Routing is done here
const router = createBrowserRouter([
  {
    path: "/",
    element: <Homepage className="Chakra" />,
  },
  {
    path: "/chats",
    element: <Chatpage />,
  },
]);
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
