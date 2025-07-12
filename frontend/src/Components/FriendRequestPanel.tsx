import { useEffect, useState } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import toast from "react-hot-toast";
import type { user } from "../../types/models";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { setFriends } from "../../Store/Slices/friends-slice";
import FriendAndRequestCard from "./FriendAndRequestCard";

const FriendRequestsPanel: React.FC = () => {
  const dispatch = useDispatch();
  const [requestSent, setRequestSent] = useState<user[]>([]);
  const [requestReceived, setRequestReceived] = useState<user[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { friends } = useSelector((state: RootState) => state.friendship);

  // Fetch friend requests on mount
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/friendship/get/requests", {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setFriends(res.data.totalFriends));
        setRequestSent(res.data.requestSent);
        setRequestReceived(res.data.requestReceived);
      }

      //store
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch requests");
      } else {
        console.log(err);
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, [dispatch]);

  return (
    <div className="h-full">
      {/* total friends */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Friends - {friends.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {friends.map((friend) => {
            return (
              <FriendAndRequestCard
                key={friend._id}
                setLoading={setLoading}
                user={friend}
                actionType="unfriend"
                onActionComplete={fetchRequests}
                loading={loading}
              />
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
          {requestReceived.map((requester) => {
            return (
              <FriendAndRequestCard
                key={requester._id}
                setLoading={setLoading}
                user={requester}
                actionType="accept"
                secondActionType="reject"
                onActionComplete={fetchRequests}
                loading={loading}
              />
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
          {requestSent.map((requested) => {
            return (
              <FriendAndRequestCard
                key={requested._id}
                setLoading={setLoading}
                user={requested}
                actionType="cancel"
                onActionComplete={fetchRequests}
                loading={loading}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FriendRequestsPanel;
