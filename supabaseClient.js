const { createClient } = require("@supabase/supabase-js");
require("dotenv").config(); // Pastikan .env terload

const supabaseUrl = "https://cyyxgrvngltsarapobfd.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error("SUPABASE_KEY is missing in .env file!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
