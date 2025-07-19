import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useEffect, useState } from "react";
import { GroupRightSideBarContent } from "./GroupRightSideBarContent";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";
import UpdateGroupInfo from "./UpdateGroupInfo";

const GroupProfileMobileOnly = () => {
  const navigate = useNavigate();
  const isLargeScreen = useMediaQuery({ minWidth: 1160 });

  const { groupSelected, selectedGroupMessages, isGroupUpdateBoxOpen } =
    useSelector((state: RootState) => state.group);
  const { loggedInUser } = useSelector((state: RootState) => state.auth);

  const [msgImages, setMsgImages] = useState<string[]>([]);

  useEffect(() => {
    setMsgImages(
      selectedGroupMessages
        ?.filter((msg) => msg.image)
        .map((msg) => msg.image) || []
    );
  }, [selectedGroupMessages, groupSelected]);

  useEffect(() => {
    if (!loggedInUser) {
      navigate("/");
    }
    if (isLargeScreen) {
      navigate("/groups");
    }
  }, [isLargeScreen, navigate, loggedInUser]);
  return (
    <section className="p-2 min-[1160px]:hidden">
      {/* Main container */}
      <GroupRightSideBarContent msgImages={msgImages} />

      {isGroupUpdateBoxOpen && !isLargeScreen && (
        <div className="fixed inset-0 z-50 bg-white/80">
          <UpdateGroupInfo />
        </div>
      )}
    </section>
  );
};

export default GroupProfileMobileOnly;
