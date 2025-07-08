import { useNavigate, useParams } from "react-router-dom";
import { useState, type FormEvent } from "react";
import { OtpLogic } from "../Components/OtpLogic";
import { globalApi } from "../../Api/axios";
import toast from "react-hot-toast";
import axios from "axios";

export const VerifyOTPPage = () => {
  const navigate = useNavigate();
  const { userID } = useParams();
  const [loading, setLoading] = useState<boolean>(false);

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const combinedOtp = otp.join(""); //ARRAY TO STRING
    if (combinedOtp.length !== otp.length) {
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        otp: combinedOtp,
      };

      const response = await globalApi.post(
        `/api/v1/auth/verify/${userID}`,
        dataToSend,
        {
          withCredentials: true,
        }
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        sessionStorage.setItem("otpVerified", "true");
        // console.log(userID);
        // navigate(`/user/change/${userID}/password`);
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
      <div className="py-32 ">
        <div className="mx-3 md:mx-auto max-w-lg relative flex flex-col p-4 rounded-3xl text-black md:bg-white shadow-black md:drop-shadow-xl dark:bg-zinc-900">
          <div className="text-4xl font-bold mb-2  text-center">
            <span className="text-blue-400 font-bold ">Enter 6 Digit OTP</span>
          </div>

          {/* OTP */}
          <form className="flex flex-col gap-5 " onSubmit={(e) => onSubmit(e)}>
            {/* OTP */}
            <OtpLogic length={otp.length} otp={otp} setOtp={setOtp} />
            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              className="bg-blue-400 w-full m-auto px-6 py-2 rounded-xl text-white text-sm font-normal "
            >
              {/* IF LOADING IS TRUE THEN SHOW LOADER ELSE SUBMIT BUTTON */}
              {loading ? (
                <div className="grid place-items-center">
                  <div className="loader"></div>
                </div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
