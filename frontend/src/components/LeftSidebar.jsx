import React, { useState } from "react";
import {
  MdHome,
  MdSearch,
  MdExplore,
  MdMessage,
  MdCreate,
  MdViewList,
  MdPerson,
  MdMoreHoriz,
} from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import { FiLogOut, FiMenu } from "react-icons/fi";
import axios from "axios";

import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import CreatePost from "./CreatePost";
import { setPosts, setSelectedPost } from "../redux/postSlice";

const LeftSidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { likeNotification } = useSelector(
    (store) => store.realTimeNotification
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // State to manage CreatePost modal

  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(null));
        dispatch(setSelectedPost(null));
        dispatch(setPosts([]));
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error logging out");
    }
  };

  const sidebarItems = [
    { icon: <MdHome />, text: "Home" },
    { icon: <MdSearch />, text: "Search" },
    { icon: <MdExplore />, text: "Explore" },
    { icon: <MdMessage />, text: "Messages" },
    { icon: <FaRegHeart />, text: "Notifications" },
    { icon: <MdCreate />, text: "Create" },
    { icon: <MdViewList />, text: "Threads" },
    {
      icon: user?.profilePicture ? (
        <img
          className="w-7 h-7 rounded-full"
          src={user.profilePicture}
          alt="profile"
        />
      ) : (
        <MdPerson className="w-8 h-8" />
      ),
      text: "Profile",
    },
    { icon: <FiLogOut />, text: "Logout" },
    { icon: <MdMoreHoriz />, text: "More" },
  ];

  const sidebarHandler = (textType) => {
    if (textType === "Logout") {
      logoutHandler();
    } else if (textType === "Create") {
      setOpen(true); // Open the CreatePost modal
    } else if (textType === "Profile") {
      navigate(`/profile/${user?._id}`);
    } else if (textType === "Home") {
      navigate("/");
    } else if (textType === "Messages") {
      navigate("/chat");
    } else if (textType === "Notifications") {
      navigate("/notifications"); // Redirect to the notifications page
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-4 left-4 z-20 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white bg-blue-500 rounded-full shadow-md hover:bg-blue-600"
        >
          <FiMenu className="text-xl" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 z-10 h-screen w-64 bg-gray-100 border-r border-gray-300 p-4 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col items-start space-y-6">
          <h1 className="text-2xl font-bold">Mohit Media app</h1>
          <div className="mt-8 space-y-8">
            {sidebarItems.map((item, index) => (
              <div
                key={index}
                className="relative flex items-center gap-2 cursor-pointer"
                onClick={() => sidebarHandler(item.text)}
              >
                <span className="text-2xl">{item.icon}</span>
                <span>{item.text}</span>

                {item.text === "Notifications" &&
                  likeNotification.length > 0 && (
                    <span className="absolute -top-1 mx-3  bg-red-600 text-white rounded-full h-3 w-3 flex items-center justify-center text-xs">
                      {likeNotification.length}
                    </span>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-0 md:ml-64">{/* Your main content goes here */}</div>

      {/* Create Post Modal */}
      <CreatePost open={open} setOpen={setOpen} />
    </>
  );
};

export default LeftSidebar;
