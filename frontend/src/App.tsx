import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectRoute from "./ProtectRoutes/PreventLoginIfLoggedIn";
import Profile from "./Components/Profile";
import { GetOTPPage } from "./Pages/GetOTPPage";
import { VerifyOTPPage } from "./Pages/VerifyOTPPage";
import { ChangePasswordPage } from "./Pages/ChangePasswordPage";
import PreventLogin from "./ProtectRoutes/PreventLoginIfLoggedIn";
import ProtectChangePass from "./ProtectRoutes/ProtectChangePass";
import ProfileMobileOnly from "./Components/ProfileMobileOnly";
import ErrorPage from "./Pages/ErrorPage";
import Group from "./Components/Group";
import CreateGroup from "./Components/CreateGroup";
import GroupProfileMobileOnly from "./Components/GroupProfileMobileOnly";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: (
      <PreventLogin>
        <Login />
      </PreventLogin>
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
    path: "/chat/mobile/profile",
    element: <ProfileMobileOnly />,
  },
  {
    path: "/chat/mobile/group-profile",
    element: <GroupProfileMobileOnly />,
  },
  {
    path: "/groups",
    element: <Group />,
  },
  {
    path: "/groups/create",
    element: <CreateGroup />,
  },
  {
    path: "/forgot-password/get-otp",
    element: <GetOTPPage />,
  },
  {
    path: "/user/verify/:userID/otp",
    element: <VerifyOTPPage />,
  },
  {
    path: "/user/change/password",
    element: (
      <ProtectChangePass>
        <ChangePasswordPage />,
      </ProtectChangePass>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={Router}></RouterProvider>;
};

export default App;
