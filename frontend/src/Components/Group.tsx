import { useSelector } from "react-redux";
import { useCheckAuth } from "../Hooks/checkAuth";
import { useFetchUsers } from "../Hooks/fetchUsers";
import CreateGroup from "./CreateGroup";
import GroupContainer from "./GroupContainer";
import GroupSidebar from "./GroupSidebar";
import Navbar from "./Shared/Navbar";
import type { RootState } from "../../Store/store";
import GroupRightSideBar from "./GroupRightSideBar";

const Group = () => {
  useCheckAuth();
  useFetchUsers();
  const { groupSelected } = useSelector((state: RootState) => state.group);

  return (
    <section className="flex">
      <Navbar />
      <GroupSidebar />
      {groupSelected ? (
        <>
          <GroupContainer /> <GroupRightSideBar />
        </>
      ) : (
        <CreateGroup />
      )}
    </section>
  );
};

export default Group;
