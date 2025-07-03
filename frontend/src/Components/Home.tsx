import Sidebar from "./Sidebar";
import MessagesContainer from "./MessagesContainer";
import RightSidebar from "./RightSidebar";
import Navbar from "./Shared/Navbar";
import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import { useCheckAuth } from "../Hooks/checkAuth";

const Home: React.FC = () => {
  const { userSelected } = useSelector((state: RootState) => state.message);

  //*Custom hook to authorize user and update store if page refreshes
  useCheckAuth();

  return (
    <section>
      <Navbar />
      <main>
        <div
          className={`mx-auto max-w-7xl my-3 h-[600px] max-h-[800px] grid ${
            userSelected ? "grid-cols-4 gap-3" : "grid-cols-2"
          }`}
        >
          <Sidebar />
          <MessagesContainer />
          <RightSidebar />
        </div>
      </main>
    </section>
  );
};

export default Home;
