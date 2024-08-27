import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../../redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);

        setInput({ email: "", password: "" });
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-8 bg-white rounded"
      >
        <div className="my-4">
          <h1 className="text-2xl font-bold">Login</h1>
        </div>

        <div className="my-2">
          <label htmlFor="email" className="block font-medium">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="border rounded p-2 w-full"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="my-2">
          <label htmlFor="password" className="block font-medium">
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="border rounded p-2 w-full"
            placeholder="Enter password"
            required
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white py-2 px-4 rounded ${
            loading ? "cursor-not-allowed opacity-50" : "hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <div className="mt-4 text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
