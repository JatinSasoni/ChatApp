import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectRoute from "./ProtectRoutes/ProtectRoute";
import Profile from "./Components/Profile";
import UpdateProfile from "./Components/UpdateProfile";

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
    path: "/update-profile",
    element: <UpdateProfile />,
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={Router}></RouterProvider>;
};

export default App;
