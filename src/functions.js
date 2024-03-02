// This file includes global functions like getting the current user, logging in, logging out, etc.

export async function getUser(supabase, user, setUser) {
  // check if user is null
  if (user) {
    return user;
  }

  try {
    // Attempt to get user from supabase
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return null;
    }

    setUser(data.user);
    return data.user;
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

export async function getHobbies(supabase, user, hobbies, setHobbies) {
  if (hobbies.length > 0 || !user) {
    return;
  }

  try {
    const { data, error } = await supabase
      .from("hobbies")
      .select()
      .eq("user_id", user.id);

    if (error) {
      console.log(error);
      return;
    }

    setHobbies(data);
  } catch (error) {
    console.log(error.message);
  }
}

export async function getProfileInfo(
  supabase,
  user,
  setUser,
  hobbies,
  setHobbies,
) {
  let usr = await getUser(supabase, user, setUser);

  if (usr) {
    await getHobbies(supabase, usr, hobbies, setHobbies);
    return true;
  }

  return false;
}

export async function getMatches(supabase, user, hobbies) {
  if (hobbies.length === 0 || !user) {
    return [];
  }

  let hobby_list = hobbies.map((hobby) => hobby.name);
  let matching_hobbies = [];

  try {
    const { data, error } = await supabase
      .from("hobbies")
      .select("user_id")
      .in("name", hobby_list)
      .neq("user_id", user.id);

    if (error) {
      console.log(error);
      return [];
    }

    matching_hobbies = data.map((match) => match.user_id);
  } catch (error) {
    console.log(error.message);
    return [];
  }

  if (matching_hobbies.length === 0) {
    return [];
  }

  // Get user info for each match
  let matches = [];
  let match_uids = [];
  try {
    const { data, error } = await supabase
      .from("users")
      .select()
      .in("id", matching_hobbies);

    if (error) {
      console.log(error);
      return [];
    }

    matches = data;
    match_uids = data.map((match) => match.id);
  } catch (error) {
    console.log(error.message);
    return [];
  }

  if (match_uids.length === 0) {
    return [];
  }

  // Get the hobbies for all matches
  let match_hobbies = [];
  try {
    const { data, error } = await supabase
      .from("hobbies")
      .select()
      .in("user_id", match_uids);

    if (error) {
      console.log(error);
      return [];
    }

    match_hobbies = data;
  } catch (error) {
    console.log(error.message);
    return [];
  }

  // Add each hobby's name and skill to each match
  for (let i = 0; i < matches.length; i++) {
    let match = matches[i];
    let match_id = match.id;
    let filtered_matches = match_hobbies.filter(
      (hobby) => hobby.user_id === match_id,
    );
    let trimmed_hobbies = [];

    for (let j = 0; j < filtered_matches.length; j++) {
      let hobby = filtered_matches[j];
      trimmed_hobbies[j] = { name: hobby.name, skill: hobby.skill };
    }

    matches[i].hobbies = trimmed_hobbies;
  }

  return matches;
}
