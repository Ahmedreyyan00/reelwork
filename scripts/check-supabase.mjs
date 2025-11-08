import { config } from "dotenv";

config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const TABLE = "video_uploads";

const mask = (value, visible = 6) => {
  if (!value) return "";
  if (value.length <= visible) return value;
  return `${value.slice(0, visible)}…${value.slice(-visible)}`;
};

async function checkSupabase() {
  console.log("🔍 Checking Supabase configuration…");
  console.log("  NEXT_PUBLIC_SUPABASE_URL:", SUPABASE_URL || "(missing)");
  console.log(
    "  SUPABASE_SERVICE_ROLE_KEY:",
    mask(SUPABASE_SERVICE_ROLE_KEY)
  );

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "❌ Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
    process.exit(1);
  }

  const restUrl = `${SUPABASE_URL.replace(
    /\/$/,
    ""
  )}/rest/v1/${TABLE}?select=id&limit=1`;

  console.log(`\n🌐 Testing REST endpoint: ${restUrl}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(restUrl, {
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const details = await response.text();
      console.error(
        `❌ Supabase responded with ${response.status} ${response.statusText}`
      );
      console.error("   Response body:", details);
      process.exit(1);
    }

    const data = await response.json();
    console.log("✅ Supabase connection successful.");
    console.log(
      Array.isArray(data) && data.length > 0
        ? `   Retrieved ${data.length} row(s).`
        : "   Table reachable (no rows returned)."
    );
  } catch (error) {
    clearTimeout(timeout);
    if (error instanceof Error && error.name === "AbortError") {
      console.error(
        "❌ Request timed out (10 seconds). If you are using a proxy or VPN, set HTTPS_PROXY or retry with NODE_OPTIONS=\"--dns-result-order=ipv4first\"."
      );
    } else {
      console.error("❌ Failed to reach Supabase REST endpoint.");
      console.error(error);
    }
    process.exit(1);
  }
}

checkSupabase();
