/* eslint-disable no-undef */

import { React, createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { getProfileInfo, getMatchedUsers, unmatchUser } from "./functions";

// Create a context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // User information
  const [hobbies, setHobbies] = useState([]); // User hobbies
  const [matches, setMatches] = useState([]); // User matches
  const [chats, setChats] = useState([]); // User chats
  const [loading, setLoading] = useState(true); // Loading state for fetching profile information
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY,
  );

  // Fetch and set user information
  useEffect(() => {
    console.log("AppProvider useEffect");
    setLoading(true);
    getProfileInfo(
      supabase,
      user,
      setUser,
      hobbies,
      setHobbies,
      setMatches,
      setChats,
    ).then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        hobbies,
        setHobbies,
        matches,
        setMatches,
        chats,
        setChats,
        loading,
        setLoading,
        supabase,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to access the context
export function useAppContext() {
  return useContext(AppContext);
}
