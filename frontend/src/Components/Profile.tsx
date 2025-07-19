import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useCheckAuth } from "../Hooks/useCheckAuth";
import Navbar from "./Shared/Navbar";
import { useEffect, useState } from "react";
import UpdateProfile from "./UpdateProfile";
import useFetchFriendshipData from "../Hooks/useFetchFriendshipData";
import FriendRequestsPanel from "./FriendRequestPanel";
import FriendsPanel from "./FriendsPanel";

const Profile = () => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [setUpdate, setIsUpdate] = useState<boolean>(false);
  const { fetchRequests } = useFetchFriendshipData();

  useCheckAuth();
  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <section className="sm:flex h-screen text-gray-800 bg-gray-50">
      <Navbar />

      <main className="flex-1 relative p-6 overflow-y-auto shadow-md max-sm:h-[calc(100vh-50px)]">
        {/* Edit Button */}
        <div className="absolute max-sm:top-2 top-6 right-6 z-10">
          <button
            className="bg-white text-blue-500 px-4 py-2 rounded-md text-sm font-medium shadow hover:bg-gray-100"
            onClick={() => setIsUpdate((prev) => !prev)}
          >
            Edit Profile
          </button>
        </div>

        {/* Profile Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 sm:gap-6">
          {/* Left: Profile Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow overflow-hidden">
                <img
                  src={loggedInUser?.Profile.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() =>
                    window.open(loggedInUser?.Profile.profilePhoto)
                  }
                />
              </div>
              <h1 className="text-3xl font-bold mt-3 text-center">
                {loggedInUser?.username}
              </h1>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-xl font-semibold mb-2">About Me</h3>
              <p className="text-gray-600">
                {loggedInUser?.Profile.bio || "No bio available"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="text-xl font-semibold mb-2">
                Contact Information
              </h3>
              <p className="text-gray-600">{loggedInUser?.email}</p>
            </div>
          </div>

          {/* Right: Friends Section */}
          <FriendsPanel />
        </div>

        {/* Update Profile Overlay */}
        {setUpdate && (
          <div className="fixed inset-0 top-0 left-0 bottom-0 right-0 z-50 bg-white/80">
            <UpdateProfile setIsUpdate={setIsUpdate} />
          </div>
        )}
        {/* REQUEST PANEL */}
        <FriendRequestsPanel />
      </main>
    </section>
  );
};

export default Profile;
