import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import { getProfileInfo, getMatchedUsers } from "../../functions";

export default function Matches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  useEffect(() => {
    setLoading(true);
    // Attempt to get user
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then(() => {
      fetchMatches().then(() => setLoading(false));
    });
  }, []);

  async function fetchMatches() {
    if (!user) {
      return;
    }

    await getMatchedUsers(supabase, user, setMatches);
  }

  return (
    <div>
      <h1>Matches</h1>
      <button onClick={fetchMatches}>Fetch Matches</button>
      {loading && <p>Loading...</p>}
      {matches &&
        matches.map((match, index) => (
          <div key={index}>
            <p>{match.name}</p>
            <p>{match.email}</p>
            <p>{match.hobbies}</p>
          </div>
        ))}
    </div>
  );
}
