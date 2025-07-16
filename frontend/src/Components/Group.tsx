import { useCheckAuth } from "../Hooks/checkAuth";
import { useFetchUsers } from "../Hooks/fetchUsers";
import CreateGroup from "./CreateGroup";
import GroupContainer from "./GroupContainer";
import GroupSidebar from "./GroupSidebar";
import Navbar from "./Shared/Navbar";

const Group = () => {
  useCheckAuth();
  useFetchUsers();

  return (
    <section className="flex">
      <Navbar />
      <GroupSidebar />
      <GroupContainer />
    </section>
  );
};

export default Group;
