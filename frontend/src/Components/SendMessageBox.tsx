import { useState, type ChangeEvent } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useFetchAndSend } from "../Hooks/fetchAndSendMessage";
import { TfiGallery } from "react-icons/tfi";

type Props = {
  setUploading: React.Dispatch<React.SetStateAction<boolean>>;
  uploading: boolean;
};

const SendMessageBox: React.FC<Props> = ({ setUploading, uploading }) => {
  const [input, setInput] = useState<string>("");
  const { userSelected } = useSelector((state: RootState) => state.message);

  const { sendMessage } = useFetchAndSend(); //CUSTOM HOOK

  //* SEND MESSAGE HANDLER
  const sendMessageHandler = () => {
    if (input.trim() === "") return;
    sendMessage(input.trim(), userSelected?._id);
    setInput("");
  };

  //* SEND IMAGE
  const sendImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file || !userSelected?._id) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("Image too large (max 5MB)");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      setUploading(true);
      const result = reader.result as string;
      await sendMessage("", userSelected._id, result);
      e.target.value = "";
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex m-1 p-1 shadow-2xl ">
      <input
        type="text"
        className="w-full h-10 rounded-xl outline-none bg-neutral-100 pl-2 border"
        placeholder="Your message... "
        name="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? sendMessageHandler() : null)}
      />
      <label htmlFor="image" className="mx-2 grid place-items-center">
        <TfiGallery className="size-6 hover:scale-105" />
      </label>
      <input
        type="file"
        id="image"
        accept="image/png, image/gif, image/jpeg"
        className="hidden"
        onChange={sendImageHandler}
      />

      <button onClick={sendMessageHandler} disabled={uploading}>
        <img src="/send_button.svg" alt="send" className="size-8" />
      </button>
    </div>
  );
};

export default SendMessageBox;
