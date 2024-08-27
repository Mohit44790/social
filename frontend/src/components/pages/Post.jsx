import React, { useState } from "react";
import {
  FaRegHeart,
  FaRegBookmark,
  FaUserCircle,
  FaHeart,
} from "react-icons/fa";
import { FiMessageCircle, FiSend } from "react-icons/fi";
import { MdMoreHoriz } from "react-icons/md";
import Comments from "../Comments";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import { setPosts, setSelectedPost } from "../../redux/postSlice";

const Post = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);

  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const dispatch = useDispatch();
  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `https://social-qhb9.onrender.com/api/v1/post/${post._id}/comment`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(res.data);
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );

        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(`${SERVER}/post/${post._id}/${action}`, {
        withCredentials: true,
      });
      console.log(res.data);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `https://social-qhb9.onrender.com/api/v1/post/delete/${post?._id}`,
        {
          withCredentials: true,
        }
      );
      if (res.data.message) {
        const updatedPostData = posts.filter(
          (postItem) => postItem?._id !== post?._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const bookmarkHandler = async () => {
    try {
      const res = await axios.get(
        `https://social-qhb9.onrender.com/api/v1/post/${post?._id}/bookmark`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="my-8 w-full max-w-sm mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {post.author?.profilePicture ? (
              <img
                src={post.author?.profilePicture}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <FaUserCircle className="w-10 h-10 text-gray-400" />
            )}
            <h1 className="font-semibold">{post.author?.username}</h1>
          </div>
          <div className="relative">
            <MdMoreHoriz className="cursor-pointer" onClick={toggleOptions} />
            {showOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white border items-center rounded-lg shadow-lg p-2">
                {post?.author?._id !== user?._id && (
                  <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                    Unfollow
                  </button>
                )}
                <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                  Share
                </button>
                {user && user?._id === post?.author._id && (
                  <button
                    onClick={deletePostHandler}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Delete
                  </button>
                )}

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
        <img
          className="rounded-sm my-2 w-full aspect-square object-cover"
          src={post.image}
          alt="post"
        />
        <div className="flex justify-between">
          <div className="flex gap-2">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={18}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={18}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
            <FiMessageCircle
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer"
              size={18}
            />
            <FiSend className="cursor-pointer" size={18} />
          </div>
          <FaRegBookmark
            onClick={bookmarkHandler}
            className="cursor-pointer"
            size={18}
          />
        </div>
        <span className="font-medium block mb-2">{postLike} likes</span>
        <p>
          <span className="font-medium mr-2">{post.author?.username}</span>
          {post.caption}
        </p>
        <span
          onClick={() => setOpen(true)}
          className="cursor-pointer text-sm text-gray-400"
        >
          {comment.length > 0 && (
            <span
              onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
              }}
              className="cursor-pointer text-sm text-gray-400"
            >
              View all {comment.length} comments
            </span>
          )}
        </span>
        <Comments open={open} setOpen={setOpen} />
        <div className="flex items-center justify-between">
          <input
            type="text"
            placeholder="Add comment..."
            value={text}
            onChange={changeEventHandler}
            className="outline-none text-sm w-full"
          />
          {text && (
            <span
              onClick={commentHandler}
              className="text-[#3BADF8] cursor-pointer"
            >
              {" "}
              Post
            </span>
          )}
        </div>
        <hr />
      </div>
    </>
  );
};

export default Post;
