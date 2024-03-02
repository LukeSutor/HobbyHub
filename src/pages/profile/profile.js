import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import { getProfileInfo } from "../../functions";

export default function Profile() {
  const [newHobbyName, setNewHobbyName] = useState("");
  const [newHobbySkillLevel, setNewHobbySkillLevel] = useState(0);
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  useEffect(() => {
    // Attempt to get user and redirect if failed
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then((res) => {
      if (!res) {
        window.location.href = "/login";
      }
    });
  }, []);

  async function handeAddHobby(event) {
    event.preventDefault();

    // Check if hobby already exists
    if (hobbies.find((hobby) => hobby.name === newHobbyName)) {
      alert("Hobby already exists");
      return;
    }

    // Check if skill level is in range [0, 5]
    if (newHobbySkillLevel < 0 || newHobbySkillLevel > 5) {
      alert("Skill level must be in range [0, 5]");
      return;
    }

    supabase
      .from("hobbies")
      .insert([
        { name: newHobbyName, skill: newHobbySkillLevel, user_id: user.id },
      ])
      .select()
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        // Add domain to domains
        setHobbies([...hobbies, data.data[0]]);
      });
  }

  async function handleDeleteHobby(name) {
    setHobbies(hobbies.filter((hobby) => hobby.name !== name));

    supabase
      .from("hobbies")
      .delete()
      .eq("user_id", user.id)
      .eq("name", name)
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          return;
        }
        // Remove domain from domains
        setHobbies(hobbies.filter((hobby) => hobby.name !== name));
      });
  }

  return (
    <div>
      <h1>Profile</h1>
      <h2>Welcome, {user?.email}</h2>
      <h3>Your hobbies:</h3>
      <ul>
        {hobbies.map((hobby) => (
          <li key={hobby.name}>
            {hobby.name}{" "}
            <button onClick={() => handleDeleteHobby(hobby.name)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <p>add hobby</p>
      <form onSubmit={handeAddHobby}>
        <label>
          Hobby:
          <input
            type="text"
            name="hobby"
            onChange={(e) => setNewHobbyName(e.target.value)}
          />
        </label>
        <label>
          Skill Level:
          <input
            type="number"
            name="skillLevel"
            onChange={(e) => setNewHobbySkillLevel(e.target.value)}
          />
        </label>
        <button type="submit" onClick={handeAddHobby}>
          Add
        </button>
      </form>
    </div>
  );
}
