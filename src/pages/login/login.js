import React, { useState } from "react";
import { useAppContext } from "../../AppContext";
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
    <div className="container rounded-4">
      <h1 className="login-text">Welcome Back</h1>
      <form className="label-container d-grid gap-2">
        <label className="email">
          <input
            type="email"
            name="email"
            className="rounded form-control input-group mb-3\"
            placeholder="Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          <input
            type="password"
            name="password"
            className="rounded form-control col-form-label input-group mb-3"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </label>
        <button type="submit" className="btn btn-primary" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
}
