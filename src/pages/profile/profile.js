import React, { useState, useEffect } from "react";

import { useAppContext } from "../../AppContext";

export default function Profile() {
  const { user, hobbies, setHobbies, supabase } = useAppContext();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  function handleDeleteHobby(id) {
    setHobbies(hobbies.filter((hobby) => hobby.id !== id));
  }

  console.log(user);

  return (
    <div>
      <h1>Profile</h1>
      <h2>Welcome, {user?.email}</h2>
      <h3>Your hobbies:</h3>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.id}>
            {hobby.name}{" "}
            <button onClick={() => handleDeleteHobby(hobby.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
