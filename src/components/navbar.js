import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../AppContext";

export default function Footer() {
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav className="flex flex-row justify-between py-4 px-12 shadow">
      <h1 className="text-2xl">Hobby Hub</h1>
      <div className="flex flex-row items-center space-x-8">
        <Link to="/">Home</Link>
        {(user === null || user === undefined) && (
          <Link to="/login">Login</Link>
        )}
        {(user === null || user === undefined) && (
          <Link to="/signup">Signup</Link>
        )}
        {user && (
          <div className="flex flex-row space-x-8">
            <Link to="/profile" className="">
              Profile
            </Link>
            <Link to="/matches" className="">
              Matches
            </Link>
            <Link to="/chat" className="">
              Chat
            </Link>
            <button onClick={handleLogout} className="">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
