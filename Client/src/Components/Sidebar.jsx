import assets, { userDummyData } from "../../chat-app-assets/assets";

const Sidebar = ({ setUserSelected, userSelected }) => {
  return (
    <div className=" p-2 overflow-scroll h-full">
      {/* Header */}
      <div className="flex justify-between">
        <p className="text-2xl text-white">Public Chats</p>
        <div className="relative group">
          <img
            src={assets.menu_icon}
            alt=""
            width="30"
            className="cursor-pointer"
          />
          <div className="absolute group hidden group-hover:block border-white border right-5 p-2 w-30 backdrop-blur-md">
            <button className="text-white px-2 hover:scale-105 ">
              Edit Profile
            </button>
            <hr className="text-white" />
            <button className="text-white px-2 hover:scale-105">Logout</button>
          </div>
        </div>
      </div>
      {/* Search Contact */}
      <div className="flex gap-2 bg-blue-950 rounded-xl items-center px-2 my-3 py-1 ">
        <img src={assets.search_icon} alt="" className="size-3" />
        <input
          type="text"
          className="w-full outline-none text-white"
          placeholder="Search User..."
        />
      </div>
      {/*Friends */}
      <aside>
        <ul className="flex flex-col gap-3">
          {userDummyData.map((user, key) => {
            return (
              <li
                key={key}
                className="cursor-pointer group"
                onClick={() => setUserSelected((prev) => !prev)}
              >
                <div className="flex  p-1 gap-2">
                  <img
                    src={user.profilePic}
                    alt=""
                    className="size-11 rounded-full"
                  />
                  <div className="text-white">
                    <p className="group group-hover:scale-105 duration-300">
                      {user.fullName}
                    </p>
                    <p className="text-xs">Offline</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
