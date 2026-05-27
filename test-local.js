// Local Testing - Copy this to browser console (F12) to test Supabase

console.log("🔍 Starting K2020 OHSE Local Diagnostics...\n");

// Test 1: Environment Variables
console.log("📋 TEST 1: Environment Variables");
console.log("================================");

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("❌ VITE_SUPABASE_URL is missing");
} else {
  console.log("✓ VITE_SUPABASE_URL:", supabaseUrl);
}

if (!supabaseKey) {
  console.error("❌ VITE_SUPABASE_ANON_KEY is missing");
} else {
  console.log("✓ VITE_SUPABASE_ANON_KEY:", supabaseKey.substring(0, 20) + "...");
}

// Test 2: Network Connectivity
console.log("\n🌐 TEST 2: Network Connectivity to Supabase");
console.log("============================================");

(async () => {
  try {
    const response = await fetch(supabaseUrl, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok || response.status === 401) {
      console.log("✓ Supabase URL is reachable");
      console.log(`  Status: ${response.status}`);
    } else {
      console.error(`❌ Unexpected status: ${response.status}`);
    }
  } catch (error) {
    console.error("❌ Cannot connect to Supabase URL");
    console.error("   Error:", error.message);
    console.error("   This usually means:");
    console.error("   - Invalid Supabase URL");
    console.error("   - Network connectivity issue");
    console.error("   - Firewall blocking the connection");
  }

  // Test 3: Auth Endpoint
  console.log("\n🔐 TEST 3: Supabase Auth Endpoint");
  console.log("=================================");

  try {
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        "apikey": supabaseKey,
      },
    });

    if (authResponse.ok) {
      console.log("✓ Auth endpoint is accessible");
      const settings = await authResponse.json();
      console.log("  Features enabled:", Object.keys(settings).length);
    } else {
      console.warn(`⚠️ Auth endpoint status: ${authResponse.status}`);
    }
  } catch (error) {
    console.error("❌ Cannot reach auth endpoint");
    console.error("   Error:", error.message);
  }

  // Test 4: Backend Connectivity
  console.log("\n🔌 TEST 4: Backend API Connectivity");
  console.log("===================================");

  try {
    const backendUrl = import.meta.env.VITE_API_URL;
    if (!backendUrl) {
      console.warn("⚠️ VITE_API_URL not set");
    } else {
      const healthResponse = await fetch(`${backendUrl}/api/health`);
      if (healthResponse.ok) {
        const health = await healthResponse.json();
        console.log("✓ Backend is responding");
        console.log("  Status:", health.status);
        console.log("  Version:", health.version);
      } else {
        console.error(`❌ Backend returned status ${healthResponse.status}`);
      }
    }
  } catch (error) {
    console.warn("⚠️ Backend not available (expected if not running)");
    console.warn("  Start backend with: npm start");
  }

  // Summary
  console.log("\n📊 DIAGNOSTIC SUMMARY");
  console.log("====================");
  console.log("If all tests above show ✓, your setup is correct!");
  console.log("If you see ❌, follow the troubleshooting guide:");
  console.log("See: COMPLETE_FIX_GUIDE.md");

  console.log("\n💡 Next Steps:");
  console.log("1. Verify all ✓ marks above");
  console.log("2. Try signup again");
  console.log("3. Check browser console for error messages");
  console.log("4. If still failing, follow COMPLETE_FIX_GUIDE.md");
})();
