import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import FriendAndRequestCard from "./FriendAndRequestCard";

const FriendRequestsPanel: React.FC = () => {
  const { requestReceived, requestSent } = useSelector(
    (state: RootState) => state.friendship
  );

  return (
    <section className="my-4">
      {/* Request received */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Requests received - {requestReceived.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {requestReceived.map((requester) => {
            return (
              <FriendAndRequestCard
                key={requester._id}
                user={requester}
                actionType="accept"
                secondActionType="reject"
              />
            );
          })}
        </ul>
      </div>

      {/* Request sent */}
      <div>
        <h2 className="text-xl font-semibold mb-3">
          Requests sent - {requestSent.length}
        </h2>
        <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
          {requestSent.map((requested) => {
            return (
              <FriendAndRequestCard
                key={requested._id}
                user={requested}
                actionType="cancel"
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default FriendRequestsPanel;
