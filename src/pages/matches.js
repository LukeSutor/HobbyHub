import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { getProfileInfo, getMatchedUsers, unmatchUser } from "../functions";

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
      <h1 className="text-3xl font-semibold text-center my-12">Matches</h1>
      {loading && <p>Loading...</p>}
      <div className="flex flex-col gap-y-6 justify-center items-center">
        {matches &&
          matches.map((match, index) => (
            <div
              key={index}
              className="flex flex-row justify-between items-center w-1/3 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
            >
              <p>{match.user.email}</p>
              <button
                onClick={() => deleteMatch(match.id)}
                className="bg-red-200 border border-red-400 font-semibold px-3 py-2 rounded-lg shadow"
              >
                Unmatch
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}