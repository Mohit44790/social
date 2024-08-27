import React from "react";
import { FaUserCircle } from "react-icons/fa";

const CommentMessages = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        {comment?.author?.profilePicture ? (
          <img
            src={comment?.author?.profilePicture}
            alt="profile"
            className="w-6 h-6 rounded-full"
          />
        ) : (
          <FaUserCircle className="w-6 h-6 text-gray-400" />
        )}
        <h1 className="font-semibold text-xs">
          {comment?.author.username}{" "}
          <span className="font-normal pl-1">{comment?.text}</span>
        </h1>
      </div>
    </div>
  );
};

export default CommentMessages;
