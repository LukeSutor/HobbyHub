// This file includes global functions like getting the current user, logging in, logging out, etc.

export async function getUser(supabase, user, setUser) {
  // check if user is null
  if (user) {
    return true;
  }

  try {
    // Attempt to get user from supabase
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.log(error);
      return false;
    }

    setUser(data.user);
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
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
