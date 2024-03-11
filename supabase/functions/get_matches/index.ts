// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.
import { createClient } from 'https://esm.sh/@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

console.log("Hello from Functions!")

async function getMatchingHobbyUserIDs(supabase, user, hobbies, amount, offset) {
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

  let matching_user_ids = [...new Set(data.map(item => item.user_id))];;
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
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { user, hobbies, amount, offset } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Get all user ids that have matching hobbies get range [offset, offset + amount - 1] ids ordered by id ascending
    const match_ids = await getMatchingHobbyUserIDs(supabase, user, hobbies, amount, offset)

    // Get all user data from the matching user ids
    const matching_user_data = await getMatchingUserData(supabase, match_ids)

    // Get the hobbies of the matching users
    const matching_user_hobbies = await getMatchingUserHobbies(supabase, match_ids)

    // Add hobbies to their respective users
    const users_with_hobbies = appendHobbiesToUsers(matching_user_data, matching_user_hobbies)

    return new Response(JSON.stringify(users_with_hobbies), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get_matches' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
