import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { globalApi } from "../../Api/axios";
import toast from "react-hot-toast";
import axios from "axios";

export const GetOTPPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  type Inputs = {
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      setLoading(true);
      const response = await globalApi.post(
        "/api/v1/auth/get/otp",
        {
          email: data.email,
        },
        {
          withCredentials: true,
        }
      );
      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate(`/user/verify/${response.data.userID}/otp`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data.message);
      } else {
        toast.error("An unexpected error occured");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="sm:h-screen sm:grid sm:place-items-center max-sm:py-44">
        <div className=" mx-auto max-w-lg relative flex flex-col p-4 rounded-xl text-black md:bg-white shadow-black drop-shadow-sm md:drop-shadow-md">
          <div className="text-3xl sm:px-20 font-bold mb-2 text-[#1e0e4b] text-center ">
            Forgot Your Password?
            <span className="text-purple-600 block font-semibold">
              We got you :)
            </span>
          </div>

          <form
            className="flex flex-col gap-3 "
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* EMAIL */}
            <div className="block relative">
              <label
                htmlFor="email"
                className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
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
                className="rounded border border-gray-200 text-sm w-full font-normal leading-[18px] text-black tracking-[0px] appearance-none block h-11 m-0 p-[11px] focus:ring-1 ring-offset-2  ring-gray-900 outline-0 "
              />
              {errors.email && (
                <span className="text-blue-900 dark:text-red-500 text-sm">
                  *{errors.email.message}
                </span>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-purple-600 w-max m-auto px-6 py-2 rounded text-white text-sm font-normal"
            >
              {/* IF LOADING IS TRUE THEN SHOW LOADER ELSE SUBMIT BUTTON */}
              {loading ? <div className="loader"></div> : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
