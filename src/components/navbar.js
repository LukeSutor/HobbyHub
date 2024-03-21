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
            <div className="row align-items-start justify-items-end">
              <li className="col">
                <Link to="/profile" className="nav-link links">
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/matches" className="nav-link links">
                  Matches
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link links">
                  Logout
                </button>
              </li>
            </div>
          )}
        </ul>
      </nav>
    </div>
  );
}
