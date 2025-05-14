// import { StrictMode } from "react";
import {createRoot} from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Event from "./pages/Event.jsx";
import FilterBar from "./components/FilterBar.jsx";
import FindDoctor from "./pages/FindDoctor.jsx";
import Timeslot from "./pages/Timeslot.jsx";
import Confirm from "./components/ConfirmAppointment.jsx";
import Register from "./pages/Register.jsx";
import UserDetail from "./pages/UserDetail.jsx";
import Admin_post from "./pages/Admin_post.jsx";
import Admin_Appointment from "./pages/Admin_Appointment.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import LoginOverlay from "./components/LoginOverlay.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
            {
                path: "/Event/:id",
                element: <Event/>,
            },
            {
                path: "/FilterBar",
                element: <FilterBar/>,
            },
            {
                path: "/FindDoctor",
                element: <FindDoctor/>,
            },
            {
                path: "/Timeslot",
                element: <Timeslot/>,
            },
            {
                path: "/Confirm",
                element: <Confirm/>,
            },
            {
                path: "/Register",
                element: <Register/>,
            },
            {
                path: "/Login",
                element: <LoginOverlay/>,
            },
            {
                path: "/UserDetail",
                element: <UserDetail/>,
            },
            {
                path: "/Admin_post",
                element: <Admin_post/>,
            },
            {
                path: "/Admin_Appointment",
                element: <Admin_Appointment/>,
            },
        ],
    },
    {
        path: "*",
        element: <NotFoundPage/>,
    },
]);

createRoot(document.getElementById("root")).render(
    // <StrictMode>
    <RouterProvider router={router}/>
    //</StrictMode>
);
