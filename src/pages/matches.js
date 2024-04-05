import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { Link } from "react-router-dom";
import { unmatchUser } from "../functions";

export default function Matches() {
  const { user, matches, setMatches, loading, supabase } =
    useAppContext();

  useEffect(() => {
    document.title = "Matches | Hobby Hub";
    // Redirect user if not logged in
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [loading]);

  async function deleteMatch(match_id) {
    if (!user) {
      return;
    }

    await unmatchUser(supabase, user, match_id).then(() => {
      setMatches(matches.filter((match) => match.user.id !== match_id));
    });
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-12">Matches</h1>
      {loading ? (
        <div className="flex flex-col gap-y-6 justify-center items-center animate-pulse">
          <div className="flex flex-row items-center w-1/3 h-20 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow" />
          <div className="flex flex-row items-center w-1/3 h-20 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow" />
          <div className="flex flex-row items-center w-1/3 h-20 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow" />
        </div>
      ) : (
        <div className="flex flex-col gap-y-6 justify-center items-center">
          {matches &&
            matches.map((match, index) => (
              <div
                key={index}
                className="flex flex-row justify-between items-center w-1/3 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
              >
                <p>{match.user.email}</p>
                <div className="flex flex-row gap-x-6">
                  <Link
                    to={`/chat/${match.user.id}`}
                    className="bg-blue-200 border border-blue-400 font-semibold px-3 py-2 rounded-lg shadow"
                  >
                    Chat
                  </Link>
                  <button
                    onClick={() => deleteMatch(match.user.id)}
                    className="bg-red-200 border border-red-400 font-semibold px-3 py-2 rounded-lg shadow"
                  >
                    Unmatch
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
