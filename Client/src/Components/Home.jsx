import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MessagesContainer from "./MessagesContainer";
import RightSidebar from "./RightSidebar";
import Navbar from "./Shared/Navbar";

const Home = () => {
  const [userSelected, setUserSelected] = useState(null);

  return (
    <section>
      <Navbar />
      <main>
        <div
          className={`mx-auto max-w-7xl my-3 h-[600px] max-h-[800px] grid ${
            userSelected ? "grid-cols-4 gap-3" : "grid-cols-2"
          }`}
        >
          <Sidebar
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
          <MessagesContainer
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
          <RightSidebar
            userSelected={userSelected}
            setUserSelected={setUserSelected}
          />
        </div>
      </main>
    </section>
  );
};

export default Home;
