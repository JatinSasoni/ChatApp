import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import axios from "axios";
import toast from "react-hot-toast";
import { api } from "../../Api/axios";
import { setAllGroups } from "../../Store/Slices/Group-slice";

const CreateGroup = () => {
  const dispatch = useDispatch();
  const { friends } = useSelector((state: RootState) => state.friendship);
  const { groups } = useSelector((state: RootState) => state.group);
  const [groupName, setGroupName] = useState("");
  const [groupProfilePic, setGroupProfilePic] = useState<File | null>();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const groupProfileRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    let profilePhoto: string | ArrayBuffer | null = "/avatar_icon.png";
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

    try {
      setLoading(true);
      const response = await api.post("/api/v1/groups/create", newGroup, {
        withCredentials: true,
      });

      if (response.data.success) {
        dispatch(setAllGroups([...groups, response.data?.newGroup]));
        toast.success(response.data.message);
        setGroupName("");
        setGroupProfilePic(null);
        setPreviewUrl(null);
        setSelectedFriends([]);
        if (groupProfileRef.current) {
          groupProfileRef.current.value = "";
        }
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!groupProfilePic) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(groupProfilePic);
    setPreviewUrl(objectUrl);
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [groupProfilePic]);

  return (
    <section className="w-full flex justify-center items-center min-h-screen bg-gray-50">
      <form
        className="w-full max-w-md mx-auto p-6 bg-white border-1 border-slate-400 rounded-xl shadow-lg space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          Create a Group
        </h2>

        <div>
          <label
            className="block text-gray-700 font-semibold mb-2"
            htmlFor="profilePhoto"
          >
            Group Avatar:
          </label>
          <input
            id="profilePhoto"
            type="file"
            ref={groupProfileRef}
            accept="image/jpeg, image/png"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setGroupProfilePic(e.target?.files?.[0])
            }
            className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
          {groupProfilePic && previewUrl && (
            <img
              src={previewUrl}
              alt="Group Preview"
              className="mt-2 size-20 rounded-full object-cover border"
            />
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-semibold mb-2"
          >
            Group Name:
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        <div>
          <p className="text-gray-700 font-semibold mb-2">Select Members:</p>
          <div className="max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50 space-y-2">
            {friends.length === 0 ? (
              <p className="text-gray-500">No friends available</p>
            ) : (
              friends.map((friend) => (
                <label
                  key={friend._id}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(friend._id)}
                    onChange={() => handleFriendToggle(friend._id)}
                    className="accent-blue-500"
                  />
                  <span className="text-gray-700">{friend.username}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow focus:outline-none focus:ring focus:ring-blue-300"
        >
          {loading ? "Creating.." : "Create Group"}
        </button>
      </form>
    </section>
  );
};

export default CreateGroup;
