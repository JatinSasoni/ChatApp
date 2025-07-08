import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectRoute from "./ProtectRoutes/ProtectRoute";
import Profile from "./Components/Profile";
import { ResetPassPage } from "./Pages/ResetPasspage";
import { VerifyOTPPage } from "./Pages/VerifyOTPPage";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <ProtectRoute>
        <Login />
      </ProtectRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <ProtectRoute>
        <Signup />
      </ProtectRoute>
    ),
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/forgot-password/get-otp",
    element: <ResetPassPage />,
  },
  {
    path: "/user/verify/:userID/otp",
    element: <VerifyOTPPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={Router}></RouterProvider>;
};

export default App;
