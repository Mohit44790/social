import React, { useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { setPosts } from "../redux/postSlice"; // Import setPosts action
import { FaImage, FaUserCircle } from "react-icons/fa"; // Import image icon from react-icons

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", caption);
    if (imagePreview) formData.append("image", file);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts])); // Update posts in the Redux store
        setOpen(false); // Close modal after successful post creation
        toast.success(res.data.message); // Show success toast
        setCaption(""); // Reset caption
        setImagePreview(""); // Reset image preview
        setFile(""); // Reset file input
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    open && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white w-full max-w-md rounded-lg p-5 shadow-lg mx-4">
          <button
            className="text-gray-500 float-right"
            onClick={() => setOpen(false)}
          >
            &times;
          </button>
          <h2 className="text-center font-semibold mb-4">Create New Post</h2>
          <div className="flex gap-3 items-center mb-4">
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
              <h1 className="font-semibold">{user?.username}</h1>
            </div>
          </div>
          <form onSubmit={createPostHandler}>
            <div className="w-full h-64 mb-4 flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="preview_img"
                  className="object-cover h-full w-full rounded-md"
                />
              ) : (
                <FaImage className="text-gray-400 text-6xl" />
              )}
            </div>
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              onChange={fileChangeHandler}
            />
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write a caption..."
            />
            <button
              type="button"
              onClick={() => imageRef.current.click()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded mb-4"
            >
              Create New Post
            </button>
            {imagePreview && (
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
                disabled={loading}
              >
                {loading ? "Please wait..." : "Post"}
              </button>
            )}
          </form>
        </div>
      </div>
    )
  );
};

export default CreatePost;
