import Sidebar from "./Sidebar";
import MessagesContainer from "./MessagesContainer";
import RightSidebar from "./RightSidebar";
import Navbar from "./Shared/Navbar";
import { useCheckAuth } from "../Hooks/checkAuth";

const Home: React.FC = () => {
  //*Custom hook to authorize user and update store if page refreshes
  useCheckAuth();

  return (
    <section>
      <main className="h-screen  w-screen flex">
        <Navbar />
        <Sidebar />
        <MessagesContainer />
        <RightSidebar />
      </main>
    </section>
  );
};

export default Home;
