import React, { useState } from "react";
import { useAppContext } from "../AppContext";
import { Link } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  async function handleSignup(event) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setUser(data.user);

    // Redirect to home page
    window.location.href = "/";
  }

  return (
    <div className="w-1/3 mx-auto mt-16 p-12 bg-gray-50 border border-gray-200 rounded-xl shadow">
      <h1 className="text-3xl font-semibold text-center mb-8">Sign Up</h1>
      <form className="flex flex-col space-y-6">
        <label className="">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border border-gray-200 p-3 rounded-lg"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold p-3 rounded-lg"
          onClick={handleSignup}
        >
          Submit
        </button>
        <div className="flex flex-row gap-x-6 justify-center items-center">
          <p className="margin-right">Already have an account?</p>
          <Link
            to="/login"
            className="bg-green-500 px-3 py-2 rounded-lg text-white font-semibold"
          >
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
