import React, { useState } from "react";
import { useAppContext } from "../../AppContext";
import { Link } from "react-router-dom";
import "./login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  async function handleLogin(event) {
    event.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setUser(data.user);
  }

  return (
    <div className="page">
      <div className="container rounded-4">
        <h1 className="login-text">Welcome Back</h1>
        <form className="label-container d-grid gap-2">
          <label className="email">
            <input
              type="email"
              name="email"
              className="rounded form-control input-group mb-3 input"
              placeholder="Email Address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label>
            <input
              type="password"
              name="password"
              className="rounded form-control col-form-label input-group mb-3 input"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </label>
          <button
            type="submit"
            className="btn btn-primary submit"
            onClick={handleLogin}
          >
            Login
          </button>
          <div className="signup-container">
            <p className="margin-right">Dont have an account yet?</p>
            <Link to="/signup" className="signup-link">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
