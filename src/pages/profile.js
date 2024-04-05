import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { hobby_list } from "../components/hobbies_list";

export default function Profile() {
  const [newHobbyName, setNewHobbyName] = useState("");
  const [newHobbySkillLevel, setNewHobbySkillLevel] = useState(0);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const { user, hobbies, setHobbies, loading, supabase } = useAppContext();

  useEffect(() => {
    document.title = "Profile | Hobby Hub";
    // Redirect user if not logged in
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading]);

  async function handeAddHobby(event) {
    event.preventDefault();

    // Check if hobby already exists
    if (hobbies.find((hobby) => hobby.name === newHobbyName)) {
      alert("Hobby already exists");
      return;
    }

    // Check if hobby is in hobbies list
    if (!hobby_list.includes(newHobbyName)) {
      alert("Must choose skill from dropdown");
      return;
    }

    // Check if skill level is in range [1, 5]
    if (newHobbySkillLevel < 1 || newHobbySkillLevel > 5) {
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

    setNewHobbyName("");
    setNewHobbySkillLevel(0);
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

  function handleInputChange(event) {
    const value = event.target.value.toLowerCase();
    const filtered = hobby_list.filter((hobby) =>
      hobby.toLowerCase().includes(value),
    );
    setFilteredHobbies([...new Set(filtered)]);
    setNewHobbyName(value);
  }

  function handleHobbyClick(hobby) {
    setNewHobbyName(hobby);
    setFilteredHobbies([]);
  }

  const skillLevels = {
    1: "Beginner",
    2: "Novice",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold text-center my-12">Profile</h1>
      <div className="w-2/3 p-12 bg-gray-50 border border-gray-200 shadow rounded-lg">
        {loading ? (
          <div className="flex flex-col space-y-8 animate-pulse">
            <div className="h-8 w-1/5 bg-gray-200 rounded-lg" />
            <div className="h-8 w-1/6 bg-gray-200 rounded-lg" />
            <div className="h-24 bg-gray-200 rounded-lg" />
            <div className="h-8 w-1/6 bg-gray-200 rounded-lg" />
            <div className="h-24 bg-gray-200 rounded-lg" />
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Welcome, {user?.email}
            </h2>
            <h3 className="text-lg font-semibold mb-2">Your hobbies:</h3>
            <div className="grid grid-cols-3 gap-12 p-4 mb-6 bg-gray-100 border border-gray-200 shadow rounded-lg">
              {hobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="px-8 py-3 border border-gray-300 rounded-lg whitespace-nowrap"
                >
                  <p className="text-lg mb-1">{hobby.name}</p>
                  <p className="mb-2">Skill: {hobby.skill}</p>
                  <button
                    onClick={() => handleDeleteHobby(hobby.name)}
                    className="w-full py-2 bg-red-100 border border-red-200 rounded-lg shadow"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <p className="text-lg font-semibold mb-2">Add hobby:</p>
            <div className="w-full p-4 mb-6 bg-gray-100 border border-gray-200 shadow rounded-lg">
              <form
                onSubmit={handeAddHobby}
                className="w-full flex flex-row justify-between items-end "
              >
                <label className="group relative flex flex-col w-1/3">
                  <p className="ml-1 text-sm">Hobby Name</p>
                  <input
                    type="text"
                    name="hobby"
                    onChange={handleInputChange}
                    placeholder="Begin typing..."
                    value={newHobbyName}
                    className="w-full text-sm border border-gray-200 p-3 rounded-lg"
                  />
                  <div
                    className={`absolute bottom-0 transform translate-y-full w-full bg-white ${newHobbyName === "" ? "hidden" : ""}`}
                  >
                    {filteredHobbies.splice(0, 5).map((hobby, index) => (
                      <p
                        key={index}
                        onClick={() => handleHobbyClick(hobby)}
                        className="p-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        {hobby}
                      </p>
                    ))}
                  </div>
                </label>
                <label className="flex flex-col w-1/3">
                  <p className="ml-1 text-sm">Skill Level</p>
                  <select
                    name="skillLevel"
                    value={newHobbySkillLevel}
                    className="w-full text-sm border border-gray-200 p-3 rounded-lg"
                    onChange={(e) => setNewHobbySkillLevel(e.target.value)}
                  >
                    {Object.entries(skillLevels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="submit"
                  onClick={handeAddHobby}
                  className="px-4 py-2.5 font-semibold bg-green-100 border border-green-300 rounded-lg"
                >
                  Add
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
