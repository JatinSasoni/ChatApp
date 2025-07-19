import { useForm, type SubmitHandler } from "react-hook-form";
import { globalApi } from "../../Api/axios";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  setLoggedInUser,
  setOnlineUsers,
  setSocketId,
} from "../../Store/Slices/auth-slice";
import { connectToSocket } from "../../Utils/createSocketConnection";
import { useContext, useState } from "react";
import { socketContext } from "../../ContextForSocket/context";
import toast from "react-hot-toast";

type Inputs = {
  email: string;
  password: string;
};

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const SocketContext = useContext(socketContext);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const response = await globalApi.post("/api/v1/auth/login", data, {
        withCredentials: true,
      });
      if (response?.data?.success) {
        localStorage.setItem("accessToken", response.data?.AccessToken);
        dispatch(setLoggedInUser(response?.data?.loggedInUser));
        const newSocket = connectToSocket(response.data.loggedInUser);
        dispatch(setSocketId(newSocket?.id || null));
        SocketContext?.setSocket(newSocket || null);
        newSocket?.on("getOnlineUsers", (userIds: string[]) => {
          dispatch(setOnlineUsers(userIds));
        });
        navigate("/");
        toast.success(response.data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50 h-screen max-sm:pt-14 bg-[url('/loginbg.jpg')] sm:bg-cover bg-repeat-round">
      <div className="flex flex-col  items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="size-15 mr-4" src="/favicon.svg" alt="logo" />

          <span className="max-sm:text-4xl text-5xl">QuickChat</span>
        </div>
        {/* form */}
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: {
                      value: true,
                      message: "Email is required",
                    },
                    pattern: {
                      value: /^\S+@\S+\.\S+$/,
                      message: "Invalid email format",
                    },
                  })}
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                />
                <span className="text-red-500">
                  {errors.email && errors.email.message}
                </span>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "Password is required",
                    },
                    minLength: {
                      value: 8,
                      message: "Should be greater than 8",
                    },
                    pattern: {
                      value:
                        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                      message: "Password is not strong enough",
                    },
                  })}
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
                />
                <span className="text-red-500">
                  {errors.password && errors.password.message}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <NavLink
                  to="/forgot-password/get-otp"
                  className="text-sm font-medium text-primary-600 hover:underline"
                >
                  Forgot password?
                </NavLink>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center  bg-blue-600"
              >
                {loading ? (
                  <div className="grid place-items-center">
                    <div className="loader"></div>{" "}
                  </div>
                ) : (
                  "Login"
                )}
              </button>
              <p className="text-sm font-light text-gray-500 ">
                Don’t have an account yet?{" "}
                <NavLink
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline"
                >
                  Sign up
                </NavLink>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
