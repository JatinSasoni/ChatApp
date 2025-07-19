import { useDispatch, useSelector } from "react-redux";
import {
  setAllGroups,
  setGroupSelected,
  setGroupUpdateBoxOpen,
  setSelectedGroupMessages,
} from "../../Store/Slices/Group-slice";
import { IoMdClose } from "react-icons/io";
import { useState, type ChangeEvent } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { RootState } from "../../Store/store";
import { api } from "../../Api/axios";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateGroupInfo = () => {
  type Inputs = {
    groupName: string;
  };
  const dispatch = useDispatch();
  const [groupProfilePic, setGroupProfilePic] = useState<File | null>();
  const { groupSelected, groups } = useSelector(
    (state: RootState) => state.group
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isDeletingGroup, setIsDeletingGroup] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      groupName: groupSelected?.name || "",
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    let profilePhoto: string | ArrayBuffer | null = "";
    if (groupProfilePic) {
      profilePhoto = await new Promise<string | null>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject("Error reading file");
        };
        reader.readAsDataURL(groupProfilePic);
      });
    }
    // Submit to backend with the profilePic
    const payload = {
      ...data,
      profilePic: profilePhoto, // This is base64 string now
    };

    try {
      setLoading(true);
      const response = await api.put(
        `/api/v1/groups/update/${groupSelected?._id}`,
        payload,
        {
          withCredentials: true,
        }
      );
      if (response?.data?.success) {
        toast.success("Group info changed");
        dispatch(setGroupSelected(response.data?.group));
        dispatch(
          setAllGroups([
            ...groups.map((group) =>
              group._id === response.data?.group._id
                ? response.data?.group
                : group
            ),
          ])
        );
        dispatch(setGroupUpdateBoxOpen(false));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteGroupHandler = async (groupId: string | undefined) => {
    if (groupId === undefined) return;
    try {
      setIsDeletingGroup(true);
      const response = await api.delete(`/api/v1/groups/${groupId}/delete`);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setGroupSelected(null));
        dispatch(setSelectedGroupMessages([]));
        dispatch(
          setAllGroups(
            ...[groups.filter((group) => group._id !== response.data.groupId)]
          )
        );
        dispatch(setGroupUpdateBoxOpen(false));
      }
    } catch (error) {
      //*Type guard
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeletingGroup(false);
    }
  };

  return (
    <section className="backdrop-blur-xs shadow-sm max-sm:h-[calc(100vh)] max-sm:grid max-sm:place-items-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-neutral-50 rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0 ">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-neutral-100">
            <div className="flex justify-between">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Update your group
              </h1>
              <IoMdClose
                className="my-auto size-8"
                onClick={() => dispatch(setGroupUpdateBoxOpen(false))}
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
                  {...register("groupName", {
                    required: {
                      value: true,
                      message: "Group name is required",
                    },
                  })}
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="username..."
                />
                <span className="text-red-500">
                  {errors.groupName && errors.groupName.message}
                </span>
              </div>
              <div>
                <input
                  type="file"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setGroupProfilePic(e.target?.files?.[0])
                  }
                  id="ProfilePhoto"
                  accept="image/jpeg, image/png"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {groupProfilePic && (
                  <div className="">
                    <span>Preview :</span>
                    <img
                      src={URL.createObjectURL(groupProfilePic)}
                      alt="Group Preview"
                      className="mt-2 size-20 rounded-full object-cover border mx-auto"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                disabled={isDeletingGroup}
                onClick={() => deleteGroupHandler(groupSelected?._id)}
                className="border w-full rounded-md bg-red-400 text-white py-2 outline-none "
              >
                {isDeletingGroup ? "Removing..." : "Delete this group"}
              </button>
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

export default UpdateGroupInfo;
