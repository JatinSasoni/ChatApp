import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useEffect, useState } from "react";
import type { RootState } from "../../Store/store";
import RightSidebarContent from "./RightSidebarContent";

const MobileProfile = () => {
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery({ minWidth: 1160 });
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );
  const { loggedInUser } = useSelector((state: RootState) => state.auth);
  const [msgImages, setMsgImages] = useState<string[]>([]);

  useEffect(() => {
    const images =
      selectedUserMessages
        ?.filter((msg) => msg.image)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((msg) => msg.image) || [];
    setMsgImages(images);
  }, [selectedUserMessages]);

  useEffect(() => {
    if (isLargeScreen || !loggedInUser) {
      navigate("/");
    }
  }, [isLargeScreen, navigate, loggedInUser]);

  return (
    <section className="p-2 min-[1160px]:hidden">
      <button
        onClick={() => navigate(-1)}
        className="text-md text-blue-500 mb-3"
      >
        ← Back
      </button>
      <RightSidebarContent userSelected={userSelected} msgImages={msgImages} />
    </section>
  );
};

export default MobileProfile;
