import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import ProtectRoute from "./ProtectRoutes/ProtectRoute";

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
]);

const App: React.FC = () => {
  return <RouterProvider router={Router}></RouterProvider>;
};

export default App;
