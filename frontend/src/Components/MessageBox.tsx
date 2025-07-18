import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import type { Message } from "../../types/models";
import { convertToLocaleFormat } from "../../Utils/LocalDateFormat";

type Props = {
  message: Message;
};

const MessageBox: React.FC<Props> = ({ message }) => {
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const isCurrentUser = message.senderId._id === loggedInUser?._id;

  return (
    <div
      className={`my-2 flex gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}
    >
      {/* Profile picture with better spacing */}
      <div className="flex-shrink-0 self-end mb-1">
        <img
          src={message.senderId.Profile.profilePhoto}
          alt={`friends-pfp`}
          className="size-9 rounded-full object-cover border border-gray-200"
        />
      </div>

      {/* Message content container */}
      <div
        className={`flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        {message.image ? (
          <div className="max-w-[280px]">
            <img
              src={message.image}
              alt="Shared content"
              className="rounded-xl border border-gray-200 transition-all duration-200 
                   group-hover:shadow-md group-hover:scale-[1.01] cursor-pointer"
              onClick={() => window.open(message.image)}
            />
          </div>
        ) : (
          <div
            className={`break-words max-w-[240px] p-3 rounded-2xl text-sm leading-snug ${
              isCurrentUser
                ? "bg-purple-600 text-white rounded-br-sm"
                : "bg-gray-100 text-gray-800 rounded-bl-sm"
            } shadow-sm`}
          >
            {message.text}
          </div>
        )}

        {/* Timestamp with subtle styling */}
        <MessageTimestamp time={message.createdAt} alignRight={isCurrentUser} />
      </div>
    </div>
  );
};

function MessageTimestamp({
  time,
  alignRight,
}: {
  time: string;
  alignRight: boolean;
}) {
  return (
    <p className={`text-[10px] mt-1 ${alignRight && "text-end"}`}>
      {convertToLocaleFormat(time)}
    </p>
  );
}
export default MessageBox;
