import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { globalApi } from "../../Api/axios";

export const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  type Inputs = {
    newPassword: string;
    confirmPassword: string;
  };

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const dataToSend = {
        password: data.newPassword,
      };
      const response = await globalApi.post(
        "/api/v1/auth/set/new-password",
        dataToSend,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        sessionStorage.removeItem("otpVerified");
        navigate("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sm:h-screen sm:grid sm:place-items-center max-sm:py-44">
      <div className=" mx-auto max-w-lg relative flex flex-col p-4 rounded-3xl text-black shadow-purple-200 shadow-xl">
        <div className="text-3xl font-bold mb-2 text-[#1e0e4b] text-center sm:px-20">
          <span className="text-blue-600 font-bold text-4xl block">
            New Password
          </span>
        </div>

        {/* Change password FORM */}
        <form
          className="flex flex-col gap-4 "
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Password */}
          <div className="block relative">
            <label
              htmlFor="password"
              className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
            >
              Password
            </label>
            <input
              type="text"
              {...register("newPassword", {
                required: {
                  value: true,
                  message: "Password is required",
                },
                minLength: {
                  value: 8,
                  message: "Password should be at least 8 characters long",
                },
                pattern: {
                  value:
                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                  message:
                    "Password should contain at least One Capital letter, Small letter, Number and Symbol",
                },
              })}
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0  "
            />
            {errors.newPassword && (
              <span className="text-blue-900 text-sm ">
                *{errors.newPassword.message}
              </span>
            )}
          </div>

          {/* Confirm-Password */}
          <div className="block relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
            >
              Confirm Password
            </label>
            <input
              type="text"
              {...register("confirmPassword", {
                required: {
                  value: true,
                  message: "Confirmation password is required",
                },
                validate: (val) => {
                  if (watch("newPassword") != val) {
                    return "Your passwords do no match";
                  }
                },
              })}
              className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-2 ring-offset-2  ring-gray-900 outline-0 "
            />
            {errors.confirmPassword && (
              <span className="text-blue-900 text-sm">
                *{errors.confirmPassword.message}
              </span>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="bg-blue-600 w-full m-auto px-6 py-2 rounded-xl text-white text-sm font-normal"
          >
            {/* IF LOADING IS TRUE THEN SHOW LOADER ELSE SUBMIT BUTTON */}
            {loading ? (
              <div className="grid place-items-center">
                <div className="loader"></div>{" "}
              </div>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
