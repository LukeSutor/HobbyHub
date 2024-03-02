import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import {
  getUser,
  getHobbies,
  getProfileInfo,
  getMatches,
} from "../../functions";

export default function Landing() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  useEffect(() => {
    setLoading(true);
    // Attempt to get user and redirect if failed
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then(() => {
      setLoading(false);
    });
  }, []);

  async function handleGetMatches() {
    // Attempt to get matches
    getMatches(supabase, user, hobbies).then((data) => {
      setMatches(data);
    });
  }

  // Loading landing page
  if (loading) {
    return <div></div>;
  }

  // Landing page for unauthenticated users
  function unauthLanding() {
    return (
      <div>
        <h1>Unauthenticated landing page</h1>
      </div>
    );
  }

  // Landing page for authenticated users
  function authLanding() {
    return (
      <div>
        <h1>Authenticated landing page</h1>
        <button onClick={handleGetMatches}>Get matches</button>
        <ul>
          {matches.map((match) => {
            return (
              <li key={match.id}>
                <h2>{match.email}</h2>
                <ul>
                  {/* {match.hobbies[0].name} */}
                  {match.hobbies.map((hobby) => {
                    return (
                      <li key={hobby.name}>
                        <p>Name: {hobby.name}</p>
                        <p>Skill level: {hobby.skill}</p>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Return different components based on user login status
  return <div>{user ? authLanding() : unauthLanding()}</div>;
}
