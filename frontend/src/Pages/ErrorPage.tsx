import Lottie from "lottie-react";
import LottieAnimation from "./lottie/errorAnimation.json";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-screen bg-white">
      <Lottie
        animationData={LottieAnimation}
        className="w-full h-1/2 pt-32 sm:pt-15"
      />
      <div className=" h-[calc(100%-50%)]">
        <h1 className="text-center text-5xl sm:text-9xl text-purple-800">
          404
        </h1>
        <h2 className="text-center text-2xl sm:text-5xl font-semibold">
          Oh snap! We couldn't find the page you're looking for
        </h2>
        <p className="text-center text-slate-500 sm:pt-2 text-md sm:text-xl">
          It might be gone, renamed, broken or never existed.
        </p>
        <div className="w-full">
          <button
            onClick={() => navigate("/")}
            className="mx-auto block mt-4 bg-purple-800 text-white py-1 px-4 rounded hover:bg-blue-700 duration-200"
          >
            Go To Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
