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
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/signup">Signup</Link>
          </li>
          {user && (
            <div>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}
