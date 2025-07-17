import { useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "../../Api/axios";

const CreateGroup = () => {
  const { friends } = useSelector((state: RootState) => state.friendship);

  const [groupName, setGroupName] = useState("");
  const [groupProfilePic, setGroupProfilePic] = useState<File | null>();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleFriendToggle = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    if (selectedFriends.length === 0) {
      setError("Select at least one member");
      return;
    }

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
    setError("");

    const newGroup = {
      groupName,
      members: selectedFriends,
      profilePhoto,
    };

    // TODO: Trigger API call or redux dispatch here
    try {
      const response = await api.post("/api/v1/groups/create", newGroup, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setGroupName("");
        setSelectedFriends([]);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <section className="w-full ">
      <form
        className="max-w-md mx-auto mt-20 p-6 bg-white border rounded-lg shadow-lg"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6">Create a Group</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Group Avatar:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
            type="file"
            placeholder="Enter group name"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setGroupProfilePic(e.target?.files?.[0])
            }
            id="ProfilePhoto"
            accept="image/jpeg, image/png"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="name">
            Group Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <p className="text-gray-700 font-bold mb-2">Select Members:</p>
          <div className="max-h-48 overflow-y-auto border rounded p-2">
            {friends.length === 0 ? (
              <p className="text-gray-500">No friends available</p>
            ) : (
              friends.map((friend) => (
                <label key={friend._id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend._id)}
                    onChange={() => handleFriendToggle(friend._id)}
                    className="mr-2"
                  />
                  <span>{friend.username}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Create Group
        </button>
      </form>
    </section>
  );
};

export default CreateGroup;
