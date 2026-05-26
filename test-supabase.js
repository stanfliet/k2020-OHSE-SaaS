// Test Supabase Connection
// Run this in browser console to debug connection issues

async function testSupabaseConnection() {
  console.log("🔍 Testing Supabase Connection...\n");

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("📋 Environment Check:");
  console.log("VITE_SUPABASE_URL:", supabaseUrl ? "✓ Set" : "✗ Missing");
  console.log("VITE_SUPABASE_ANON_KEY:", supabaseKey ? "✓ Set" : "✗ Missing");

  if (!supabaseUrl || !supabaseKey) {
    console.error("\n❌ Missing environment variables!");
    return;
  }

  try {
    console.log("\n🔗 Testing API Connectivity...");

    // Test basic API endpoint
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      console.log("✓ Supabase API is reachable!");
    } else {
      console.warn(`⚠️ API returned status ${response.status}`);
    }

    // Test auth endpoint
    console.log("\n🔐 Testing Auth Endpoint...");
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: supabaseKey }
    });

    if (authResponse.ok) {
      const settings = await authResponse.json();
      console.log("✓ Auth is configured!");
      console.log("Auth settings:", settings);
    } else {
      console.warn(`⚠️ Auth endpoint returned status ${authResponse.status}`);
    }

    console.log("\n✅ Supabase connection test complete!");
  } catch (error) {
    console.error("\n❌ Connection test failed:", error.message);
    console.error("Full error:", error);
  }
}

// Run the test
testSupabaseConnection();
