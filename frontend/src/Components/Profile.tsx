import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useCheckAuth } from "../Hooks/checkAuth";
import Navbar from "./Shared/Navbar";
import { useState } from "react";
import UpdateProfile from "./UpdateProfile";
import FriendRequestsPanel from "./FriendRequestPanel";

const Profile = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [setUpdate, setIsUpdate] = useState<boolean>(false);
  useCheckAuth();
  return (
    <section className="sm:flex h-screen bg-gray-50  text-gray-800 ">
      {/* Sidebar and Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 relative p-6 overflow-y-auto shadow-md max-sm:h-[calc(100vh-50px)]  ">
        <div>
          {/* Edit Button */}
          <div className="absolute max-sm:top-2 top-6 right-6 ">
            <button
              className="bg-white  text-blue-500 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-gray-100"
              onClick={() => setIsUpdate((prev) => !prev)}
            >
              Edit Profile
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow overflow-hidden">
              <img
                src={loggedInUser?.Profile.profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{loggedInUser?.username}</h1>
            </div>
          </div>

          {/* Profile Content */}
          <div className="space-y-8">
            {/* Bio */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 ">About Me</h3>
              <p className="mt-2 text-gray-600 ">
                {loggedInUser?.Profile.bio || "No bio available"}
              </p>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-xl font-semibold text-gray-700 ">
                Contact Information
              </h3>
              <p className="mt-2 text-gray-600 ">{loggedInUser?.email}</p>
            </div>
          </div>

          {/* Update Modal Overlay */}
          {setUpdate && (
            <div className="absolute top-0 left-0 bottom-0 right-0 ">
              <UpdateProfile setIsUpdate={setIsUpdate} />
            </div>
          )}
        </div>
        <div>
          <FriendRequestsPanel />
        </div>
      </main>
    </section>
  );
};

export default Profile;
