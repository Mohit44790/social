import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { setAuthUser } from "../redux/authSlice";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";

const EditProfile = () => {
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setInput({ ...input, profilePhoto: file });
  };

  const selectChangeHandler = (e) => {
    setInput({ ...input, gender: e.target.value });
  };

  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/profile/edit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user.gender,
        };
        dispatch(setAuthUser(updatedUserData));
        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
        alert(res.data.message); // Simple notification
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message); // Simple error alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>
        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle className="w-10 h-10 text-gray-400" />
            )}
            <div>
              <h1 className="font-bold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>
          <input
            ref={imageRef}
            onChange={fileChangeHandler}
            type="file"
            className="hidden"
          />
          <button
            onClick={() => imageRef.current.click()}
            className="bg-blue-500 text-white h-8 px-4 rounded"
          >
            Change photo
          </button>
        </div>
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <textarea
            value={input.bio}
            onChange={(e) => setInput({ ...input, bio: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <h1 className="font-bold mb-2">Gender</h1>
          <select
            value={input.gender}
            onChange={selectChangeHandler}
            className="w-full p-2 border rounded"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="flex justify-end">
          {loading ? (
            <button className="bg-blue-500 text-white h-8 px-4 rounded">
              Please wait...
            </button>
          ) : (
            <button
              onClick={editProfileHandler}
              className="bg-blue-500 text-white h-8 px-4 rounded"
            >
              Submit
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
