import React from "react";
import { useSelector } from "react-redux";
import SuggestedUsers from "./SuggestedUsers";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  return (
    <div className="w-fit my-10 pr-12 hidden md:block">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          {user?.profilePicture ? (
            <img
              src={user?.profilePicture}
              alt="profile"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <FaUserCircle className="w-10 h-10 text-gray-400" />
          )}
        </Link>

        <div>
          <h1 className="font-semibold text-sm">
            <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
          </h1>
          <span className="text-gray-600 text-sm">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>
      <SuggestedUsers />
    </div>
  );
};

export default RightSidebar;
