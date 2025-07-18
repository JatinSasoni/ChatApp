import { useSelector } from "react-redux";
import { useCheckAuth } from "../Hooks/checkAuth";
import { useFetchUsers } from "../Hooks/fetchUsers";
import GroupContainer from "./GroupContainer";
import GroupSidebar from "./GroupSidebar";
import Navbar from "./Shared/Navbar";
import type { RootState } from "../../Store/store";
import GroupRightSideBar from "./GroupRightSideBar";
import UpdateGroupInfo from "./UpdateGroupInfo";

const Group = () => {
  useCheckAuth();
  useFetchUsers();
  const { isGroupUpdateBoxOpen } = useSelector(
    (state: RootState) => state.group
  );

  return (
    <section className="flex">
      <Navbar />
      <GroupSidebar />
      <GroupContainer />
      <GroupRightSideBar />
      {isGroupUpdateBoxOpen && (
        <div className="fixed inset-0 top-0 left-0 bottom-0 right-0 z-50 bg-white/80">
          <UpdateGroupInfo />
        </div>
      )}
    </section>
  );
};

export default Group;
