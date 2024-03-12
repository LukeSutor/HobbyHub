import React, { useState, useEffect } from "react";
import { useAppContext } from "../../AppContext";
import { getProfileInfo, getMatchedUsers, unmatchUser } from "../../functions";

export default function Matches() {
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);
  const { user, setUser, hobbies, setHobbies, supabase } = useAppContext();

  useEffect(() => {
    setLoading(true);
    // Attempt to get user
    getProfileInfo(supabase, user, setUser, hobbies, setHobbies).then(() =>
      setLoading(false),
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchMatches().then(() => setLoading(false));
  }, [user]);

  async function fetchMatches() {
    if (!user) {
      return;
    }

    await getMatchedUsers(supabase, user, setMatches);
  }

  async function deleteMatch(match_id) {
    if (!user) {
      return;
    }

    await unmatchUser(supabase, user, match_id);
    setMatches(matches.filter((match) => match.id !== match_id));
  }

  return (
    <div>
      <h1>Matches</h1>
      <button onClick={fetchMatches}>Fetch Matches</button>
      {loading && <p>Loading...</p>}
      {matches &&
        matches.map((match, index) => (
          <div key={index}>
            <p>{match.user.email}</p>
            <p>id: {match.user.id}</p>
            <button onClick={() => deleteMatch(match.id)}>Unmatch</button>
          </div>
        ))}
    </div>
  );
}
