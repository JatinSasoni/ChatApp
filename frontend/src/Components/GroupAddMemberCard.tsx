import { useSelector } from "react-redux";
import type { user } from "../../types/models";
import type { RootState } from "../../Store/store";
import { AiOutlineUserAdd } from "react-icons/ai";

type Props = {
  friend: user;
  selected: boolean;
  onSelect: (friendId: string) => void;
};

const GroupAddMemberCard: React.FC<Props> = ({
  friend,
  selected,
  onSelect,
}) => {
  const { onlineUsers } = useSelector((state: RootState) => state.auth);
  const { groupSelected } = useSelector((state: RootState) => state.group);

  const isAlreadyMember = groupSelected?.members.some(
    (m) => m._id === friend._id
  );

  const handleSelect = () => {
    if (!isAlreadyMember) {
      onSelect(friend._id);
    }
  };

  return (
    <li
      className={`cursor-pointer group p-1 rounded ${
        selected ? "bg-blue-100" : "hover:bg-gray-100"
      }`}
      onClick={handleSelect}
    >
      <div className="flex gap-2">
        <img
          src={friend?.Profile?.profilePhoto || "/avatar_icon.png"}
          alt="Profile-Photo"
          className="size-10 rounded-full object-cover"
        />

        <div className="flex justify-between pr-3 w-full items-center">
          <div>
            <p className="group-hover:scale-105 duration-300">
              {friend.username}
            </p>
            <p
              className={`text-xs ${
                onlineUsers.includes(friend._id) ? "text-green-500" : ""
              }`}
            >
              {onlineUsers.includes(friend._id) ? "Online" : "Offline"}
            </p>
          </div>

          <div>
            {isAlreadyMember ? (
              <span className="text-xs text-gray-500">Already in group</span>
            ) : (
              <AiOutlineUserAdd
                className={`my-auto size-5 ${
                  selected ? "text-blue-500" : "hover:scale-110 duration-200"
                }`}
              />
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

export default GroupAddMemberCard;
