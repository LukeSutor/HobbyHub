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