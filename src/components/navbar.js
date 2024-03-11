import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../AppContext";
import "./navbar.css";

export default function Footer() {
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="container-fluid justify-content-end">
          <Link to="/" className="nav-link links">
            Home
          </Link>
          <Link to="/login" className="nav-link links">
            Login
          </Link>
          <Link to="/signup" className="nav-link links">
            Signup
          </Link>
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
        </div>
      </nav>
    </div>
  );
}
