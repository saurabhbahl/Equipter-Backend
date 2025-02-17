import { SF_ACCESS_TOKEN_URL } from "../useENV.js";
import memoryCache from "memory-cache";
let sfAccessToken = memoryCache.get("access_token");

export async function getSFAccessToken() {
  try {
    console.log(sfAccessToken)
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
      memoryCache.put("access_token", sfAccessToken, 3600 * 2); 
      console.log("Fetched new Salesforce token:");
      return sfAccessToken;
    } else {
      throw new Error("Failed to fetch Salesforce access token");
    }
  } catch (error) {
    console.error("Error fetching Salesforce access token:", error);
    throw error;
  }
}