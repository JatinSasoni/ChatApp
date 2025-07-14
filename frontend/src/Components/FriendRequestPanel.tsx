import { useSelector } from "react-redux";
import type { RootState } from "../../Store/store";
import FriendAndRequestCard from "./FriendAndRequestCard";

const FriendRequestsPanel: React.FC = () => {
  const { requestReceived, requestSent } = useSelector(
    (state: RootState) => state.friendship
  );

  return (
    <section className="my-4 space-y-8">
      {/* Request received */}
      <div>
        <h2 className="text-xl font-medium mb-3">
          Requests received - {requestReceived.length}
        </h2>
        {requestReceived.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
            {requestReceived.map((requester) => (
              <FriendAndRequestCard
                key={requester._id}
                user={requester}
                actionType="accept"
                secondActionType="reject"
              />
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center border border-dashed p-6 rounded-lg">
            <p className="text-lg mb-2">📭 No requests received yet</p>
            <p>Once someone sends you a request, it will appear here.</p>
          </div>
        )}
      </div>

      {/* Request sent */}
      <div>
        <h2 className="text-xl font-medium mb-3">
          Requests sent - {requestSent.length}
        </h2>
        {requestSent.length > 0 ? (
          <ul className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-150px)] pr-1">
            {requestSent.map((requested) => (
              <FriendAndRequestCard
                key={requested._id}
                user={requested}
                actionType="cancel"
              />
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-center border border-dashed p-6 rounded-lg">
            <p className="text-lg mb-2">🚀 You haven't sent any requests</p>
            <p>Find friends and send them a request to connect!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FriendRequestsPanel;
