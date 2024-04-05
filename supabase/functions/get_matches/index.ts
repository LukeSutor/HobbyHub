import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

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

    // Get matching user IDs based on hobbies in range [offset, offset + amount - 1] sorted by user_id ascending
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

    // Get user data with associated hobbies for matching user IDs
    const { data: user_matches_data, error: user_matches_error } =
      await supabase
        .from("users")
        .select("*, hobbies(*)")
        .in("id", matching_user_ids);

    return new Response(JSON.stringify(user_matches_data), {
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
