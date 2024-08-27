import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

const Notifications = () => {
  // Fetching notifications from the Redux store
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );

  return (
    <div className="p-4 mx-60">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {likeNotification.length === 0 ? (
        <p>No new notifications</p>
      ) : (
        <div className="space-y-1">
          {likeNotification.map((notification) => (
            <div
              key={notification.userId}
              className="flex items-center  p-2 border border-gray-300 rounded-lg"
            >
              {/* Profile Picture */}

              {notification.userDetails?.profilePicture ? (
                <img
                  src={notification.userDetails?.profilePicture}
                  alt="profile"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <FaUserCircle className="w-6 h-6 text-gray-400" />
              )}
              <div>
                {/* Username and notification text */}
                <p className="text-sm">
                  <span className="font-bold">
                    {notification.userDetails?.username}
                  </span>{" "}
                  liked your post.
                </p>
                {/* Comment details, if available */}
                {notification.comment && (
                  <p className="text-sm text-gray-600">
                    Comment: {notification.comment}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
