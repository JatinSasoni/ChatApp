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
  return (
    <div
      className={`m-2 py-1 flex ${
        message.senderId === loggedInUser?._id ? "flex-row-reverse" : ""
      }`}
    >
      {message.image && (
        <div>
          <img
            src={message.image}
            className="size-40 hover:translate-x-0.5 duration-300"
            onClick={() => window.open(message.image)}
          />
          <p
            className={`text-xs mt-1 ${
              message.senderId === loggedInUser?._id && "text-end"
            } `}
          >
            {convertToLocaleFormat(message.createdAt)}
          </p>
        </div>
      )}

      {message.text && (
        <div>
          <p className="break-all max-w-60 bg-zinc-800 text-white p-2 rounded-xl">
            {message.text}
          </p>
          <p
            className={`text-[10px] ${
              message.senderId === loggedInUser?._id && "text-end"
            } `}
          >
            {convertToLocaleFormat(message.createdAt)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageBox;
