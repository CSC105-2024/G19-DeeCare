import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Event from "./pages/Event.jsx";
import FindDoctor from "./pages/FindDoctor.jsx";
import Timeslot from "./pages/Timeslot.jsx";
import Confirm from "./pages/Confirm.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import Admin_post from "./pages/Admin_post.jsx";
import Admin_Appointment from "./pages/Admin_Appointment.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/Event",
        element: <Event />,
      },
      {
        path: "/FindDoctor",
        element: <FindDoctor />,
      },
      {
        path: "/Timeslot",
        element: <Timeslot />,
      },
      {
        path: "/Confirm",
        element: <Confirm />,
      },
      {
        path: "/Register",
        element: <Register />,
      },
      {
        path: "/Login",
        element: <Login />,
      },
      {
        path: "/UserDetail",
        element: <UserDetail />,
      },
      {
        path: "/Admin_post",
        element: <Admin_post />,
      },
      {
        path: "/Admin_Appointment",
        element: <Admin_Appointment />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <RouterProvider router={router} />
  //</StrictMode>
);
