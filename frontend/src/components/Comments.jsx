import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdMoreHoriz, MdOutlineVerified } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import CommentMessages from "./CommentMessages";

import axios from "axios";
import { toast } from "react-toastify";
import { setPosts } from "../redux/postSlice";

const Comments = ({ open, setOpen }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText.trim() || ""); // Set text or reset if empty
  };

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  // Function to handle clicking outside of the modal
  const handleClickOutside = (e) => {
    if (e.target.id === "modal-overlay") {
      setOpen(false);
    }
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send comment");
    }
  };

  return (
    open && (
      <div
        id="modal-overlay"
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50"
        onClick={handleClickOutside}
      >
        <div className="bg-white p-2 rounded-md relative w-4/5 max-w-2xl mx-auto">
          <div className="flex flex-1 gap-2">
            <div>
              <img
                className="w-96 h-96 rounded-lg"
                src={selectedPost?.image}
                alt="post"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between my-2">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Link>
                    {selectedPost?.author?.profilePicture ? (
                      <img
                        src={selectedPost?.author?.profilePicture}
                        alt="profile"
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <FaUserCircle className="w-6 h-6 text-gray-400" />
                    )}
                  </Link>
                  <div className="flex gap-1 items-center">
                    <Link className="font-semibold text-xs">
                      {selectedPost?.author?.username}
                    </Link>
                    <span>
                      <MdOutlineVerified className="text-blue-600" />
                    </span>
                  </div>
                </div>
                <div className="relative">
                  <MdMoreHoriz
                    className="cursor-pointer text-lg"
                    onClick={toggleOptions}
                  />
                  {showOptions && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border items-center rounded-lg shadow-lg p-2">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Unfollow
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Share
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                        Delete
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={toggleOptions}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <hr className="border-b-orange-300 my-2" />
              <div className="flex-1 overflow-y-auto max-h-90">
                {comment.map((comment) => (
                  <CommentMessages key={comment._id} comment={comment} />
                ))}
              </div>
              <div className="p-2">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={text}
                    onChange={changeEventHandler}
                    className="w-full outline-none border text-sm border-gray-300 p-2 rounded"
                  />
                  <button
                    onClick={sendMessageHandler}
                    className="outline-none border p-2 rounded"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Comments;
