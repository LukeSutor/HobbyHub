import { createClient } from "https://esm.sh/@supabase/supabase-js";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { user_id, match_id } = await req.json();
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      },
    );
    let return_data = {};

    // See if full match exists
    const { data: match_exists, error: exists_error } = await supabase.rpc(
      "check_match",
      {
        user_id: user_id,
        match_id: match_id,
      },
    );

    if (exists_error) {
      throw exists_error;
    }

    if (match_exists) {
      return new Response(JSON.stringify({ operation: "match_exists" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // See if partial match exists
    const { data, error } = await supabase
      .from("partial-matches")
      .select("*")
      .eq("receiver_id", user_id)
      .eq("sender_id", match_id);

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      // Partial match already exists, create full match
      const { data, error } = await supabase
        .from("full-matches")
        .insert([{ user1_id: user_id, user2_id: match_id }]);

      if (error) {
        throw error;
      } else {
        return_data = { operation: "full_match_created" };
      }
    } else {
      // Partial match does not exist, create partial match
      const { data, error } = await supabase
        .from("partial-matches")
        .insert([{ sender_id: user_id, receiver_id: match_id }]);

      if (error) {
        // This user has already created a partial match with this user
        return_data = { operation: "partial_match_exists" };
      } else {
        return_data = { operation: "partial_match_created" };
      }
    }

    return new Response(JSON.stringify(return_data), {
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
