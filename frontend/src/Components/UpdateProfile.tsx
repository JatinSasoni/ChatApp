import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useCheckAuth } from "../Hooks/checkAuth";
import { useState, type ChangeEvent } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setLoggedInUser } from "../../Store/Slices/auth-slice";
import { IoMdClose } from "react-icons/io";

type Inputs = {
  username: string;
  bio: string;
};
type Props = {
  setIsUpdate: React.Dispatch<React.SetStateAction<boolean>>;
};

const UpdateProfile: React.FC<Props> = ({ setIsUpdate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useCheckAuth();
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [profilePic, setProfilePic] = useState<File | null>();
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      username: loggedInUser?.username || "",
      bio: loggedInUser?.Profile.bio || "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let profilePhoto: string | ArrayBuffer | null = "";
    if (profilePic) {
      profilePhoto = await new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject("Error reading file");
        };
        reader.readAsDataURL(profilePic);
      });
    }

    // Submit to backend with the profilePic
    const payload = {
      ...data,
      profilePhoto: profilePhoto, // This is base64 string now
    };

    try {
      setLoading(true);
      const response = await api.patch("/api/v1/user/update-user", payload, {
        withCredentials: true,
      });
      if (response?.data?.success) {
        dispatch(setLoggedInUser(response.data.user));
        setIsUpdate((prev) => !prev);
      }

      navigate("/profile");
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        navigate("login");
      } else {
        console.log("An unexpected error occurred:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="backdrop-blur-sm shadow-sm max-sm:h-[calc(100vh-50px)] max-sm:grid max-sm:place-items-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-neutral-50 rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-neutral-100">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Update Your Profile
              </h1>
              <IoMdClose
                className="my-auto size-8"
                onClick={() => setIsUpdate((prev) => !prev)}
              />
            </div>

            <form
              className="space-y-4 md:space-y-6 "
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label
                  htmlFor="username"
                  className="block  text-sm font-medium text-gray-900 "
                >
                  Username
                </label>
                <input
                  type="text"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "Username is required",
                    },
                    minLength: {
                      value: 3,
                      message: "Should be greater than 3 char",
                    },
                  })}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username..."
                />
                <span className="text-red-500">
                  {errors.username && errors.username.message}
                </span>
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Bio
                </label>
                <input
                  type="text"
                  {...register("bio")}
                  id="bio"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Your bio.."
                />
              </div>
              <div>
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setProfilePic(e.target?.files?.[0])
                  }
                  id="ProfilePhoto"
                  accept="image/jpeg, image/png"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 bg-purple-600"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpdateProfile;
