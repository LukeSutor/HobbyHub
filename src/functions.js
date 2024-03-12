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

    await setUser(data.user);
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
    .select("*, user1: user1_id(*), user2: user2_id(*)")
    .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`);

  if (error) {
    console.log(error);
    return [];
  }

  // Remove user from matches
  const matches = data.filter((match) => {
    if (match.user1_id.id === user.id) {
      return match.user2;
    }
    return match.user1;
  });

  // Loop through matches and remove user object that is the current user
  for (let i = 0; i < matches.length; i++) {
    if (matches[i].user1.id === user.id) {
      matches[i].user = matches[i].user2;
      delete matches[i].user1;
      delete matches[i].user2;
    } else {
      matches[i].user = matches[i].user1;
      delete matches[i].user1;
      delete matches[i].user2;
    }
  }

  setMatches(matches);
}

export async function unmatchUser(supabase, user, match_id) {
  if (!user) {
    return;
  }

  // Delete match from full-matches
  const { data, error } = await supabase
    .from("full-matches")
    .delete()
    .or(`user1_id.eq.${user.id},user2_id.eq.${match_id}`)
    .or(`user1_id.eq.${match_id},user2_id.eq.${user.id}`);

  if (error) {
    console.log(error);
    return;
  }

  // Delete match from partial-matches
  const { data: partial_data, error: partial_error } = await supabase
    .from("partial-matches")
    .delete()
    .eq("sender_id", user.id);

  if (partial_error) {
    console.log(partial_error);
    return;
  }
}
