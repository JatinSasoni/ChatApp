import Sidebar from "./Sidebar";
import MessagesContainer from "./MessagesContainer";
import RightSidebar from "./RightSidebar";
import Navbar from "./Shared/Navbar";
import { useEffect, useState } from "react";
import { api } from "../../Api/axios";
import axios from "axios";
import type { user } from "../../types/models";

const Home: React.FC = () => {
  const [userSelected, setUserSelected] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<user[] | null>(null);

  const fetchOnlineUsers = async () => {
    try {
      const response = await api.get("/api/v1/user/get-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      if (response.data.success) {
        setAllUsers(response.data.users);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
      } else {
        console.log("An unexpected error occurred:", error);
      }
    }
  };

  useEffect(() => {
    fetchOnlineUsers();
  }, []);

  return (
    <section>
      <Navbar />
      <main>
        <div
          className={`mx-auto max-w-7xl my-3 h-[600px] max-h-[800px] grid ${
            userSelected ? "grid-cols-4 gap-3" : "grid-cols-2"
          }`}
        >
          <Sidebar allUsers={allUsers} setUserSelected={setUserSelected} />
          <MessagesContainer
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
          <RightSidebar userSelected={userSelected} />
        </div>
      </main>
    </section>
  );
};

export default Home;
