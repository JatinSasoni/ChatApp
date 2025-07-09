import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import RightSidebarContent from "./RightSidebarContent";

const RightSidebar: React.FC = () => {
  const { userSelected, selectedUserMessages } = useSelector(
    (state: RootState) => state.message
  );

  const [msgImages, setMsgImages] = useState<string[] | undefined>([]);

  useEffect(() => {
    setMsgImages(() =>
      selectedUserMessages?.filter((msg) => msg.image).map((msg) => msg.image)
    );
  }, [userSelected, selectedUserMessages]);
  return (
    <section
      className={`w-full ml-2 max-[1160px]:hidden ${
        userSelected ? "block" : "hidden"
      }  p-2 rounded-xl shadow`}
    >
      <RightSidebarContent userSelected={userSelected} msgImages={msgImages} />
    </section>
  );
};

export default RightSidebar;
