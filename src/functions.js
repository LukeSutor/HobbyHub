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

export async function getMatchedUsers(supabase, user, setMatches) {
  if (!user) {
    return [];
  }

  // Fetch all full matches where user1_id or user2_id is equal to the current user
  const { data, error } = await supabase
    .from("full-matches")
    .select()
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (error) {
    console.log(error);
    return [];
  }

  console.log("data", data);

  if (data.length === 0) {
    return [];
  }

  // Loop through matches and extract user ids that arent equal to the current user
  let matches = data.map((match) => {
    if (match.user1_id !== user.id) {
      return match.user1_id;
    } else {
      return match.user2_id;
    }
  });

  console.log("matches", matches);

  // Fetch all users that are in matches
  const { user_data, user_error } = await supabase
    .from("users")
    .select("email")
    .eq("id", matches[0]);
  // .in("id", matches);

  if (user_error) {
    console.log(user_error);
    return [];
  }

  console.log("user_data", user_data);

  setMatches(user_data);
  return user_data;
}
