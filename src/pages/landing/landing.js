import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import {
  getUser,
  getHobbies,
  getProfileInfo,
  getMatches,
} from "../../functions";

export default function Landing() {
  const fetchNumber = 10; // Number of matches to fetch with each request
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const [offset, setOffset] = useState(0); // Stores offset of new matches to fetch
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  useEffect(() => {
    setLoading(true);
    // Attempt to get user and redirect if failed
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then(() => {
      setLoading(false);
    });
  }, []);

  async function getMatches() {
    if (!user) {
      return;
    }

    const { data, error } = await supabase.functions.invoke("get_matches", {
      body: {
        user: user,
        hobbies: hobbies,
        amount: fetchNumber,
        offset: offset,
      },
    });

    if (error) {
      console.log(error);
      return;
    }

    console.log(data);

    setMatches([...matches, ...data]);
    setOffset(offset + fetchNumber);
  }

  async function createMatch(match_id) {
    if (!user) {
      return;
    }

    const { data, error } = await supabase.functions.invoke("create_match", {
      body: { user_id: user.id, match_id: match_id },
    });

    if (error) {
      console.log(error);
      return;
    }

    if (data.operation == "full_match_created") {
      console.log("Full match created");
    } else if (data.operation == "partial_match_created") {
      console.log("Partial match created");
    } else {
      console.log("Match already exists");
    }
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
        {/* Display matches */}
        {matches.length === 0 ? (
          <h2>No matches</h2>
        ) : (
          <ul>
            {matches.map((match) => {
              return (
                <li key={match.id}>
                  <h2>{match.email}</h2>
                  <ul>
                    {match.hobbies.map((hobby) => {
                      return (
                        <li key={hobby.name}>
                          <p>Name: {hobby.name}</p>
                          <p>Skill level: {hobby.skill}</p>
                        </li>
                      );
                    })}
                  </ul>
                  <button onClick={() => createMatch(match.id)}>
                    Create Match with {match.email.split("@")[0]}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        <button onClick={getMatches}>
          {matches.length === 0 ? "Get Matches" : "More Matches"}
        </button>
      </div>
    );
  }

  // Return different components based on user login status
  return <div>{user ? authLanding() : unauthLanding()}</div>;
}
