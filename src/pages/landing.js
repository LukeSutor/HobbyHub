import React, { useState, useEffect } from "react";
import { useAppContext } from "../AppContext";
import { getUser, getHobbies, getProfileInfo, getMatches } from "../functions";

export default function Landing() {
  const fetchNumber = 10; // Number of matches to fetch with each request
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false); // Loading state for fetching matches
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

  useEffect(() => {
    setLoadingMatches(true);
    getMatches().then(() => setLoadingMatches(false));
  }, [user, hobbies]);

  async function getMatches() {
    if (hobbies.length === 0 || !user) {
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

  function hobbyMatch(hobby) {
    // Loop through hobbies and return true if it matches
    for (let i = 0; i < hobbies.length; i++) {
      if (hobbies[i].name === hobby.name) {
        return true;
      }
    }
    return false;
  }

  // Loading landing page
  if (loading) {
    return <div></div>;
  }

  // Landing page for unauthenticated users
  function unauthLanding() {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold text-center mb-8">
          Welcome to Hobby Hub
        </h1>
        <p className="text-lg text-center mb-6">
          Hobby Hub is where connections are made through shared passions. Say
          goodbye to aimless swiping and hello to meaningful interactions with
          like-minded individuals.
        </p>
        <p className="text-lg text-center mb-6">
          With Hobby Hub, finding friends, activity partners, or even romance is
          as easy as swiping right on hobbies you love. Discover new interests,
          expand your social circle, and embark on exciting adventures—all with
          a simple swipe.
        </p>
        <p className="text-lg text-center mb-6">
          Join our community today and start connecting with people who share
          your enthusiasm for life. Hobby Hub: where connections flourish
          through the joy of shared hobbies.
        </p>
      </div>
    );
  }

  // Landing page for authenticated users
  function authLanding() {
    return (
      <div>
        {/* Display matches */}
        {matches.length === 0 && !loadingMatches ? (
          <div>
            <h1 className="text-3xl font-semibold text-center my-12">
              No matches
            </h1>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold text-center my-12">
              Matches
            </h1>
            <div className="flex flex-col gap-y-6 justify-center items-center">
              {matches.map((match) => {
                return (
                  <div
                    key={match.id}
                    className="flex flex-col w-1/3 px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl shadow"
                  >
                    <h2 className="text-2xl font-semibold mb-4">
                      {match.email}
                    </h2>
                    <p className="text-xl mb-2">Skills & Hobbies:</p>
                    <div className="grid grid-cols-2 px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow">
                      {match.hobbies.map((hobby) => {
                        return (
                          <div
                            key={hobby.name}
                            className={`w-min whitespace-nowrap px-3 py-2 rounded-lg ${hobbyMatch(hobby) ? "bg-green-100 border border-green-300 shadow" : ""}`}
                          >
                            <p className="text-lg font-semibold">
                              {hobby.name}
                            </p>
                            <p>Skill level: {hobby.skill}</p>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => createMatch(match.id)}
                      className="w-full px-6 py-3 font-semibold bg-blue-100 border border-blue-300 shadow rounded-lg mt-6"
                    >
                      Create Match with {match.email.split("@")[0]}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        <div className="w-full flex justify-center items-center my-10">
          {!loadingMatches &&
          matches.length % fetchNumber !== 0 &&
          matches.length !== 0 ? (
            <div>
              <p className="text-xl font-semibold">No more Matches</p>
            </div>
          ) : (
            <button
              onClick={getMatches}
              className="px-6 py-3 text-xl font-semibold bg-yellow-100 border border-yellow-300 shadow rounded-lg"
            >
              {matches.length === 0 ? "Get Matches" : "More Matches"}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Return different components based on user login status
  return <div>{user ? authLanding() : unauthLanding()}</div>;
}
