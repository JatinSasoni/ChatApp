import toast from "react-hot-toast";
import { api } from "../../Api/axios";
import type { user } from "../../types/models";

type Props = {
  user: user;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  actionType: "accept" | "cancel" | "unfriend";
  secondActionType?: "reject";
  onActionComplete: () => Promise<void>;
};

const FriendAndRequestCard: React.FC<Props> = ({
  user,
  setLoading,
  actionType,
  secondActionType,
  onActionComplete,
  loading,
}) => {
  // Handle actions: accept, reject, cancel
  const handleAction = async (
    type: "accept" | "reject" | "cancel" | "unfriend",
    requestId: string | undefined
  ) => {
    try {
      setLoading(true);
      if (type === "accept") {
        await api.patch(`/api/v1/friendship/accept/${requestId}/request`, "", {
          withCredentials: true,
        });
        await onActionComplete();
        toast.success("Accepted");
      } else {
        await api.delete(`/api/v1/friendship/delete/${requestId}/request`, {
          withCredentials: true,
        });
        await onActionComplete();
        toast.success(
          type === "cancel"
            ? "Cancelled"
            : type === "unfriend"
            ? "friend removed"
            : "rejected"
        );
      }
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const getButtonColor = (type: string) => {
    switch (type) {
      case "accept":
        return "bg-green-500";
      case "reject":
      case "unfriend":
        return "bg-red-500";
      case "cancel":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <li className="flex items-center justify-between bg-slate-100 p-3 rounded shadow-sm">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <img
          src={user.Profile.profilePhoto || "/avatar_icon.png"}
          alt="avatar"
          className="size-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{user.username}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          className={`${getButtonColor(
            actionType
          )} text-white text-xs px-3 py-1 rounded w-16`}
          onClick={() => handleAction(actionType, user._id)}
        >
          {loading ? <div className="animate-bounce">....</div> : actionType}
        </button>
        {secondActionType && (
          <button
            className={`${getButtonColor(
              actionType
            )} text-white text-xs px-3 py-1 rounded`}
            onClick={() => handleAction(secondActionType, user._id)}
          >
            {loading ? (
              <div className="animate-bounce">....</div>
            ) : (
              secondActionType
            )}
          </button>
        )}
      </div>
    </li>
  );
};

export default FriendAndRequestCard;
