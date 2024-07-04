import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Named export for the GET method
export async function GET(req, res) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const user_id = searchParams.get("user_id");

  if (!email || !user_id) {
    console.log("Missing email or user_id:", email, user_id);
    return new Response("Email and user ID are required", { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("email_tracking")
      .insert([
        { email, user_id, tracked: true, created_at: new Date().toISOString() },
      ]);

    if (error) {
      console.log("Error inserting data:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    console.log("Data inserted successfully:", data);

    return new Response("", {
      status: 200,
      headers: {
        "Content-Type": "image/gif",
        "Content-Length": "0",
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Unexpected error occurred" }),
      { status: 500 }
    );
  }
}
