import React, { useState } from "react";
import { useAppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import "./signup.css";

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
  }

  return (
    <div className="page">
      <div className="container rounded-4">
        <h1 className="login-text">Sign Up</h1>
        <form className="label-container d-grid gap-2">
          <label className="email">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="rounded form-control input-group mb-3 input"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="rounded form-control col-form-label input-group mb-3 input"
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary submit"
            onClick={handleSignup}
          >
            Submit
          </button>
        </form>
        <div className="signup-container">
          <p className="margin-right">Already have an account?</p>
          <Link to="/login" className="signup-link">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
