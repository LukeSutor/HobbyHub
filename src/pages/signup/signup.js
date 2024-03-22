import React, { useState } from "react";
import { useAppContext } from "../../AppContext";

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
    <div>
      <h1>Sign Up</h1>
      <form>
        <label>
          Email:
          <input
            type="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" onClick={handleSignup}>
          Submit
        </button>
      </form>
    </div>
  );
}
