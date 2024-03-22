import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

async function getMatchingHobbyUserIDs(
  supabase,
  user,
  hobbies,
  amount,
  offset,
) {
  let hobby_list = hobbies.map((hobby) => hobby.name);

  const { data, error } = await supabase
    .from("hobbies")
    .select("user_id", { distinct: true })
    .in("name", hobby_list)
    .neq("user_id", user.id)
    .order("user_id", { ascending: true })
    .range(offset, offset + amount - 1);

  if (error) {
    throw error;
  }

  let matching_user_ids = [...new Set(data.map((item) => item.user_id))];
  return matching_user_ids;
}

async function getMatchingUserData(supabase, ids) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .in("id", ids);

  if (error) {
    throw error;
  }

  return data;
}

async function getMatchingUserHobbies(supabase, ids) {
  const { data, error } = await supabase
    .from("hobbies")
    .select("*")
    .in("user_id", ids);

  if (error) {
    throw error;
  }

  return data;
}

function appendHobbiesToUsers(users, hobbies) {
  let users_with_hobbies = users.map((user) => {
    let user_hobbies = hobbies.filter((hobby) => hobby.user_id === user.id);
    return { ...user, hobbies: user_hobbies };
  });

  return users_with_hobbies;
}

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user, hobbies, amount, offset } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );

    // Get all user ids that have matching hobbies get range [offset, offset + amount - 1] ids ordered by id ascending
    const match_ids = await getMatchingHobbyUserIDs(
      supabase,
      user,
      hobbies,
      amount,
      offset,
    );

    // Get all user data from the matching user ids
    const matching_user_data = await getMatchingUserData(supabase, match_ids);

    // Get the hobbies of the matching users
    const matching_user_hobbies = await getMatchingUserHobbies(
      supabase,
      match_ids,
    );

    // Add hobbies to their respective users
    const users_with_hobbies = appendHobbiesToUsers(
      matching_user_data,
      matching_user_hobbies,
    );

    return new Response(JSON.stringify(users_with_hobbies), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
