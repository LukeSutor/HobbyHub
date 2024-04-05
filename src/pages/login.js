import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, supabase } = useAppContext();

  async function handleLogin(event) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    // redirect to home page if login successful, otherwise go to the login_unsuccessful page
    setUser(data.user);
    if (error) {
      window.location.href = "/login_unsuccessful";
    } else {
      window.location.href = "/";
    }
  }

  return (
    <div className="w-1/3 mx-auto mt-16 p-12 bg-gray-50 border border-gray-200 rounded-xl shadow">
      <h1 className="text-3xl font-semibold text-center mb-8">Welcome Back</h1>
      <form className="flex flex-col space-y-6">
        <label>
          <input
            type="email"
            name="email"
            className="w-full border border-gray-200 p-3 rounded-lg"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            className="w-full border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg"
          onClick={handleLogin}
        >
          Login
        </button>
        <div className="flex flex-row gap-x-6 justify-center items-center">
          <p className="">Dont have an account yet?</p>
          <Link
            to="/signup"
            className="bg-green-500 px-3 py-2 rounded-lg text-white font-semibold"
          >
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
}
