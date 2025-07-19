import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import type { RootState } from "../../Store/store";
import { GroupRightSideBarContent } from "./GroupRightSideBarContent";

const GroupRightSideBar = () => {
  const { groupSelected, selectedGroupMessages } = useSelector(
    (state: RootState) => state.group
  );

  const [msgImages, setMsgImages] = useState<string[]>([]);

  useEffect(() => {
    setMsgImages(
      selectedGroupMessages
        ?.filter((msg) => msg.image)
        .map((msg) => msg.image) || []
    );
  }, [selectedGroupMessages, groupSelected]);
  console.log("ok");

  return (
    <section
      className={`max-[1200px]:hidden ${
        !groupSelected && "hidden"
      } h-screen px-2 border border-gray-500 rounded w-full`}
    >
      {/* Main container */}
      <GroupRightSideBarContent msgImages={msgImages} />
    </section>
  );
};

export default GroupRightSideBar;
