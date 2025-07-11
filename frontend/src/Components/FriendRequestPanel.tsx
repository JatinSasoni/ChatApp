import { useEffect, useState } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import toast from "react-hot-toast";
import type { user } from "../../types/models";

interface FriendRequest {
  _id: string;
  requester?: user; // for incoming
  receiver?: user; // for outgoing
  status: "pending" | "accepted";
}

const FriendRequestsPanel: React.FC = () => {
  const [requestSent, setRequestSent] = useState<FriendRequest[]>([]);
  const [requestReceived, setRequestReceived] = useState<FriendRequest[]>([]);
  const [totalFriends, setTotalFriends] = useState<user[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch friend requests on mount
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/v1/friendship/get/requests", {
          withCredentials: true,
        });
        console.log(res);

        if (res.data.success) {
          setTotalFriends(res.data.totalFriends);
          setRequestSent(res.data.requestSent);
          setRequestReceived(res.data.requestReceived);
        }

        //store
      } catch (err) {
        if (axios.isAxiosError(err)) {
          toast.error(
            err.response?.data?.message || "Failed to fetch requests"
          );
        } else {
          console.log(err);

          toast.error("Unexpected error");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle actions: accept, reject, cancel
  const handleAction = async (
    type: "accept" | "reject" | "cancel",
    requestId: string
  ) => {
    try {
      setLoading(true);
      if (type === "accept") {
        await api.post(`/api/v1/friendship/accept/${requestId}`, "", {
          withCredentials: true,
        });
        toast.success("Accepted");
      } else {
        await api.delete(`/api/v1/friendship/${type}/${requestId}`, {
          withCredentials: true,
        });
        toast.success(type === "cancel" ? "Cancelled" : "Rejected");
      }

      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full">
      {/* total friends */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Friends - {totalFriends.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {totalFriends.map((friend) => {
            return (
              <li
                key={friend._id}
                className="flex items-center justify-between bg-slate-100 p-3 rounded shadow-sm"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={friend.Profile.profilePhoto || "/avatar_icon.png"}
                    alt="avatar"
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{friend.username}</p>
                    <p className="text-xs text-gray-500">{friend.email}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                    onClick={() => handleAction("cancel", friend._id)}
                  >
                    cancel
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Request received */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Requests received - {requestReceived.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {requestReceived.map((friendDoc) => {
            return (
              <li
                key={friendDoc._id}
                className="flex items-center justify-between bg-slate-100 p-3 rounded shadow-sm"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      friendDoc.requester?.Profile.profilePhoto ||
                      "/avatar_icon.png"
                    }
                    alt="avatar"
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {friendDoc.requester?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {friendDoc.requester?.email}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                    onClick={() =>
                      handleAction("cancel", friendDoc.requester?._id)
                    }
                  >
                    cancel
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Request sent */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Requests sent - {requestSent.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {requestSent.map((friendDoc) => {
            return (
              <li
                key={friendDoc._id}
                className="flex items-center justify-between bg-slate-100 p-3 rounded shadow-sm"
              >
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <img
                    src={
                      friendDoc.receiver?.Profile.profilePhoto ||
                      "/avatar_icon.png"
                    }
                    alt="avatar"
                    className="size-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">
                      {friendDoc.receiver?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {friendDoc.receiver?.email}
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white text-xs px-3 py-1 rounded"
                    onClick={() =>
                      handleAction("cancel", friendDoc.receiver?._id)
                    }
                  >
                    cancel
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequestsPanel;
