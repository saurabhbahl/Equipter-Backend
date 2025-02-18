import { SF_ACCESS_TOKEN_URL } from "../useENV.js";
import memoryCache from "memory-cache";
let sfAccessToken = memoryCache.get("access_token");

export async function getSFAccessToken() {
  try {
    console.log("call")
    if (sfAccessToken!==null) {
      console.log("Reusing cached Salesforce token");
      return sfAccessToken;
    }
    const response = await fetch(SF_ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const data = await response.json();
    if (data.access_token) {
      sfAccessToken = data.access_token;
      memoryCache.put("access_token", sfAccessToken, 3600*2); 
      console.log("Fetched new Salesforce token");
      return sfAccessToken;
    } else {
      throw new Error("Failed to fetch Salesforce access token");
    }
  } catch (error) {
    console.error("Error fetching Salesforce access token:", error);
    throw error;
  }
}



// import memoryCache from "memory-cache";
// import { SF_ACCESS_TOKEN_URL } from "../useENV.js";

// // The callback that re-fetches the token when old one is removed/expired
// async function onTokenRemoved() {
//   try {
//     console.log(" Access token expired/removed. Fetching new token...");
//     // Re-fetch a new token
//     const newToken = await fetchNewTokenFromSalesforce();
//     // Re-store in cache with a fresh TTL and callback
//     memoryCache.put("access_token", newToken, 7200000, onTokenRemoved);
//   } catch (error) {
//     console.error("[memoryCache] Failed to re-fetch token in callback:", error);
//   }
// }

// export async function getSFAccessToken() {
//   // Check if we have a cached token
//   let sfAccessToken = memoryCache.get("access_token");
//   if (sfAccessToken) {
//     console.log("Reusing cached Salesforce token");
//     return sfAccessToken;
//   }

//   // Otherwise fetch a new token
//   try {
//     console.log("Fetching new Salesforce token (no cache)...");
//     const newToken = await fetchNewTokenFromSalesforce();
//     // Cache it with a 2-hour TTL (in ms) + callback
//     memoryCache.put("access_token", newToken, 7200000, onTokenRemoved);
//     return newToken;
//   } catch (err) {
//     console.error("Error fetching new Salesforce token:", err);
//     throw err;
//   }
// }

// // The actual token fetch logic
// async function fetchNewTokenFromSalesforce() {
//   const response = await fetch(SF_ACCESS_TOKEN_URL, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//   });
//   const data = await response.json();
//   if (!data.access_token) {
//     throw new Error("Failed to fetch Salesforce access token");
//   }
//   return data.access_token;
// }

