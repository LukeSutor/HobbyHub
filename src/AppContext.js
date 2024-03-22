/* eslint-disable no-undef */

import { React, createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Create a context
const AppContext = createContext();

// Create a provider component
export function AppProvider({ children }) {
  const [user, setUser] = useState(null); // User information
  const [hobbies, setHobbies] = useState([]); // User hobbies
  const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY,
  );

  return (
    <AppContext.Provider
      value={{ user, setUser, hobbies, setHobbies, supabase }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Custom hook to access the context
export function useAppContext() {
  return useContext(AppContext);
}
